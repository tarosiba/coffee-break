export const BOARD_SIZE = 8

export type Disc = 'black' | 'white' | null
export type Board = Disc[][]
export type Player = 'black' | 'white'
export type GameResult = 'playing' | 'black-win' | 'white-win' | 'draw'

const DIRECTIONS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
]

const POSITION_WEIGHTS = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
]

export function opponent(player: Player): Player {
  return player === 'black' ? 'white' : 'black'
}

export function createBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null),
  )
  board[3][3] = 'white'
  board[3][4] = 'black'
  board[4][3] = 'black'
  board[4][4] = 'white'
  return board
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

function collectFlips(
  board: Board,
  row: number,
  col: number,
  player: Player,
  dr: number,
  dc: number,
): [number, number][] {
  const flips: [number, number][] = []
  let r = row + dr
  let c = col + dc

  while (inBounds(r, c) && board[r][c] === opponent(player)) {
    flips.push([r, c])
    r += dr
    c += dc
  }

  if (flips.length > 0 && inBounds(r, c) && board[r][c] === player) {
    return flips
  }
  return []
}

export function getFlipsForMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): [number, number][] {
  if (board[row][col]) return []

  const allFlips: [number, number][] = []
  for (const [dr, dc] of DIRECTIONS) {
    allFlips.push(...collectFlips(board, row, col, player, dr, dc))
  }
  return allFlips
}

export function getValidMoves(board: Board, player: Player): [number, number][] {
  const moves: [number, number][] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (getFlipsForMove(board, row, col, player).length > 0) {
        moves.push([row, col])
      }
    }
  }
  return moves
}

export function applyMove(board: Board, row: number, col: number, player: Player): Board | null {
  const flips = getFlipsForMove(board, row, col, player)
  if (flips.length === 0) return null

  const next = board.map((line) => [...line])
  next[row][col] = player
  for (const [r, c] of flips) {
    next[r][c] = player
  }
  return next
}

export function countDiscs(board: Board): Record<Player, number> {
  let black = 0
  let white = 0
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black') black++
      if (board[row][col] === 'white') white++
    }
  }
  return { black, white }
}

export function getGameResult(board: Board): GameResult {
  const blackMoves = getValidMoves(board, 'black')
  const whiteMoves = getValidMoves(board, 'white')

  if (blackMoves.length > 0 || whiteMoves.length > 0) return 'playing'

  const { black, white } = countDiscs(board)
  if (black > white) return 'black-win'
  if (white > black) return 'white-win'
  return 'draw'
}

function evaluateBoard(board: Board): number {
  let score = 0
  const { black, white } = countDiscs(board)

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col]
      if (!cell) continue
      const weight = POSITION_WEIGHTS[row][col]
      score += cell === 'white' ? weight : -weight
    }
  }

  const whiteMobility = getValidMoves(board, 'white').length
  const blackMobility = getValidMoves(board, 'black').length
  score += (whiteMobility - blackMobility) * 3
  score += (white - black) * 0.5

  return score
}

function search(board: Board, depth: number, alpha: number, beta: number, player: Player): number {
  const result = getGameResult(board)
  if (result !== 'playing') {
    const { black, white } = countDiscs(board)
    if (black === white) return 0
    return white > black ? 10000 : -10000
  }

  const moves = getValidMoves(board, player)
  if (moves.length === 0) {
    return search(board, depth, alpha, beta, opponent(player))
  }

  if (depth === 0) return evaluateBoard(board)

  if (player === 'white') {
    let best = -Infinity
    for (const [row, col] of moves) {
      const next = applyMove(board, row, col, 'white')!
      const score = search(next, depth - 1, alpha, beta, 'black')
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const [row, col] of moves) {
    const next = applyMove(board, row, col, 'black')!
    const score = search(next, depth - 1, alpha, beta, 'white')
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

export function getCpuMove(board: Board): [number, number] | null {
  const moves = getValidMoves(board, 'white')
  if (moves.length === 0) return null

  let bestMove = moves[0]
  let bestScore = -Infinity

  for (const [row, col] of moves) {
    const next = applyMove(board, row, col, 'white')!
    const score = search(next, 3, -Infinity, Infinity, 'black')
    if (score > bestScore) {
      bestScore = score
      bestMove = [row, col]
    }
  }

  return bestMove
}

export function resolveTurnAfterPass(board: Board, turn: Player): Player {
  if (getValidMoves(board, turn).length > 0) return turn
  if (getValidMoves(board, opponent(turn)).length > 0) return opponent(turn)
  return turn
}
