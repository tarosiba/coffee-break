export const WIDTH = 360
export const HEIGHT = 520
export const PLAYER_R = 11
export const BALL_R = 7
export const GOAL_WIDTH = 100
export const MATCH_SECONDS = 120
export const GOAL_PAUSE = 90
export const PADDING = 28

const PLAYER_SPEED = 3.2
const GK_SPEED = 2.4
const KICK_COOLDOWN = 18
const POSSESS_DIST = PLAYER_R + BALL_R + 2

export type Team = 'red' | 'blue'
export type SoccerDifficulty = 'beginner' | 'intermediate'
export type Phase = 'title' | 'playing' | 'goal' | 'gameover'

export interface Player {
  id: number
  team: Team
  x: number
  y: number
  vx: number
  vy: number
  homeX: number
  homeY: number
  isGk: boolean
}

export interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  possessorId: number | null
}

export interface SoccerState {
  phase: Phase
  players: Player[]
  ball: Ball
  redScore: number
  blueScore: number
  timeLeft: number
  controlledId: number | null
  kickCooldown: number
  pauseTicks: number
  lastGoalTeam: Team | null
  message: string
}

export interface SoccerInput {
  dx: number
  dy: number
  pass: boolean
  shoot: boolean
}

const RED_FORMATION: [number, number, boolean][] = [
  [0.5, 0.88, true],
  [0.28, 0.74, false],
  [0.72, 0.74, false],
  [0.5, 0.6, false],
]

const BLUE_FORMATION: [number, number, boolean][] = [
  [0.5, 0.12, true],
  [0.28, 0.26, false],
  [0.72, 0.26, false],
  [0.5, 0.4, false],
]

function fieldX(ratio: number): number {
  return PADDING + ratio * (WIDTH - PADDING * 2)
}

function fieldY(ratio: number): number {
  return PADDING + ratio * (HEIGHT - PADDING * 2)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by)
}

function kickBall(state: SoccerState, dirX: number, dirY: number, power: number): void {
  const len = Math.hypot(dirX, dirY) || 1
  state.ball.possessorId = null
  state.ball.vx = (dirX / len) * power
  state.ball.vy = (dirY / len) * power
  state.kickCooldown = KICK_COOLDOWN
}

export function difficultyLabel(difficulty: SoccerDifficulty): string {
  return difficulty === 'beginner' ? '初級' : '中級'
}

export function createGameState(): SoccerState {
  return {
    phase: 'title',
    players: [],
    ball: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0, possessorId: null },
    redScore: 0,
    blueScore: 0,
    timeLeft: MATCH_SECONDS,
    controlledId: null,
    kickCooldown: 0,
    pauseTicks: 0,
    lastGoalTeam: null,
    message: '',
  }
}

function buildPlayers(): Player[] {
  const players: Player[] = []
  let id = 0

  for (const [rx, ry, isGk] of RED_FORMATION) {
    const x = fieldX(rx)
    const y = fieldY(ry)
    players.push({ id: id++, team: 'red', x, y, vx: 0, vy: 0, homeX: x, homeY: y, isGk })
  }

  for (const [bx, by, isGk] of BLUE_FORMATION) {
    const x = fieldX(bx)
    const y = fieldY(by)
    players.push({ id: id++, team: 'blue', x, y, vx: 0, vy: 0, homeX: x, homeY: y, isGk })
  }

  return players
}

export function startGame(): SoccerState {
  const players = buildPlayers()
  return {
    phase: 'playing',
    players,
    ball: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0, possessorId: null },
    redScore: 0,
    blueScore: 0,
    timeLeft: MATCH_SECONDS,
    controlledId: null,
    kickCooldown: 0,
    pauseTicks: 0,
    lastGoalTeam: null,
    message: 'キックオフ！',
  }
}

function getPlayer(state: SoccerState, id: number): Player | undefined {
  return state.players.find((p) => p.id === id)
}

function teamPlayers(state: SoccerState, team: Team): Player[] {
  return state.players.filter((p) => p.team === team)
}

function pickControlledPlayer(state: SoccerState): number | null {
  const reds = teamPlayers(state, 'red')
  const { ball } = state

  if (ball.possessorId !== null) {
    const possessor = getPlayer(state, ball.possessorId)
    if (possessor?.team === 'red') return possessor.id
  }

  let best: Player | null = null
  let bestDist = Infinity
  for (const p of reds) {
    const d = dist(p.x, p.y, ball.x, ball.y)
    if (d < bestDist) {
      bestDist = d
      best = p
    }
  }
  return best?.id ?? null
}

function movePlayer(player: Player, dx: number, dy: number, speed: number): void {
  const len = Math.hypot(dx, dy)
  if (len < 0.15) {
    player.vx *= 0.8
    player.vy *= 0.8
    return
  }

  const maxSpeed = player.isGk ? GK_SPEED : speed
  player.vx = (dx / len) * maxSpeed
  player.vy = (dy / len) * maxSpeed
}

function clampPlayerPosition(player: Player): void {
  const minX = PADDING + PLAYER_R
  const maxX = WIDTH - PADDING - PLAYER_R
  const minY = PADDING + PLAYER_R
  const maxY = HEIGHT - PADDING - PLAYER_R

  if (player.isGk) {
    if (player.team === 'red') {
      player.x = clamp(player.x, minX, maxX)
      player.y = clamp(player.y, fieldY(0.72), maxY)
    } else {
      player.x = clamp(player.x, minX, maxX)
      player.y = clamp(player.y, minY, fieldY(0.28))
    }
  } else {
    player.x = clamp(player.x, minX, maxX)
    player.y = clamp(player.y, minY, maxY)
  }
}

function findPassTarget(state: SoccerState, passer: Player): Player | null {
  let best: Player | null = null
  let bestScore = -Infinity

  for (const mate of teamPlayers(state, passer.team)) {
    if (mate.id === passer.id) continue
    const d = dist(passer.x, passer.y, mate.x, mate.y)
    if (d < 30 || d > 200) continue

    let score = 200 - d
    if (passer.team === 'red' && mate.y < passer.y) score += 40
    if (passer.team === 'blue' && mate.y > passer.y) score += 40
    if (mate.isGk) score -= 50

    if (score > bestScore) {
      bestScore = score
      best = mate
    }
  }

  return best
}

function tryPlayerKick(
  state: SoccerState,
  player: Player,
  input: SoccerInput | null,
  isCpu: boolean,
  difficulty: SoccerDifficulty,
): void {
  if (state.kickCooldown > 0) return

  const hasBall = state.ball.possessorId === player.id
  const nearBall = dist(player.x, player.y, state.ball.x, state.ball.y) < POSSESS_DIST + 4
  if (!hasBall && !nearBall) return

  if (isCpu) {
    const goalY = player.team === 'blue' ? HEIGHT - PADDING : PADDING
    const toGoalX = WIDTH / 2 - player.x
    const toGoalY = goalY - player.y
    const goalDist = Math.hypot(toGoalX, toGoalY)

    const shootRange = difficulty === 'beginner' ? 140 : 180
    if (goalDist < shootRange && Math.random() < (difficulty === 'beginner' ? 0.03 : 0.06)) {
      kickBall(state, toGoalX, toGoalY, difficulty === 'beginner' ? 9 : 12)
      return
    }

    if (difficulty === 'intermediate' && Math.random() < 0.02) {
      const target = findPassTarget(state, player)
      if (target) {
        kickBall(state, target.x - player.x, target.y - player.y, 8)
      }
    }
    return
  }

  if (!input) return

  if (input.shoot) {
    const goalY = PADDING
    kickBall(state, WIDTH / 2 - player.x, goalY - player.y, 12)
    return
  }

  if (input.pass) {
    const target = findPassTarget(state, player)
    if (target) {
      kickBall(state, target.x - player.x, target.y - player.y, 8)
    } else if (Math.hypot(input.dx, input.dy) > 0.2) {
      kickBall(state, input.dx, input.dy, 7)
    } else {
      kickBall(state, 0, -1, 7)
    }
  }
}

function updateTeammateAi(player: Player, ball: Ball, speed: number): void {
  const d = dist(player.x, player.y, ball.x, ball.y)
  if (d > 180) {
    movePlayer(player, player.homeX - player.x, player.homeY - player.y, speed * 0.6)
    return
  }
  movePlayer(player, ball.x - player.x, ball.y - player.y, speed * 0.75)
}

function updateCpuPlayer(state: SoccerState, player: Player, difficulty: SoccerDifficulty): void {
  const speed = difficulty === 'beginner' ? PLAYER_SPEED * 0.72 : PLAYER_SPEED * 0.92
  const { ball } = state

  const blues = teamPlayers(state, 'blue')
  let closest = blues[0]
  let closestDist = Infinity
  for (const p of blues) {
    const d = dist(p.x, p.y, ball.x, ball.y)
    if (d < closestDist) {
      closestDist = d
      closest = p
    }
  }

  if (player.id === closest.id) {
    movePlayer(player, ball.x - player.x, ball.y - player.y, speed)
    tryPlayerKick(state, player, null, true, difficulty)
  } else if (player.isGk) {
    const goalCenterX = WIDTH / 2
    const goalY = fieldY(0.12)
    const targetX = clamp(ball.x, goalCenterX - 50, goalCenterX + 50)
    movePlayer(player, targetX - player.x, goalY - player.y, GK_SPEED * 0.85)
  } else {
    updateTeammateAi(player, ball, speed)
  }
}

function updatePossession(state: SoccerState): void {
  const { ball } = state
  if (ball.possessorId !== null) {
    const possessor = getPlayer(state, ball.possessorId)
    if (!possessor) {
      ball.possessorId = null
      return
    }

    const speed = Math.hypot(possessor.vx, possessor.vy)
    const lead = speed > 0.5 ? 10 : 6
    const len = Math.hypot(possessor.vx, possessor.vy) || 1
    const fx = speed > 0.3 ? possessor.vx / len : 0
    const fy = speed > 0.3 ? possessor.vy / len : possessor.team === 'red' ? -1 : 1

    ball.x = possessor.x + fx * lead
    ball.y = possessor.y + fy * lead
    ball.vx = possessor.vx
    ball.vy = possessor.vy
    return
  }

  if (Math.hypot(ball.vx, ball.vy) > 2.5) return

  let best: Player | null = null
  let bestDist = POSSESS_DIST
  for (const p of state.players) {
    const d = dist(p.x, p.y, ball.x, ball.y)
    if (d < bestDist) {
      bestDist = d
      best = p
    }
  }

  if (best) {
    ball.possessorId = best.id
    ball.vx = best.vx
    ball.vy = best.vy
  }
}

function checkGoal(state: SoccerState): boolean {
  const { ball } = state
  const inGoalX = Math.abs(ball.x - WIDTH / 2) < GOAL_WIDTH / 2

  if (ball.y - BALL_R <= PADDING && inGoalX) {
    state.redScore++
    state.lastGoalTeam = 'red'
    state.message = 'ゴール！ 🎉'
    return true
  }

  if (ball.y + BALL_R >= HEIGHT - PADDING && inGoalX) {
    state.blueScore++
    state.lastGoalTeam = 'blue'
    state.message = 'CPUが得点…'
    return true
  }

  return false
}

function resetAfterGoal(state: SoccerState): void {
  state.ball = { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0, possessorId: null }
  state.players = buildPlayers()
  state.kickCooldown = 30
  state.controlledId = null
}

export function updateGame(
  state: SoccerState,
  input: SoccerInput,
  difficulty: SoccerDifficulty = 'intermediate',
): SoccerState {
  const next: SoccerState = {
    ...state,
    players: state.players.map((p) => ({ ...p })),
    ball: { ...state.ball },
  }

  if (next.phase === 'title' || next.phase === 'gameover') return next

  if (next.phase === 'goal') {
    next.pauseTicks -= 1
    if (next.pauseTicks <= 0) {
      next.phase = 'playing'
      next.message = '再キックオフ！'
      resetAfterGoal(next)
    }
    return next
  }

  next.timeLeft -= 1 / 60
  if (next.kickCooldown > 0) next.kickCooldown -= 1

  next.controlledId = pickControlledPlayer(next)
  const controlled = next.controlledId !== null ? getPlayer(next, next.controlledId) : null

  for (const player of next.players) {
    if (player.team === 'red') {
      if (controlled && player.id === controlled.id) {
        movePlayer(player, input.dx, input.dy, PLAYER_SPEED)
        tryPlayerKick(next, player, input, false, difficulty)
      } else {
        updateTeammateAi(player, next.ball, PLAYER_SPEED * 0.7)
      }
    } else {
      updateCpuPlayer(next, player, difficulty)
    }

    player.x += player.vx
    player.y += player.vy
    clampPlayerPosition(player)
  }

  if (next.ball.possessorId === null) {
    next.ball.x += next.ball.vx
    next.ball.y += next.ball.vy
    next.ball.vx *= 0.985
    next.ball.vy *= 0.985

    const left = PADDING + BALL_R
    const right = WIDTH - PADDING - BALL_R
    const top = PADDING + BALL_R
    const bottom = HEIGHT - PADDING - BALL_R
    const inGoalX = Math.abs(next.ball.x - WIDTH / 2) < GOAL_WIDTH / 2

    if (next.ball.x < left) {
      next.ball.x = left
      next.ball.vx = Math.abs(next.ball.vx) * 0.7
    }
    if (next.ball.x > right) {
      next.ball.x = right
      next.ball.vx = -Math.abs(next.ball.vx) * 0.7
    }
    if (next.ball.y < top && !inGoalX) {
      next.ball.y = top
      next.ball.vy = Math.abs(next.ball.vy) * 0.7
    }
    if (next.ball.y > bottom && !inGoalX) {
      next.ball.y = bottom
      next.ball.vy = -Math.abs(next.ball.vy) * 0.7
    }
  }

  updatePossession(next)

  if (checkGoal(next)) {
    next.phase = 'goal'
    next.pauseTicks = GOAL_PAUSE
    next.ball.vx = 0
    next.ball.vy = 0
    next.ball.possessorId = null
    return next
  }

  if (next.timeLeft <= 0) {
    next.phase = 'gameover'
    next.timeLeft = 0
    if (next.redScore > next.blueScore) next.message = 'あなたの勝ち！'
    else if (next.blueScore > next.redScore) next.message = 'CPUの勝ち…'
    else next.message = '引き分け'
  }

  return next
}

function drawPixelPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  isControlled: boolean,
): void {
  const body = player.team === 'red' ? '#dc2626' : '#2563eb'
  const shorts = player.team === 'red' ? '#fef2f2' : '#1e3a8a'
  const skin = '#fcd9b6'

  if (isControlled) {
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(player.x, player.y, PLAYER_R + 5, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath()
  ctx.ellipse(player.x, player.y + 8, PLAYER_R, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = body
  ctx.fillRect(player.x - 8, player.y - 4, 16, 12)
  ctx.fillStyle = shorts
  ctx.fillRect(player.x - 7, player.y + 6, 14, 6)
  ctx.fillStyle = skin
  ctx.fillRect(player.x - 5, player.y - 12, 10, 8)

  if (player.isGk) {
    ctx.fillStyle = '#fbbf24'
    ctx.fillRect(player.x - 6, player.y - 10, 12, 3)
  }
}

function drawMinimap(ctx: CanvasRenderingContext2D, state: SoccerState): void {
  const mw = 100
  const mh = 56
  const mx = WIDTH / 2 - mw / 2
  const my = HEIGHT - mh - 8

  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(mx - 4, my - 4, mw + 8, mh + 8)
  ctx.fillStyle = '#166534'
  ctx.fillRect(mx, my, mw, mh)

  const sx = mw / WIDTH
  const sy = mh / HEIGHT

  for (const p of state.players) {
    ctx.fillStyle = p.team === 'red' ? '#f87171' : '#60a5fa'
    ctx.fillRect(mx + p.x * sx - 2, my + p.y * sy - 2, 4, 4)
  }

  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(mx + state.ball.x * sx, my + state.ball.y * sy, 3, 0, Math.PI * 2)
  ctx.fill()
}

export function drawField(ctx: CanvasRenderingContext2D, state: SoccerState): void {
  for (let y = PADDING; y < HEIGHT - PADDING; y += 16) {
    ctx.fillStyle = ((y / 16) | 0) % 2 === 0 ? '#22c55e' : '#16a34a'
    ctx.fillRect(PADDING, y, WIDTH - PADDING * 2, 16)
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2
  ctx.strokeRect(PADDING, PADDING, WIDTH - PADDING * 2, HEIGHT - PADDING * 2)
  ctx.beginPath()
  ctx.moveTo(PADDING, HEIGHT / 2)
  ctx.lineTo(WIDTH - PADDING, HEIGHT / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(WIDTH / 2, HEIGHT / 2, 36, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(WIDTH / 2 - GOAL_WIDTH / 2, PADDING - 6, GOAL_WIDTH, 8)
  ctx.fillRect(WIDTH / 2 - GOAL_WIDTH / 2, HEIGHT - PADDING - 2, GOAL_WIDTH, 8)

  for (const player of state.players) {
    drawPixelPlayer(ctx, player, player.id === state.controlledId)
  }

  const { ball } = state
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 1
  ctx.stroke()

  drawMinimap(ctx, state)

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 14px monospace'
  ctx.fillText(`YOU ${state.redScore} - ${state.blueScore} CPU`, WIDTH / 2 - 58, 20)
  const mins = Math.floor(state.timeLeft / 60)
  const secs = Math.floor(state.timeLeft % 60)
  ctx.fillText(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`, WIDTH / 2 - 18, 38)

  if (state.phase === 'title') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = '#fef3c7'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('ピクセルサッカー', WIDTH / 2 - 72, HEIGHT / 2 - 40)
    ctx.font = '13px sans-serif'
    ctx.fillText('4対4 · 左で移動', WIDTH / 2 - 52, HEIGHT / 2 - 8)
    ctx.fillText('右でパス / シュート', WIDTH / 2 - 64, HEIGHT / 2 + 16)
    ctx.fillStyle = '#67e8f9'
    ctx.fillText('▶ タップしてキックオフ', WIDTH / 2 - 76, HEIGHT / 2 + 56)
    return
  }

  if (state.phase === 'goal' || state.message) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)'
    ctx.fillRect(0, HEIGHT / 2 - 30, WIDTH, 40)
    ctx.fillStyle = '#fef3c7'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(state.message, WIDTH / 2 - ctx.measureText(state.message).width / 2, HEIGHT / 2 - 6)
  }

  if (state.phase === 'gameover') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = '#fef3c7'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(state.message, WIDTH / 2 - ctx.measureText(state.message).width / 2, HEIGHT / 2 - 16)
    ctx.font = '14px sans-serif'
    const scoreText = `${state.redScore} - ${state.blueScore}`
    ctx.fillText(scoreText, WIDTH / 2 - ctx.measureText(scoreText).width / 2, HEIGHT / 2 + 16)
    ctx.fillStyle = '#67e8f9'
    ctx.fillText('タップしてリトライ', WIDTH / 2 - 64, HEIGHT / 2 + 52)
  }
}
