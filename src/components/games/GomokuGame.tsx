import { useState } from 'react'
import {
  BOARD_SIZE,
  checkWinner,
  createBoard,
  getCpuMove,
  type Board,
  type Stone,
} from '../../lib/gomoku'

export function GomokuGame() {
  const [board, setBoard] = useState<Board>(createBoard)
  const [winner, setWinner] = useState<Stone | null>(null)
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)

  const handleClick = (row: number, col: number) => {
    if (!isPlayerTurn || board[row][col] || winner) return

    const next = board.map((r) => [...r])
    next[row][col] = 'black'
    const result = checkWinner(next, row, col, 'black')

    if (result) {
      setBoard(next)
      setWinner('black')
      setLastMove([row, col])
      return
    }

    setIsPlayerTurn(false)
    setBoard(next)
    setLastMove([row, col])

    setTimeout(() => {
      const move = getCpuMove(next)
      if (!move) return
      const [r, c] = move
      const afterCpu = next.map((row) => [...row])
      afterCpu[r][c] = 'white'
      const cpuWin = checkWinner(afterCpu, r, c, 'white')
      setBoard(afterCpu)
      setLastMove([r, c])
      if (cpuWin) setWinner('white')
      setIsPlayerTurn(true)
    }, 400)
  }

  const reset = () => {
    setBoard(createBoard())
    setWinner(null)
    setLastMove(null)
    setIsPlayerTurn(true)
  }

  const status = winner === 'black'
    ? 'あなたの勝ち！ 🎉'
    : winner === 'white'
      ? 'CPUの勝ち…'
      : isPlayerTurn
        ? 'あなたは ● 、CPUは ○'
        : 'CPUが考え中…'

  return (
    <div className="space-y-4">
      <p className="text-center font-medium text-coffee-700">{status}</p>

      <div className="overflow-x-auto rounded-xl border border-coffee-300 bg-coffee-400/30 p-1">
        <div
          className="mx-auto w-fit"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            gap: '1px',
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isLast = lastMove?.[0] === r && lastMove?.[1] === c
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleClick(r, c)}
                  disabled={!!cell || !!winner || !isPlayerTurn}
                  className={`touch-target flex h-7 w-7 items-center justify-center rounded-sm bg-amber-100 transition active:bg-amber-200 sm:h-8 sm:w-8 md:h-9 md:w-9 ${
                    isLast ? 'ring-2 ring-coffee-500' : ''
                  }`}
                >
                  {cell === 'black' && (
                    <span className="h-5 w-5 rounded-full bg-coffee-900 shadow-inner sm:h-6 sm:w-6" />
                  )}
                  {cell === 'white' && (
                    <span className="h-5 w-5 rounded-full border border-coffee-300 bg-white shadow sm:h-6 sm:w-6" />
                  )}
                </button>
              )
            }),
          )}
        </div>
      </div>

      <p className="text-center text-xs text-coffee-500">
        五目並べ — 縦・横・斜めに5つ並べたら勝ちです
      </p>

      {winner && (
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
