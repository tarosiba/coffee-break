import { useMemo, useState } from 'react'
import {
  BOARD_SIZE,
  applyMove,
  countDiscs,
  createBoard,
  getCpuMove,
  getGameResult,
  getValidMoves,
  resolveTurnAfterPass,
  type Board,
  type Player,
} from '../../lib/othello'

function moveKey(row: number, col: number): string {
  return `${row}-${col}`
}

export function OthelloGame() {
  const [board, setBoard] = useState<Board>(createBoard)
  const [turn, setTurn] = useState<Player>('black')
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)
  const [thinking, setThinking] = useState(false)

  const scores = countDiscs(board)
  const playerMoves = useMemo(() => getValidMoves(board, 'black'), [board])
  const result = getGameResult(board)

  const validSet = useMemo(
    () => new Set(playerMoves.map(([row, col]) => moveKey(row, col))),
    [playerMoves],
  )

  const reset = () => {
    setBoard(createBoard())
    setTurn('black')
    setLastMove(null)
    setThinking(false)
  }

  const finishCpuTurn = (nextBoard: Board) => {
    setThinking(true)
    window.setTimeout(() => {
      const cpuMove = getCpuMove(nextBoard)
      if (!cpuMove) {
        setBoard(nextBoard)
        setTurn(resolveTurnAfterPass(nextBoard, 'white'))
        setThinking(false)
        return
      }

      const [row, col] = cpuMove
      const afterCpu = applyMove(nextBoard, row, col, 'white')
      if (!afterCpu) {
        setThinking(false)
        return
      }

      setBoard(afterCpu)
      setLastMove([row, col])
      const nextTurn = resolveTurnAfterPass(afterCpu, 'black')
      setTurn(nextTurn)
      setThinking(false)

      if (
        getGameResult(afterCpu) === 'playing' &&
        nextTurn === 'white' &&
        getValidMoves(afterCpu, 'white').length > 0
      ) {
        finishCpuTurn(afterCpu)
      }
    }, 450)
  }

  const handlePass = () => {
    if (result !== 'playing' || turn !== 'black' || thinking || playerMoves.length > 0) return

    const nextTurn = resolveTurnAfterPass(board, 'black')
    setTurn(nextTurn)
    if (nextTurn === 'white' && getValidMoves(board, 'white').length > 0) {
      finishCpuTurn(board)
    }
  }

  const handleClick = (row: number, col: number) => {
    if (result !== 'playing' || turn !== 'black' || thinking) return
    if (!validSet.has(moveKey(row, col))) return

    const next = applyMove(board, row, col, 'black')
    if (!next) return

    setLastMove([row, col])
    setBoard(next)

    const nextTurn = resolveTurnAfterPass(next, 'white')
    setTurn(nextTurn)
    if (nextTurn === 'white' && getValidMoves(next, 'white').length > 0) {
      finishCpuTurn(next)
    }
  }

  const mustPass = result === 'playing' && turn === 'black' && playerMoves.length === 0 && !thinking

  const status =
    result === 'black-win'
      ? 'あなたの勝ち！ 🎉'
      : result === 'white-win'
        ? 'CPUの勝ち…'
        : result === 'draw'
          ? '引き分け'
          : thinking
            ? 'CPUが考え中…'
            : mustPass
              ? '置ける場所がありません（パスしてください）'
              : turn === 'black'
                ? 'あなたの番（● 黒）'
                : 'CPUの番（○ 白）'

  return (
    <div className="space-y-4">
      <p className="text-center font-medium text-coffee-700">{status}</p>

      <div className="flex justify-center gap-6 text-sm text-coffee-600">
        <span>● あなた: {scores.black}</span>
        <span>○ CPU: {scores.white}</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-coffee-300 bg-emerald-800/90 p-2">
        <div
          className="mx-auto w-fit"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            gap: '2px',
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const key = moveKey(rowIndex, colIndex)
              const isValid = validSet.has(key) && turn === 'black' && !thinking && result === 'playing'
              const isLast = lastMove?.[0] === rowIndex && lastMove?.[1] === colIndex

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleClick(rowIndex, colIndex)}
                  disabled={!isValid}
                  className={`touch-target relative flex h-9 w-9 items-center justify-center rounded-sm transition sm:h-10 sm:w-10 md:h-11 md:w-11 ${
                    isLast ? 'bg-emerald-600' : 'bg-emerald-700 hover:bg-emerald-600'
                  } ${isValid ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {isValid && (
                    <span className="absolute h-2.5 w-2.5 rounded-full bg-emerald-300/80" aria-hidden />
                  )}
                  {cell === 'black' && (
                    <span className="h-[78%] w-[78%] rounded-full bg-coffee-900 shadow-inner" />
                  )}
                  {cell === 'white' && (
                    <span className="h-[78%] w-[78%] rounded-full border border-coffee-200 bg-white shadow" />
                  )}
                </button>
              )
            }),
          )}
        </div>
      </div>

      {mustPass && (
        <div className="text-center">
          <button
            type="button"
            onClick={handlePass}
            className="touch-target rounded-xl bg-coffee-600 px-6 py-2.5 text-sm font-medium text-cream"
          >
            パスする
          </button>
        </div>
      )}

      <p className="text-center text-xs text-coffee-500">
        オセロ — 相手の石を挟んでひっくり返そう。黒（あなた）が先手です。
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
