export const WIDTH = 340
export const HEIGHT = 520
export const PADDLE_R = 26
export const PUCK_R = 10
export const GOAL_WIDTH = 110
export const WIN_SCORE = 5
export const WALL_PADDING = 14

const MAX_PUCK_SPEED = 13
const MIN_PUCK_SPEED = 4.5
const SCORE_PAUSE = 75
const SUB_STEPS = 3

export type AirHockeyDifficulty = 'beginner' | 'intermediate'
export type Phase = 'title' | 'playing' | 'scored' | 'gameover'

const DIFFICULTY_CONFIG = {
  beginner: {
    cpuMaxSpeed: 3.4,
    predictionFrames: 2.5,
    targetNoise: 38,
    chaseHalfRatio: 0.48,
    approachRatio: 0.58,
    hesitateChance: 0.22,
  },
  intermediate: {
    cpuMaxSpeed: 5.8,
    predictionFrames: 5,
    targetNoise: 0,
    chaseHalfRatio: 0.5,
    approachRatio: 0.62,
    hesitateChance: 0,
  },
} as const

export function difficultyLabel(difficulty: AirHockeyDifficulty): string {
  return difficulty === 'beginner' ? '初級' : '中級'
}

export interface Paddle {
  x: number
  y: number
  vx: number
  vy: number
}

export interface AirHockeyState {
  phase: Phase
  playerScore: number
  cpuScore: number
  puck: { x: number; y: number; vx: number; vy: number }
  player: Paddle
  cpu: Paddle
  pauseTicks: number
  lastScorer: 'player' | 'cpu' | null
  winner: 'player' | 'cpu' | null
}

export interface PointerInput {
  x: number
  y: number
  active: boolean
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function clampSpeed(vx: number, vy: number): { vx: number; vy: number } {
  const speed = Math.hypot(vx, vy)
  if (speed <= MAX_PUCK_SPEED) return { vx, vy }
  const scale = MAX_PUCK_SPEED / speed
  return { vx: vx * scale, vy: vy * scale }
}

function ensureMinSpeed(vx: number, vy: number): { vx: number; vy: number } {
  const speed = Math.hypot(vx, vy)
  if (speed >= MIN_PUCK_SPEED || speed === 0) return { vx, vy }
  const scale = MIN_PUCK_SPEED / speed
  return { vx: vx * scale, vy: vy * scale }
}

export function createGameState(): AirHockeyState {
  return {
    phase: 'title',
    playerScore: 0,
    cpuScore: 0,
    puck: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 },
    player: { x: WIDTH / 2, y: HEIGHT - 70, vx: 0, vy: 0 },
    cpu: { x: WIDTH / 2, y: 70, vx: 0, vy: 0 },
    pauseTicks: 0,
    lastScorer: null,
    winner: null,
  }
}

function resetPuck(state: AirHockeyState, toward: 'player' | 'cpu'): void {
  state.puck.x = WIDTH / 2
  state.puck.y = HEIGHT / 2
  state.puck.vx = (Math.random() - 0.5) * 2.5
  state.puck.vy = toward === 'player' ? 5 : -5
}

function movePaddleToward(paddle: Paddle, targetX: number, targetY: number, maxSpeed: number): void {
  const prevX = paddle.x
  const prevY = paddle.y
  const dx = targetX - paddle.x
  const dy = targetY - paddle.y
  const dist = Math.hypot(dx, dy)
  if (dist > maxSpeed) {
    paddle.x += (dx / dist) * maxSpeed
    paddle.y += (dy / dist) * maxSpeed
  } else {
    paddle.x = targetX
    paddle.y = targetY
  }
  paddle.vx = paddle.x - prevX
  paddle.vy = paddle.y - prevY
}

function predictPuckX(
  puck: AirHockeyState['puck'],
  targetY: number,
): number {
  if (puck.vy >= -0.2) return puck.x
  const frames = (puck.y - targetY) / -puck.vy
  if (frames <= 0 || frames > 50) return puck.x
  let x = puck.x + puck.vx * frames
  const left = WALL_PADDING + PUCK_R
  const right = WIDTH - WALL_PADDING - PUCK_R
  while (x < left || x > right) {
    if (x < left) x = left + (left - x)
    if (x > right) x = right - (x - right)
  }
  return x
}

function updateCpu(state: AirHockeyState, difficulty: AirHockeyDifficulty): void {
  const config = DIFFICULTY_CONFIG[difficulty]
  const zoneMaxY = HEIGHT * 0.46
  const defendY = 72
  let targetX = WIDTH / 2
  let targetY = defendY

  const puckInCpuHalf = state.puck.y < HEIGHT * config.chaseHalfRatio
  const puckApproaching = state.puck.vy < 0 && state.puck.y < HEIGHT * config.approachRatio

  if (puckInCpuHalf) {
    targetX = state.puck.x + state.puck.vx * config.predictionFrames
    targetY = clamp(state.puck.y, WALL_PADDING + PADDLE_R + 4, zoneMaxY)
  } else if (puckApproaching) {
    targetX = predictPuckX(state.puck, defendY)
    targetY = clamp(state.puck.y * 0.35 + defendY * 0.65, defendY - 8, zoneMaxY)
  }

  if (config.targetNoise > 0) {
    targetX += (Math.random() - 0.5) * config.targetNoise
    targetY += (Math.random() - 0.5) * config.targetNoise * 0.35
  }

  if (config.hesitateChance > 0 && Math.random() < config.hesitateChance) {
    targetX = WIDTH / 2 + (Math.random() - 0.5) * 40
    targetY = defendY + 12
  }

  movePaddleToward(
    state.cpu,
    clamp(targetX, WALL_PADDING + PADDLE_R, WIDTH - WALL_PADDING - PADDLE_R),
    clamp(targetY, WALL_PADDING + PADDLE_R + 4, zoneMaxY),
    config.cpuMaxSpeed,
  )
}

function updatePlayer(state: AirHockeyState, input: PointerInput): void {
  const prevX = state.player.x
  const prevY = state.player.y

  if (input.active) {
    state.player.x = clamp(
      input.x,
      WALL_PADDING + PADDLE_R,
      WIDTH - WALL_PADDING - PADDLE_R,
    )
    state.player.y = clamp(
      input.y,
      HEIGHT * 0.5,
      HEIGHT - WALL_PADDING - PADDLE_R,
    )
  }

  state.player.vx = state.player.x - prevX
  state.player.vy = state.player.y - prevY
}

function resolvePaddleCollision(
  puck: AirHockeyState['puck'],
  paddle: Paddle,
): void {
  const dx = puck.x - paddle.x
  const dy = puck.y - paddle.y
  const dist = Math.hypot(dx, dy)
  const minDist = PUCK_R + PADDLE_R
  if (dist >= minDist || dist === 0) return

  const nx = dx / dist
  const ny = dy / dist
  puck.x = paddle.x + nx * minDist
  puck.y = paddle.y + ny * minDist

  const relVx = puck.vx - paddle.vx
  const relVy = puck.vy - paddle.vy
  const relDot = relVx * nx + relVy * ny
  if (relDot > 0) {
    puck.vx -= (1.85 * relDot) * nx
    puck.vy -= (1.85 * relDot) * ny
  }

  puck.vx += paddle.vx * 1.15
  puck.vy += paddle.vy * 1.15

  const paddlePower = Math.hypot(paddle.vx, paddle.vy)
  if (paddlePower > 0.5) {
    puck.vx += nx * paddlePower * 0.55
    puck.vy += ny * paddlePower * 0.55
  }

  let next = clampSpeed(puck.vx, puck.vy)
  next = ensureMinSpeed(next.vx, next.vy)
  puck.vx = next.vx
  puck.vy = next.vy
}

function bounceWalls(state: AirHockeyState): void {
  const puck = state.puck
  const left = WALL_PADDING + PUCK_R
  const right = WIDTH - WALL_PADDING - PUCK_R
  const top = WALL_PADDING + PUCK_R
  const bottom = HEIGHT - WALL_PADDING - PUCK_R
  const goalLeft = WIDTH / 2 - GOAL_WIDTH / 2
  const goalRight = WIDTH / 2 + GOAL_WIDTH / 2
  const inGoalX = puck.x > goalLeft && puck.x < goalRight

  if (puck.x < left) {
    puck.x = left
    puck.vx = Math.abs(puck.vx) * 1.02
  }
  if (puck.x > right) {
    puck.x = right
    puck.vx = -Math.abs(puck.vx) * 1.02
  }
  if (puck.y < top && !inGoalX) {
    puck.y = top
    puck.vy = Math.abs(puck.vy) * 1.02
  }
  if (puck.y > bottom && !inGoalX) {
    puck.y = bottom
    puck.vy = -Math.abs(puck.vy) * 1.02
  }
}

function checkGoal(state: AirHockeyState): boolean {
  const inGoalX = Math.abs(state.puck.x - WIDTH / 2) < GOAL_WIDTH / 2

  if (state.puck.y - PUCK_R <= WALL_PADDING && inGoalX) {
    state.playerScore++
    state.lastScorer = 'player'
    return true
  }

  if (state.puck.y + PUCK_R >= HEIGHT - WALL_PADDING && inGoalX) {
    state.cpuScore++
    state.lastScorer = 'cpu'
    return true
  }

  return false
}

function stepPhysics(state: AirHockeyState): void {
  state.puck.x += state.puck.vx / SUB_STEPS
  state.puck.y += state.puck.vy / SUB_STEPS
  bounceWalls(state)
  resolvePaddleCollision(state.puck, state.player)
  resolvePaddleCollision(state.puck, state.cpu)
}

export function startGame(): AirHockeyState {
  const next = createGameState()
  next.phase = 'playing'
  resetPuck(next, Math.random() > 0.5 ? 'player' : 'cpu')
  return next
}

export function updateGame(
  state: AirHockeyState,
  input: PointerInput,
  difficulty: AirHockeyDifficulty = 'intermediate',
): AirHockeyState {
  const next: AirHockeyState = {
    ...state,
    puck: { ...state.puck },
    player: { ...state.player },
    cpu: { ...state.cpu },
  }

  if (next.phase === 'title' || next.phase === 'gameover') return next

  if (next.phase === 'scored') {
    next.pauseTicks -= 1
    if (next.pauseTicks <= 0) {
      if (next.playerScore >= WIN_SCORE) {
        next.phase = 'gameover'
        next.winner = 'player'
        return next
      }
      if (next.cpuScore >= WIN_SCORE) {
        next.phase = 'gameover'
        next.winner = 'cpu'
        return next
      }
      next.phase = 'playing'
      resetPuck(next, next.lastScorer === 'player' ? 'cpu' : 'player')
    }
    return next
  }

  updatePlayer(next, input)
  updateCpu(next, difficulty)

  for (let i = 0; i < SUB_STEPS; i++) {
    stepPhysics(next)
  }

  next.puck.vx *= 0.9995
  next.puck.vy *= 0.9995
  const speed = ensureMinSpeed(next.puck.vx, next.puck.vy)
  const capped = clampSpeed(speed.vx, speed.vy)
  next.puck.vx = capped.vx
  next.puck.vy = capped.vy

  if (checkGoal(next)) {
    next.phase = 'scored'
    next.pauseTicks = SCORE_PAUSE
    next.puck.vx = 0
    next.puck.vy = 0
  }

  return next
}

export function drawTable(ctx: CanvasRenderingContext2D, state: AirHockeyState): void {
  ctx.fillStyle = '#1e4d8f'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = '#2563eb'
  ctx.fillRect(WALL_PADDING, WALL_PADDING, WIDTH - WALL_PADDING * 2, HEIGHT - WALL_PADDING * 2)

  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2
  ctx.setLineDash([])
  ctx.strokeRect(WALL_PADDING, WALL_PADDING, WIDTH - WALL_PADDING * 2, HEIGHT - WALL_PADDING * 2)

  ctx.beginPath()
  ctx.moveTo(WALL_PADDING, HEIGHT / 2)
  ctx.lineTo(WIDTH - WALL_PADDING, HEIGHT / 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(WIDTH / 2, HEIGHT / 2, 36, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(WIDTH / 2 - GOAL_WIDTH / 2, WALL_PADDING - 4, GOAL_WIDTH, 10)
  ctx.fillRect(WIDTH / 2 - GOAL_WIDTH / 2, HEIGHT - WALL_PADDING - 6, GOAL_WIDTH, 10)

  const drawPaddle = (x: number, y: number, fill: string, stroke: string) => {
    ctx.beginPath()
    ctx.arc(x, y, PADDLE_R, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = stroke
    ctx.lineWidth = 3
    ctx.stroke()
  }

  drawPaddle(state.cpu.x, state.cpu.y, '#f8fafc', '#94a3b8')
  drawPaddle(state.player.x, state.player.y, '#fbbf24', '#92400e')

  ctx.beginPath()
  ctx.arc(state.puck.x, state.puck.y, PUCK_R, 0, Math.PI * 2)
  ctx.fillStyle = '#111827'
  ctx.fill()
  ctx.strokeStyle = '#fef3c7'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText(String(state.cpuScore), WIDTH / 2 - 6, 36)
  ctx.fillText(String(state.playerScore), WIDTH / 2 - 6, HEIGHT - 18)

  if (state.phase === 'title') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = '#fef3c7'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('エアホッケー', WIDTH / 2 - 78, HEIGHT / 2 - 36)
    ctx.font = '14px sans-serif'
    ctx.fillText('ドラッグでパドルを動かして', WIDTH / 2 - 84, HEIGHT / 2 - 4)
    ctx.fillText('パックを打ち合おう', WIDTH / 2 - 56, HEIGHT / 2 + 20)
    ctx.fillText('先に5点取った方の勝ち', WIDTH / 2 - 78, HEIGHT / 2 + 44)
    ctx.fillStyle = '#67e8f9'
    ctx.fillText('▶ タップしてスタート', WIDTH / 2 - 72, HEIGHT / 2 + 84)
    return
  }

  if (state.phase === 'gameover') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = state.winner === 'player' ? '#fef3c7' : '#fca5a5'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(state.winner === 'player' ? 'あなたの勝ち!' : 'CPUの勝ち…', WIDTH / 2 - 72, HEIGHT / 2 - 8)
    ctx.fillStyle = '#fff'
    ctx.font = '14px sans-serif'
    ctx.fillText(`${state.playerScore} - ${state.cpuScore}`, WIDTH / 2 - 24, HEIGHT / 2 + 24)
    ctx.fillStyle = '#67e8f9'
    ctx.fillText('タップしてリトライ', WIDTH / 2 - 64, HEIGHT / 2 + 56)
    return
  }

  if (state.phase === 'scored') {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = '#fef3c7'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('GOAL!', WIDTH / 2 - 38, HEIGHT / 2)
  }
}
