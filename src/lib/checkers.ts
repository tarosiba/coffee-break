export const BOARD_SIZE = 8

export type Player = 'red' | 'white'
export type GameResult = 'playing' | 'red-win' | 'white-win' | 'draw'
export type CheckersDifficulty = 'beginner' | 'intermediate'

export interface Piece {
  owner: Player
  king: boolean
}

export type Cell = Piece | null
export type Board = Cell[][]

export interface Move {
  from: [number, number]
  to: [number, number]
  captures: [number, number][]
}

export interface GameState {
  board: Board
  turn: Player
  /** 連続ジャンプ中はこの駒から続ける必要がある */
  continueFrom: [number, number] | null
}

const KING_DIRS: [number, number][] = [
  [-1, -1], [-1, 1], [1, -1], [1, 1],
]

const MAN_DIRS: Record<Player, [number, number][]> = {
  red: [[-1, -1], [-1, 1]],
  white: [[1, -1], [1, 1]],
}

const KING_ROW: Record<Player, number> = {
  red: 0,
  white: BOARD_SIZE - 1,
}

const POSITION_WEIGHTS = [
  [0, 4, 0, 4, 0, 4, 0, 4],
  [4, 0, 3, 0, 3, 0, 3, 0],
  [0, 3, 0, 2, 0, 2, 0, 3],
  [3, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 1, 0, 1, 0, 2],
  [2, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
]

export function opponent(player: Player): Player {
  return player === 'red' ? 'white' : 'red'
}

export function isPlayableSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 1
}

export function createBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null),
  )

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isPlayableSquare(row, col)) {
        board[row][col] = { owner: 'white', king: false }
      }
    }
  }

  for (let row = 5; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isPlayableSquare(row, col)) {
        board[row][col] = { owner: 'red', king: false }
      }
    }
  }

  return board
}

export function createInitialState(): GameState {
  return {
    board: createBoard(),
    turn: 'red',
    continueFrom: null,
  }
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

function getDirections(piece: Piece): [number, number][] {
  if (!piece) return []
  return piece.king ? KING_DIRS : MAN_DIRS[piece.owner]
}

function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null)),
  )
}

function collectJumps(
  board: Board,
  row: number,
  col: number,
  piece: Piece,
  captures: [number, number][],
  start: [number, number],
): Move[] {
  const moves: Move[] = []
  let foundFurther = false

  for (const [dr, dc] of getDirections(piece)) {
    const midR = row + dr
    const midC = col + dc
    const landR = row + dr * 2
    const landC = col + dc * 2

    if (!inBounds(landR, landC) || !isPlayableSquare(landR, landC)) continue
    if (board[landR][landC]) continue

    const mid = board[midR][midC]
    if (!mid || mid.owner === piece.owner) continue
    if (captures.some(([r, c]) => r === midR && c === midC)) continue

    const nextCaptures: [number, number][] = [...captures, [midR, midC]]
    const nextBoard = cloneBoard(board)
    nextBoard[row][col] = null
    nextBoard[midR][midC] = null

    let landed: Piece = { ...piece }
    if (landR === KING_ROW[piece.owner]) landed = { ...landed, king: true }
    nextBoard[landR][landC] = landed

    const further = collectJumps(nextBoard, landR, landC, landed, nextCaptures, start)
    if (further.length > 0) {
      foundFurther = true
      moves.push(...further)
    } else {
      moves.push({
        from: start,
        to: [landR, landC],
        captures: nextCaptures,
      })
    }
  }

  if (!foundFurther && captures.length > 0) {
    // handled in recursion leaf above
  }

  return moves
}

function getJumpsFrom(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col]
  if (!piece) return []
  return collectJumps(board, row, col, piece, [], [row, col])
}

function getStepsFrom(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col]
  if (!piece) return []

  const moves: Move[] = []
  for (const [dr, dc] of getDirections(piece)) {
    const toR = row + dr
    const toC = col + dc
    if (!inBounds(toR, toC) || !isPlayableSquare(toR, toC)) continue
    if (board[toR][toC]) continue
    moves.push({ from: [row, col], to: [toR, toC], captures: [] })
  }
  return moves
}

function uniqueMoves(moves: Move[]): Move[] {
  const seen = new Set<string>()
  const result: Move[] = []
  for (const move of moves) {
    const key = `${move.from[0]},${move.from[1]}->${move.to[0]},${move.to[1]}:${move.captures.map(([r, c]) => `${r},${c}`).join('|')}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(move)
  }
  return result
}

export function getMovesForPlayer(state: GameState, player: Player): Move[] {
  const { board, continueFrom } = state
  if (state.turn !== player) return []

  const squares: [number, number][] = continueFrom
    ? [continueFrom]
    : (() => {
        const list: [number, number][] = []
        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col]
            if (piece?.owner === player) list.push([row, col])
          }
        }
        return list
      })()

  const jumps: Move[] = []
  for (const [row, col] of squares) {
    jumps.push(...getJumpsFrom(board, row, col))
  }

  if (jumps.length > 0) {
    const maxCaptures = Math.max(...jumps.map((m) => m.captures.length))
    return uniqueMoves(jumps.filter((m) => m.captures.length === maxCaptures))
  }

  if (continueFrom) return []

  const steps: Move[] = []
  for (const [row, col] of squares) {
    steps.push(...getStepsFrom(board, row, col))
  }
  return uniqueMoves(steps)
}

export function applyMove(state: GameState, move: Move): GameState | null {
  const { board, turn } = state
  const piece = board[move.from[0]][move.from[1]]
  if (!piece || piece.owner !== turn) return null

  const legal = getMovesForPlayer(state, turn)
  const isLegal = legal.some(
    (m) =>
      m.from[0] === move.from[0] &&
      m.from[1] === move.from[1] &&
      m.to[0] === move.to[0] &&
      m.to[1] === move.to[1] &&
      m.captures.length === move.captures.length,
  )
  if (!isLegal) return null

  const nextBoard = cloneBoard(board)
  nextBoard[move.from[0]][move.from[1]] = null
  for (const [r, c] of move.captures) {
    nextBoard[r][c] = null
  }

  let landed: Piece = { ...piece }
  if (move.to[0] === KING_ROW[piece.owner]) landed = { ...landed, king: true }
  nextBoard[move.to[0]][move.to[1]] = landed

  const afterJump: GameState = {
    board: nextBoard,
    turn,
    continueFrom: move.captures.length > 0 ? move.to : null,
  }

  if (move.captures.length > 0) {
    const moreJumps = getMovesForPlayer(afterJump, turn)
    if (moreJumps.length > 0) {
      return afterJump
    }
  }

  return {
    board: nextBoard,
    turn: opponent(turn),
    continueFrom: null,
  }
}

function countPieces(board: Board): Record<Player, { men: number; kings: number }> {
  const counts = {
    red: { men: 0, kings: 0 },
    white: { men: 0, kings: 0 },
  }
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col]
      if (!piece) continue
      if (piece.king) counts[piece.owner].kings++
      else counts[piece.owner].men++
    }
  }
  return counts
}

export function getGameResult(state: GameState): GameResult {
  const redMoves = getMovesForPlayer(state, 'red')
  const whiteMoves = getMovesForPlayer(state, 'white')
  const counts = countPieces(state.board)

  const redPieces = counts.red.men + counts.red.kings
  const whitePieces = counts.white.men + counts.white.kings

  if (redPieces === 0) return 'white-win'
  if (whitePieces === 0) return 'red-win'

  if (state.turn === 'red' && redMoves.length === 0) return 'white-win'
  if (state.turn === 'white' && whiteMoves.length === 0) return 'red-win'

  if (redMoves.length === 0 && whiteMoves.length === 0) return 'draw'

  return 'playing'
}

function evaluateBoard(board: Board): number {
  let score = 0
  const counts = countPieces(board)

  score += (counts.white.men - counts.red.men) * 100
  score += (counts.white.kings - counts.red.kings) * 150

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col]
      if (!piece || !isPlayableSquare(row, col)) continue
      const weight = POSITION_WEIGHTS[row][col]
      score += piece.owner === 'white' ? weight : -weight
      if (piece.king) score += piece.owner === 'white' ? 8 : -8
    }
  }

  return score
}

function search(state: GameState, depth: number, alpha: number, beta: number): number {
  const result = getGameResult(state)
  if (result === 'white-win') return 10000
  if (result === 'red-win') return -10000
  if (result === 'draw') return 0
  if (depth === 0) return evaluateBoard(state.board)

  const moves = getMovesForPlayer(state, state.turn)
  if (moves.length === 0) {
    return state.turn === 'white' ? -10000 : 10000
  }

  if (state.turn === 'white') {
    let best = -Infinity
    for (const move of moves) {
      const next = applyMove(state, move)!
      const score = search(next, depth - 1, alpha, beta)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of moves) {
    const next = applyMove(state, move)!
    const score = search(next, depth - 1, alpha, beta)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function getIntermediateCpuMove(state: GameState): Move | null {
  const moves = getMovesForPlayer(state, 'white')
  if (moves.length === 0) return null

  let bestMove = moves[0]
  let bestScore = -Infinity

  for (const move of moves) {
    const next = applyMove(state, move)!
    const score = search(next, 4, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

function scoreBeginnerMove(state: GameState, move: Move): number {
  let score = Math.random() * 25
  score += move.captures.length * 8

  const next = applyMove(state, move)!
  const counts = countPieces(next.board)
  score += (counts.red.men + counts.red.kings) * -0.5

  if (move.captures.length === 0 && Math.random() < 0.35) {
    score -= 15
  }

  return score
}

function getBeginnerCpuMove(state: GameState): Move | null {
  const moves = getMovesForPlayer(state, 'white')
  if (moves.length === 0) return null

  if (Math.random() < 0.28) {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  const captureMoves = moves.filter((m) => m.captures.length > 0)
  const pool = captureMoves.length > 0 && Math.random() < 0.75 ? captureMoves : moves

  const scored = pool
    .map((move) => ({ move, score: scoreBeginnerMove(state, move) }))
    .sort((a, b) => b.score - a.score)

  const top = scored.slice(0, Math.min(3, scored.length))
  return top[Math.floor(Math.random() * top.length)].move
}

export function difficultyLabel(difficulty: CheckersDifficulty): string {
  return difficulty === 'beginner' ? '初級' : '中級'
}

export function getCpuMove(state: GameState, difficulty: CheckersDifficulty = 'intermediate'): Move | null {
  if (difficulty === 'beginner') return getBeginnerCpuMove(state)
  return getIntermediateCpuMove(state)
}

export function moveKey(move: Move): string {
  return `${move.from[0]},${move.from[1]}->${move.to[0]},${move.to[1]}`
}

export function destinationKey(row: number, col: number): string {
  return `${row}-${col}`
}
