export type Stone = 'black' | 'white' | null
export type Board = Stone[][]

export const BOARD_SIZE = 15

export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null))
}

export function checkWinner(board: Board, row: number, col: number, stone: Stone): Stone | null {
  if (!stone) return null
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (const [dr, dc] of directions) {
    let count = 1
    for (const dir of [-1, 1]) {
      let r = row + dr * dir
      let c = col + dc * dir
      while (
        r >= 0 && r < BOARD_SIZE &&
        c >= 0 && c < BOARD_SIZE &&
        board[r][c] === stone
      ) {
        count++
        r += dr * dir
        c += dc * dir
      }
    }
    if (count >= 5) return stone
  }
  return null
}

function countLine(board: Board, row: number, col: number, dr: number, dc: number, stone: Stone): number {
  let count = 0
  let r = row
  let c = col
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === stone) {
    count++
    r += dr
    c += dc
  }
  return count
}

function evaluateMove(board: Board, row: number, col: number, stone: Stone): number {
  if (board[row][col]) return -1
  const opponent = stone === 'black' ? 'white' : 'black'
  let score = 0
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (const [dr, dc] of directions) {
    const myCount =
      countLine(board, row, col, dr, dc, stone) +
      countLine(board, row, col, -dr, -dc, stone) - 1
    const oppCount =
      countLine(board, row, col, dr, dc, opponent) +
      countLine(board, row, col, -dr, -dc, opponent) - 1

    if (myCount >= 5) score += 100000
    else if (myCount === 4) score += 10000
    else if (myCount === 3) score += 1000
    else if (myCount === 2) score += 100

    if (oppCount >= 4) score += 8000
    else if (oppCount === 3) score += 800
  }

  const center = (BOARD_SIZE - 1) / 2
  score += 10 - (Math.abs(row - center) + Math.abs(col - center))
  return score
}

export function getCpuMove(board: Board): [number, number] | null {
  const candidates: [number, number, number][] = []

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]) continue
      let nearStone = false
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc]) {
            nearStone = true
          }
        }
      }
      if (!nearStone && board.some((row) => row.some((cell) => cell !== null))) continue

      const score = evaluateMove(board, r, c, 'white')
      candidates.push([r, c, score])
    }
  }

  if (candidates.length === 0) return [7, 7]
  candidates.sort((a, b) => b[2] - a[2])
  return [candidates[0][0], candidates[0][1]]
}
