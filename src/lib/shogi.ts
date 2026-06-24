export const SIZE = 9

export type Player = 'sente' | 'gote'

export type BaseKind =
  | 'king' | 'rook' | 'bishop' | 'gold' | 'silver' | 'knight' | 'lance' | 'pawn'

export type PieceKind =
  | BaseKind
  | 'promotedRook' | 'promotedBishop' | 'promotedSilver'
  | 'promotedKnight' | 'promotedLance' | 'promotedPawn'

export interface Piece {
  kind: PieceKind
  owner: Player
}

export type Cell = Piece | null
export type Board = Cell[][]
export type Hand = Partial<Record<BaseKind, number>>

export type Move =
  | { type: 'move'; from: [number, number]; to: [number, number]; promote: boolean }
  | { type: 'drop'; piece: BaseKind; to: [number, number] }

export type ShogiDifficulty = 'beginner' | 'intermediate'

export interface GameState {
  board: Board
  hands: Record<Player, Hand>
  turn: Player
  winner: Player | null
}

const DROP_PIECES: BaseKind[] = ['pawn', 'lance', 'knight', 'silver', 'gold', 'bishop', 'rook']

const PIECE_VALUE: Record<PieceKind, number> = {
  king: 100000,
  rook: 1000,
  bishop: 900,
  gold: 500,
  silver: 450,
  knight: 400,
  lance: 350,
  pawn: 100,
  promotedRook: 1200,
  promotedBishop: 1100,
  promotedSilver: 500,
  promotedKnight: 500,
  promotedLance: 500,
  promotedPawn: 500,
}

export const PIECE_LABEL: Record<PieceKind, string> = {
  king: '王',
  rook: '飛',
  bishop: '角',
  gold: '金',
  silver: '銀',
  knight: '桂',
  lance: '香',
  pawn: '歩',
  promotedRook: '龍',
  promotedBishop: '馬',
  promotedSilver: '全',
  promotedKnight: '圭',
  promotedLance: '杏',
  promotedPawn: 'と',
}

function forward(owner: Player) {
  return owner === 'sente' ? -1 : 1
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE
}

function unpromote(kind: PieceKind): BaseKind {
  const map: Partial<Record<PieceKind, BaseKind>> = {
    promotedRook: 'rook',
    promotedBishop: 'bishop',
    promotedSilver: 'silver',
    promotedKnight: 'knight',
    promotedLance: 'lance',
    promotedPawn: 'pawn',
  }
  return (map[kind] ?? kind) as BaseKind
}

function promote(kind: BaseKind): PieceKind {
  const map: Partial<Record<BaseKind, PieceKind>> = {
    rook: 'promotedRook',
    bishop: 'promotedBishop',
    silver: 'promotedSilver',
    knight: 'promotedKnight',
    lance: 'promotedLance',
    pawn: 'promotedPawn',
  }
  return (map[kind] ?? kind) as PieceKind
}

function isPromoted(kind: PieceKind) {
  return kind.startsWith('promoted')
}

function promotionZone(owner: Player) {
  return owner === 'sente' ? [0, 1, 2] : [6, 7, 8]
}

function canPromote(owner: Player, fromRow: number, toRow: number, kind: PieceKind) {
  if (isPromoted(kind) || kind === 'king' || kind === 'gold') return false
  const zone = promotionZone(owner)
  return zone.includes(fromRow) || zone.includes(toRow)
}

function mustPromote(owner: Player, toRow: number, kind: PieceKind) {
  if (isPromoted(kind) || kind === 'king' || kind === 'gold') return false
  if (kind === 'pawn' || kind === 'lance') {
    return owner === 'sente' ? toRow === 0 : toRow === 8
  }
  if (kind === 'knight') {
    return owner === 'sente' ? toRow <= 1 : toRow >= 7
  }
  return false
}

function goldMoves(owner: Player): [number, number][] {
  const f = forward(owner)
  return [[f, -1], [f, 0], [f, 1], [0, -1], [0, 1], [-f, 0]]
}

function slideMoves(board: Board, r: number, c: number, owner: Player, dirs: [number, number][]) {
  const moves: [number, number][] = []
  for (const [dr, dc] of dirs) {
    let nr = r + dr
    let nc = c + dc
    while (inBounds(nr, nc)) {
      const target = board[nr][nc]
      if (!target) moves.push([nr, nc])
      else {
        if (target.owner !== owner) moves.push([nr, nc])
        break
      }
      nr += dr
      nc += dc
    }
  }
  return moves
}

function stepMoves(board: Board, r: number, c: number, owner: Player, dirs: [number, number][]) {
  const moves: [number, number][] = []
  for (const [dr, dc] of dirs) {
    const nr = r + dr
    const nc = c + dc
    if (!inBounds(nr, nc)) continue
    const target = board[nr][nc]
    if (!target || target.owner !== owner) moves.push([nr, nc])
  }
  return moves
}

function rawMoves(board: Board, r: number, c: number, piece: Piece): [number, number][] {
  const { kind, owner } = piece
  const f = forward(owner)

  switch (kind) {
    case 'king':
      return stepMoves(board, r, c, owner, [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
      ])
    case 'gold':
    case 'promotedSilver':
    case 'promotedKnight':
    case 'promotedLance':
    case 'promotedPawn':
      return stepMoves(board, r, c, owner, goldMoves(owner))
    case 'silver':
      return stepMoves(board, r, c, owner, [[f, -1], [f, 0], [f, 1], [-f, -1], [-f, 1]])
    case 'knight':
      return stepMoves(board, r, c, owner, [[2 * f, -1], [2 * f, 1]])
    case 'lance':
      return slideMoves(board, r, c, owner, [[f, 0]])
    case 'pawn':
      return stepMoves(board, r, c, owner, [[f, 0]])
    case 'rook':
      return slideMoves(board, r, c, owner, [[-1, 0], [1, 0], [0, -1], [0, 1]])
    case 'bishop':
      return slideMoves(board, r, c, owner, [[-1, -1], [-1, 1], [1, -1], [1, 1]])
    case 'promotedRook':
      return [
        ...slideMoves(board, r, c, owner, [[-1, 0], [1, 0], [0, -1], [0, 1]]),
        ...stepMoves(board, r, c, owner, [[-1, -1], [-1, 1], [1, -1], [1, 1]]),
      ]
    case 'promotedBishop':
      return [
        ...slideMoves(board, r, c, owner, [[-1, -1], [-1, 1], [1, -1], [1, 1]]),
        ...stepMoves(board, r, c, owner, [[-1, 0], [1, 0], [0, -1], [0, 1]]),
      ]
    default:
      return []
  }
}

function findKing(board: Board, owner: Player): [number, number] | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c]
      if (p?.kind === 'king' && p.owner === owner) return [r, c]
    }
  }
  return null
}

export function isAttacked(board: Board, row: number, col: number, by: Player) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c]
      if (!p || p.owner !== by) continue
      if (rawMoves(board, r, c, p).some(([tr, tc]) => tr === row && tc === col)) return true
    }
  }
  return false
}

function hasPawnInFile(board: Board, owner: Player, col: number) {
  for (let r = 0; r < SIZE; r++) {
    const p = board[r][col]
    if (p?.owner === owner && (p.kind === 'pawn' || p.kind === 'promotedPawn')) return true
  }
  return false
}

function canDrop(board: Board, owner: Player, piece: BaseKind, to: [number, number]) {
  const [r, c] = to
  if (board[r][c]) return false
  if (piece === 'pawn' && hasPawnInFile(board, owner, c)) return false
  if (piece === 'pawn' && (owner === 'sente' ? r === 0 : r === 8)) return false
  if (piece === 'lance' && (owner === 'sente' ? r === 0 : r === 8)) return false
  if (piece === 'knight' && (owner === 'sente' ? r <= 1 : r >= 7)) return false
  return true
}

function applyMoveToBoard(board: Board, move: Move, owner: Player): Board {
  const next = board.map((row) => [...row])

  if (move.type === 'drop') {
    next[move.to[0]][move.to[1]] = { kind: move.piece, owner }
    return next
  }

  const piece = next[move.from[0]][move.from[1]]!
  next[move.from[0]][move.from[1]] = null
  let kind = piece.kind
  if (move.promote && !isPromoted(kind) && kind !== 'king' && kind !== 'gold') {
    kind = promote(kind as BaseKind)
  }
  next[move.to[0]][move.to[1]] = { kind, owner }
  return next
}

function leavesKingSafe(board: Board, _hands: Record<Player, Hand>, move: Move, owner: Player) {
  const nextBoard = applyMoveToBoard(board, move, owner)
  const king = findKing(nextBoard, owner)
  if (!king) return false
  const enemy = owner === 'sente' ? 'gote' : 'sente'
  return !isAttacked(nextBoard, king[0], king[1], enemy)
}

export function getLegalMoves(state: GameState): Move[] {
  const { board, hands, turn } = state
  const moves: Move[] = []

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const piece = board[r][c]
      if (!piece || piece.owner !== turn) continue
      for (const [tr, tc] of rawMoves(board, r, c, piece)) {
        const mandatory = mustPromote(turn, tr, piece.kind)
        const optional = canPromote(turn, r, tr, piece.kind)
        if (mandatory) {
          const move: Move = { type: 'move', from: [r, c], to: [tr, tc], promote: true }
          if (leavesKingSafe(board, hands, move, turn)) moves.push(move)
        } else if (optional) {
          for (const promote of [false, true]) {
            const move: Move = { type: 'move', from: [r, c], to: [tr, tc], promote }
            if (leavesKingSafe(board, hands, move, turn)) moves.push(move)
          }
        } else {
          const move: Move = { type: 'move', from: [r, c], to: [tr, tc], promote: false }
          if (leavesKingSafe(board, hands, move, turn)) moves.push(move)
        }
      }
    }
  }

  for (const piece of DROP_PIECES) {
    const count = hands[turn][piece] ?? 0
    if (count <= 0) continue
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!canDrop(board, turn, piece, [r, c])) continue
        const move: Move = { type: 'drop', piece, to: [r, c] }
        if (leavesKingSafe(board, hands, move, turn)) moves.push(move)
      }
    }
  }

  return moves
}

export function applyMove(state: GameState, move: Move): GameState {
  const board = state.board.map((row) => [...row])
  const hands: Record<Player, Hand> = {
    sente: { ...state.hands.sente },
    gote: { ...state.hands.gote },
  }
  const owner = state.turn
  const enemy = owner === 'sente' ? 'gote' : 'sente'

  if (move.type === 'drop') {
    board[move.to[0]][move.to[1]] = { kind: move.piece, owner }
    hands[owner][move.piece] = (hands[owner][move.piece] ?? 1) - 1
    if (hands[owner][move.piece] === 0) delete hands[owner][move.piece]
  } else {
    const piece = board[move.from[0]][move.from[1]]!
    const captured = board[move.to[0]][move.to[1]]
    board[move.from[0]][move.from[1]] = null

    let kind = piece.kind
    if (move.promote) kind = promote(kind as BaseKind)
    board[move.to[0]][move.to[1]] = { kind, owner }

    if (captured) {
      const base = unpromote(captured.kind)
      if (base !== 'king') {
        hands[owner][base] = (hands[owner][base] ?? 0) + 1
      }
    }
  }

  let winner: Player | null = null
  if (!findKing(board, enemy)) winner = owner

  return {
    board,
    hands,
    turn: enemy,
    winner,
  }
}

export function createInitialState(): GameState {
  const empty = (): Cell[] => Array(SIZE).fill(null)
  const board: Board = Array.from({ length: SIZE }, empty)

  const back: BaseKind[] = ['lance', 'knight', 'silver', 'gold', 'king', 'gold', 'silver', 'knight', 'lance']
  for (let c = 0; c < SIZE; c++) {
    board[0][c] = { kind: back[c], owner: 'gote' }
    board[2][c] = { kind: 'pawn', owner: 'gote' }
    board[6][c] = { kind: 'pawn', owner: 'sente' }
    board[8][c] = { kind: back[c], owner: 'sente' }
  }
  board[1][1] = { kind: 'rook', owner: 'gote' }
  board[1][7] = { kind: 'bishop', owner: 'gote' }
  board[7][7] = { kind: 'rook', owner: 'sente' }
  board[7][1] = { kind: 'bishop', owner: 'sente' }

  return {
    board,
    hands: { sente: {}, gote: {} },
    turn: 'sente',
    winner: null,
  }
}

function isKingInCheck(state: GameState, owner: Player): boolean {
  const king = findKing(state.board, owner)
  if (!king) return true
  const enemy = owner === 'sente' ? 'gote' : 'sente'
  return isAttacked(state.board, king[0], king[1], enemy)
}

function evaluateState(state: GameState): number {
  let score = 0

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const piece = state.board[r][c]
      if (!piece) continue
      const value = PIECE_VALUE[piece.kind]
      const positional =
        piece.owner === 'sente'
          ? (8 - r) * 2 + (4 - Math.abs(c - 4))
          : r * 2 + (4 - Math.abs(c - 4))
      score += piece.owner === 'gote' ? value + positional : -(value + positional)
    }
  }

  for (const piece of DROP_PIECES) {
    const goteCount = state.hands.gote[piece] ?? 0
    const senteCount = state.hands.sente[piece] ?? 0
    score += goteCount * (PIECE_VALUE[piece] * 0.9)
    score -= senteCount * (PIECE_VALUE[piece] * 0.9)
  }

  if (isKingInCheck(state, 'sente')) score += 160
  if (isKingInCheck(state, 'gote')) score -= 160

  return score
}

function moveOrderingScore(state: GameState, move: Move): number {
  let score = 0
  if (move.type === 'move') {
    const target = state.board[move.to[0]][move.to[1]]
    if (target) score += PIECE_VALUE[target.kind] * 2
    if (move.promote) score += 70
  } else {
    score += PIECE_VALUE[move.piece] * 0.4
  }
  score += (4 - Math.abs(move.to[1] - 4)) * 3
  return score
}

function terminalScore(state: GameState, depth: number): number | null {
  if (!findKing(state.board, 'sente')) return 999999 - (3 - depth)
  if (!findKing(state.board, 'gote')) return -999999 + (3 - depth)

  const legal = getLegalMoves(state)
  if (legal.length > 0) return null

  if (isKingInCheck(state, state.turn)) {
    return state.turn === 'sente' ? 999999 - depth : -999999 + depth
  }
  return 0
}

function searchBestMove(state: GameState, depth: number, alpha: number, beta: number): number {
  const terminal = terminalScore(state, depth)
  if (terminal !== null) return terminal
  if (depth === 0) return evaluateState(state)

  const legal = getLegalMoves(state)
  legal.sort((a, b) => moveOrderingScore(state, b) - moveOrderingScore(state, a))
  const candidates = legal.slice(0, 28)

  if (state.turn === 'gote') {
    let best = -Infinity
    for (const move of candidates) {
      const score = searchBestMove(applyMove(state, move), depth - 1, alpha, beta)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of candidates) {
    const score = searchBestMove(applyMove(state, move), depth - 1, alpha, beta)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function chooseCpuMove(state: GameState, depth: number): Move | null {
  const legal = getLegalMoves(state)
  if (legal.length === 0) return null

  legal.sort((a, b) => moveOrderingScore(state, b) - moveOrderingScore(state, a))

  let bestMove = legal[0]
  let bestScore = -Infinity

  for (const move of legal.slice(0, 24)) {
    const score = searchBestMove(applyMove(state, move), depth - 1, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

function getBeginnerCpuMove(state: GameState): Move | null {
  const moves = getLegalMoves(state)
  if (moves.length === 0) return null

  const scored = moves.map((move) => {
    let score = Math.random() * 10
    if (move.type === 'move') {
      const target = state.board[move.to[0]][move.to[1]]
      if (target) score += PIECE_VALUE[target.kind]
      if (move.promote) score += 80
    } else {
      score += PIECE_VALUE[move.piece] * 0.3
      if (move.piece === 'pawn') score += 20
    }
    const next = applyMove(state, move)
    const king = findKing(next.board, 'sente')
    if (king && isAttacked(next.board, king[0], king[1], 'gote')) score += 50
    return { move, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, Math.min(4, scored.length))
  return top[Math.floor(Math.random() * top.length)].move
}

function getIntermediateCpuMove(state: GameState): Move | null {
  const legal = getLegalMoves(state)
  if (legal.length === 0) return null

  const captures = legal.filter((move) => move.type === 'move' && state.board[move.to[0]][move.to[1]])
  if (captures.length > 0) {
    captures.sort((a, b) => moveOrderingScore(state, b) - moveOrderingScore(state, a))
    let bestCapture = captures[0]
    let bestScore = -Infinity
    for (const move of captures.slice(0, 8)) {
      const score = searchBestMove(applyMove(state, move), 2, -Infinity, Infinity)
      if (score > bestScore) {
        bestScore = score
        bestCapture = move
      }
    }
    return bestCapture
  }

  const checks = legal.filter((move) => {
    const next = applyMove(state, move)
    return isKingInCheck(next, 'sente')
  })
  if (checks.length > 0) {
    checks.sort((a, b) => moveOrderingScore(state, b) - moveOrderingScore(state, a))
    let bestCheck = checks[0]
    let bestScore = -Infinity
    for (const move of checks.slice(0, 6)) {
      const score = searchBestMove(applyMove(state, move), 2, -Infinity, Infinity)
      if (score > bestScore) {
        bestScore = score
        bestCheck = move
      }
    }
    return bestCheck
  }

  return chooseCpuMove(state, 3)
}

export function getCpuMove(state: GameState, difficulty: ShogiDifficulty = 'intermediate'): Move | null {
  if (difficulty === 'beginner') return getBeginnerCpuMove(state)
  return getIntermediateCpuMove(state)
}

export function difficultyLabel(difficulty: ShogiDifficulty): string {
  return difficulty === 'beginner' ? '初級' : '中級'
}

export function needsPromotionChoice(state: GameState, from: [number, number], to: [number, number]) {
  const piece = state.board[from[0]][from[1]]
  if (!piece) return false
  if (mustPromote(piece.owner, to[0], piece.kind)) return false
  return canPromote(piece.owner, from[0], to[0], piece.kind)
}
