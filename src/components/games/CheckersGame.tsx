import { useMemo, useState } from 'react'
import {
  BOARD_SIZE,
  applyMove,
  createInitialState,
  destinationKey,
  difficultyLabel,
  getCpuMove,
  getGameResult,
  getMovesForPlayer,
  isPlayableSquare,
  type CheckersDifficulty,
  type GameState,
  type Move,
} from '../../lib/checkers'

function findMove(moves: Move[], toRow: number, toCol: number, from?: [number, number] | null): Move | null {
  const candidates = moves.filter((m) => m.to[0] === toRow && m.to[1] === toCol)
  if (candidates.length === 0) return null
  if (from) {
    const matched = candidates.find((m) => m.from[0] === from[0] && m.from[1] === from[1])
    if (matched) return matched
  }
  if (candidates.length === 1) return candidates[0]
  return candidates.sort((a, b) => b.captures.length - a.captures.length)[0]
}

export function CheckersGame() {
  const [difficulty, setDifficulty] = useState<CheckersDifficulty>('intermediate')
  const [state, setState] = useState<GameState>(createInitialState)
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [thinking, setThinking] = useState(false)
  const [lastMove, setLastMove] = useState<Move | null>(null)

  const level = difficultyLabel(difficulty)
  const cpuLabel = `CPU（${level}）`
  const result = getGameResult(state)
  const playerMoves = useMemo(
    () => (state.turn === 'red' && !thinking ? getMovesForPlayer(state, 'red') : []),
    [state, thinking],
  )

  const activeFrom = state.continueFrom ?? selected

  const visibleMoves = useMemo(() => {
    if (activeFrom) {
      return playerMoves.filter((m) => m.from[0] === activeFrom[0] && m.from[1] === activeFrom[1])
    }
    return playerMoves
  }, [playerMoves, activeFrom])

  const destinationSet = useMemo(
    () => new Set(visibleMoves.map((m) => destinationKey(m.to[0], m.to[1]))),
    [visibleMoves],
  )

  const selectableSet = useMemo(() => {
    const set = new Set<string>()
    for (const move of playerMoves) {
      set.add(destinationKey(move.from[0], move.from[1]))
    }
    return set
  }, [playerMoves])

  const reset = () => {
    setState(createInitialState())
    setSelected(null)
    setThinking(false)
    setLastMove(null)
  }

  const finishCpuTurn = (current: GameState, level: CheckersDifficulty) => {
    setThinking(true)
    window.setTimeout(() => {
      let nextState = current

      const playCpuStep = () => {
        const cpuMove = getCpuMove(nextState, level)
        if (!cpuMove) {
          setState(nextState)
          setThinking(false)
          return
        }

        const applied = applyMove(nextState, cpuMove)
        if (!applied) {
          setThinking(false)
          return
        }

        nextState = applied
        setState(nextState)
        setLastMove(cpuMove)

        if (
          getGameResult(nextState) === 'playing' &&
          nextState.turn === 'white' &&
          getMovesForPlayer(nextState, 'white').length > 0
        ) {
          window.setTimeout(playCpuStep, nextState.continueFrom ? 350 : 500)
          return
        }

        setThinking(false)
      }

      playCpuStep()
    }, 450)
  }

  const handleSquareClick = (row: number, col: number) => {
    if (result !== 'playing' || state.turn !== 'red' || thinking) return
    if (!isPlayableSquare(row, col)) return

    const destKey = destinationKey(row, col)
    const piece = state.board[row][col]

    if (destinationSet.has(destKey)) {
      const move = findMove(visibleMoves, row, col, activeFrom)
      if (!move) return

      const next = applyMove(state, move)
      if (!next) return

      setLastMove(move)
      setState(next)
      setSelected(next.continueFrom)

      if (next.continueFrom) return

      if (next.turn === 'white' && getGameResult(next) === 'playing') {
        finishCpuTurn(next, difficulty)
      }
      return
    }

    if (state.continueFrom) return

    if (piece?.owner === 'red' && selectableSet.has(destKey)) {
      setSelected([row, col])
    } else {
      setSelected(null)
    }
  }

  const status =
    result === 'red-win'
      ? 'あなたの勝ち！ 🎉'
      : result === 'white-win'
        ? `${cpuLabel}の勝ち…`
        : result === 'draw'
          ? '引き分け'
          : thinking
            ? `${cpuLabel}が考え中…`
            : state.continueFrom
              ? '連続で駒を取ってください！'
              : state.turn === 'red'
                ? `あなたの番（赤） / 相手: ${cpuLabel}`
                : `${cpuLabel}の番`

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-coffee-200 bg-white/70 p-3">
        <p className="mb-2 text-center text-sm font-medium text-coffee-700">難易度を選んでください</p>
        <div className="flex justify-center gap-2">
          {(['beginner', 'intermediate'] as const).map((levelOption) => (
            <button
              key={levelOption}
              type="button"
              onClick={() => {
                setDifficulty(levelOption)
                reset()
              }}
              className={`touch-target rounded-xl px-4 py-2 text-sm font-medium transition ${
                difficulty === levelOption
                  ? 'bg-coffee-600 text-cream'
                  : 'border border-coffee-300 bg-white text-coffee-700 hover:border-coffee-400'
              }`}
            >
              {levelOption === 'beginner' ? '初級' : '中級'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-coffee-500">
          {difficulty === 'beginner'
            ? '初級 — 手加減あり。気軽に遊べる相手です'
            : '中級 — 駒取りと位置を読む相手（本気寄り）'}
        </p>
      </div>

      <p className="text-center font-medium text-coffee-700">{status}</p>

      <div className="overflow-x-auto rounded-xl border border-coffee-300 bg-amber-100/80 p-2">
        <div
          className="mx-auto w-fit"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            gap: '1px',
          }}
        >
          {state.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const key = destinationKey(rowIndex, colIndex)
              const playable = isPlayableSquare(rowIndex, colIndex)
              const isDest = destinationSet.has(key) && state.turn === 'red' && !thinking
              const isSelected =
                activeFrom?.[0] === rowIndex && activeFrom?.[1] === colIndex
              const isLastFrom =
                lastMove?.from[0] === rowIndex && lastMove?.from[1] === colIndex
              const isLastTo = lastMove?.to[0] === rowIndex && lastMove?.to[1] === colIndex

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={!playable || (state.turn !== 'red' || thinking) && !cell}
                  className={`touch-target relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10 md:h-11 md:w-11 ${
                    playable
                      ? isLastFrom || isLastTo
                        ? 'bg-amber-300'
                        : isSelected
                          ? 'bg-amber-400'
                          : 'bg-amber-800/90'
                      : 'bg-amber-200/60'
                  } ${isDest ? 'cursor-pointer' : ''}`}
                >
                  {isDest && (
                    <span className="absolute h-2.5 w-2.5 rounded-full bg-lime-300/90 ring-2 ring-lime-200/80" aria-hidden />
                  )}
                  {cell && (
                    <span
                      className={`relative z-10 flex h-[76%] w-[76%] items-center justify-center rounded-full shadow ${
                        cell.owner === 'red'
                          ? 'bg-red-700 ring-2 ring-red-900/40'
                          : 'bg-stone-100 ring-2 ring-stone-400'
                      }`}
                    >
                      {cell.king && (
                        <span className="text-[10px] font-bold text-amber-200 sm:text-xs">王</span>
                      )}
                    </span>
                  )}
                </button>
              )
            }),
          )}
        </div>
      </div>

      <p className="text-center text-xs text-coffee-500">
        チェッカー — 斜めに進んで相手の駒を飛び越えて取ろう。赤（あなた）が先手です。駒を選んでから行き先をタップ。
      </p>

      {result !== 'playing' && (
        <div className="text-center">
          <button
            type="button"
            onClick={reset}
            className="touch-target rounded-xl bg-coffee-600 px-6 py-3 font-medium text-cream"
          >
            もう一度
          </button>
        </div>
      )}
    </div>
  )
}
