import { useCallback, useMemo, useState } from 'react'
import {
  PIECE_LABEL,
  SIZE,
  applyMove,
  createInitialState,
  getCpuMove,
  getLegalMoves,
  needsPromotionChoice,
  type BaseKind,
  type GameState,
  type Move,
  type Player,
} from '../../lib/shogi'

type Selection =
  | { kind: 'board'; from: [number, number] }
  | { kind: 'hand'; piece: BaseKind }
  | null

function HandView({
  hand,
  owner,
  selected,
  onSelect,
  disabled,
}: {
  hand: Partial<Record<BaseKind, number>>
  owner: Player
  selected: BaseKind | null
  onSelect: (piece: BaseKind) => void
  disabled: boolean
}) {
  const pieces = Object.entries(hand).filter(([, n]) => (n ?? 0) > 0) as [BaseKind, number][]
  if (pieces.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${owner === 'gote' ? 'justify-end' : ''}`}>
      <span className="text-xs text-coffee-500">{owner === 'sente' ? 'あなたの持ち駒' : 'CPUの持ち駒'}</span>
      {pieces.map(([kind, count]) => (
        <button
          key={kind}
          type="button"
          disabled={disabled || owner !== 'sente'}
          onClick={() => onSelect(kind)}
          className={`touch-target flex h-10 min-w-10 items-center justify-center rounded-lg border-2 text-sm font-bold sm:h-11 sm:min-w-11 sm:text-base ${
            selected === kind
              ? 'border-coffee-600 bg-coffee-200'
              : 'border-coffee-300 bg-amber-50 text-coffee-900'
          } ${owner === 'gote' ? 'opacity-70' : ''}`}
        >
          {PIECE_LABEL[kind]}
          {count > 1 && <span className="ml-0.5 text-xs">{count}</span>}
        </button>
      ))}
    </div>
  )
}

export function ShogiGame() {
  const [state, setState] = useState<GameState>(createInitialState)
  const [selection, setSelection] = useState<Selection>(null)
  const [pendingMove, setPendingMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null)
  const [thinking, setThinking] = useState(false)

  const legalMoves = useMemo(() => getLegalMoves(state), [state])
  const targetSquares = useMemo(() => {
    if (!selection || state.turn !== 'sente' || state.winner) return new Set<string>()

    if (selection.kind === 'hand') {
      return new Set(
        legalMoves
          .filter((m): m is Extract<Move, { type: 'drop' }> => m.type === 'drop' && m.piece === selection.piece)
          .map((m) => `${m.to[0]}-${m.to[1]}`),
      )
    }

    return new Set(
      legalMoves
        .filter(
          (m): m is Extract<Move, { type: 'move' }> =>
            m.type === 'move' &&
            m.from[0] === selection.from[0] &&
            m.from[1] === selection.from[1],
        )
        .map((m) => `${m.to[0]}-${m.to[1]}`),
    )
  }, [legalMoves, selection, state.turn, state.winner])

  const playCpu = useCallback((next: GameState) => {
    setThinking(true)
    setTimeout(() => {
      const cpuMove = getCpuMove(next)
      if (cpuMove) {
        setState(applyMove(next, cpuMove))
      } else {
        setState({ ...next, winner: 'sente' })
      }
      setThinking(false)
      setSelection(null)
    }, 500)
  }, [])

  const commitMove = (move: Move) => {
    const next = applyMove(state, move)
    setState(next)
    setSelection(null)
    setPendingMove(null)
    if (!next.winner && next.turn === 'gote') playCpu(next)
  }

  const handleSquare = (row: number, col: number) => {
    if (state.winner || state.turn !== 'sente' || thinking) return

    const key = `${row}-${col}`
    const piece = state.board[row][col]

    if (selection?.kind === 'hand' && targetSquares.has(key)) {
      commitMove({ type: 'drop', piece: selection.piece, to: [row, col] })
      return
    }

    if (selection?.kind === 'board' && targetSquares.has(key)) {
      const from = selection.from
      if (needsPromotionChoice(state, from, [row, col])) {
        setPendingMove({ from, to: [row, col] })
        return
      }
      const mandatory = legalMoves.find(
        (m) =>
          m.type === 'move' &&
          m.from[0] === from[0] &&
          m.from[1] === from[1] &&
          m.to[0] === row &&
          m.to[1] === col,
      )
      if (mandatory?.type === 'move') commitMove(mandatory)
      return
    }

    if (piece?.owner === 'sente') {
      setSelection({ kind: 'board', from: [row, col] })
      setPendingMove(null)
      return
    }

    setSelection(null)
    setPendingMove(null)
  }

  const status = state.winner
    ? state.winner === 'sente'
      ? 'あなたの勝ち！ 🎉'
      : 'CPU（中級）の勝ち…'
    : thinking
      ? 'CPU（中級）が考え中…'
      : state.turn === 'sente'
        ? 'あなたの番（先手） / 後手: CPU（中級）'
        : 'CPU（中級）の番'

  return (
    <div className="space-y-4">
      <p className="text-center font-medium text-coffee-700">{status}</p>

      <HandView
        hand={state.hands.gote}
        owner="gote"
        selected={null}
        onSelect={() => {}}
        disabled
      />

      <div className="overflow-x-auto rounded-xl border-2 border-coffee-500 bg-amber-700/20 p-1">
        <div
          className="mx-auto w-fit"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
            gap: '1px',
          }}
        >
          {state.board.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`
              const isTarget = targetSquares.has(key)
              const isSelected =
                selection?.kind === 'board' &&
                selection.from[0] === r &&
                selection.from[1] === c

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSquare(r, c)}
                  disabled={!!state.winner || thinking}
                  className={`touch-target relative flex h-9 w-9 items-center justify-center sm:h-11 sm:w-11 md:h-12 md:w-12 ${
                    (r + c) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-50'
                  } ${isTarget ? 'ring-2 ring-inset ring-green-500' : ''} ${
                    isSelected ? 'ring-2 ring-inset ring-coffee-600' : ''
                  }`}
                >
                  {cell && (
                    <span
                      className={`flex h-[85%] w-[85%] items-center justify-center rounded-md border-2 text-sm font-bold sm:text-base ${
                        cell.owner === 'sente'
                          ? 'border-coffee-700 bg-amber-50 text-coffee-900'
                          : 'border-coffee-500 bg-coffee-100 text-coffee-800 rotate-180'
                      }`}
                    >
                      {PIECE_LABEL[cell.kind]}
                    </span>
                  )}
                </button>
              )
            }),
          )}
        </div>
      </div>

      <HandView
        hand={state.hands.sente}
        owner="sente"
        selected={selection?.kind === 'hand' ? selection.piece : null}
        onSelect={(piece) => {
          setSelection({ kind: 'hand', piece })
          setPendingMove(null)
        }}
        disabled={!!state.winner || state.turn !== 'sente' || thinking}
      />

      {pendingMove && (
        <div className="rounded-xl border border-coffee-300 bg-coffee-50 p-4 text-center">
          <p className="mb-3 text-sm text-coffee-700">成りますか？</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                commitMove({
                  type: 'move',
                  from: pendingMove.from,
                  to: pendingMove.to,
                  promote: true,
                })
              }
              className="touch-target rounded-xl bg-coffee-600 px-5 py-2 text-cream"
            >
              成る
            </button>
            <button
              type="button"
              onClick={() =>
                commitMove({
                  type: 'move',
                  from: pendingMove.from,
                  to: pendingMove.to,
                  promote: false,
                })
              }
              className="touch-target rounded-xl border border-coffee-400 px-5 py-2 text-coffee-700"
            >
              成らない
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-coffee-500">
        将棋（中級AI）— 駒をタップして移動先を選ぶ。持ち駒をタップして打つこともできます。
      </p>

      {(state.winner || legalMoves.length === 0) && state.turn === 'sente' && !state.winner && (
        <p className="text-center text-sm text-coffee-600">動かせる手がありません（詰み）</p>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setState(createInitialState())
            setSelection(null)
            setPendingMove(null)
            setThinking(false)
          }}
          className="touch-target text-sm text-coffee-500 underline"
        >
          新しい対局
        </button>
      </div>
    </div>
  )
}
