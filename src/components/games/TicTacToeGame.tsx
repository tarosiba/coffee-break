import { useState } from 'react'

type Cell = 'X' | 'O' | null
type Board = Cell[]

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board: Board): Cell | 'draw' | null {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  if (board.every((c) => c !== null)) return 'draw'
  return null
}

function getBestMove(board: Board): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0)

  for (const i of empty) {
    const next = [...board]
    next[i] = 'O'
    if (checkWinner(next) === 'O') return i
  }
  for (const i of empty) {
    const next = [...board]
    next[i] = 'X'
    if (checkWinner(next) === 'X') return i
  }
  if (empty.includes(4)) return 4
  return empty[Math.floor(Math.random() * empty.length)]
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const winner = checkWinner(board)

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return

    const next = [...board]
    next[index] = 'X'
    const result = checkWinner(next)

    if (result) {
      setBoard(next)
      return
    }

    const cpuMove = getBestMove(next)
    next[cpuMove] = 'O'
    setBoard(next)
    setIsPlayerTurn(true)
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
  }

  const status = winner === 'X'
    ? 'あなたの勝ち！ 🎉'
    : winner === 'O'
      ? 'CPUの勝ち…'
      : winner === 'draw'
        ? '引き分け'
        : 'あなたは ✕ 、CPUは ○'

  return (
    <div className="space-y-6">
      <p className="text-center font-medium text-coffee-700">{status}</p>

      <div className="mx-auto grid w-fit grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className="flex h-16 w-16 items-center justify-center rounded-xl border border-coffee-200 bg-white text-2xl font-bold text-coffee-700 transition hover:bg-coffee-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="text-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-coffee-600 px-6 py-2.5 font-medium text-cream transition hover:bg-coffee-700"
          >
            もう一度
          </button>
        </div>
      )}
    </div>
  )
}
