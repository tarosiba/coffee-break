export const WIDTH = 340
export const HEIGHT = 520
export const PADDLE_R = 26
export const PUCK_R = 10
export const GOAL_WIDTH = 110
export const WIN_SCORE = 5
export const WALL_PADDING = 14

const MAX_PUCK_SPEED = 10
const CPU_SPEED = 4.2
const SCORE_PAUSE = 90

export type Phase = 'title' | 'playing' | 'scored' | 'gameover'

export interface AirHockeyState {
  phase: Phase
  playerScore: number
  cpuScore: number
  puck: { x: number; y: number; vx: number; vy: number }
  player: { x: number; y: number }
  cpu: { x: number; y: number }
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

export function createGameState(): AirHockeyState {
  return {
    phase: 'title',
    playerScore: 0,
    cpuScore: 0,
    puck: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 },
    player: { x: WIDTH / 2, y: HEIGHT - 70 },
    cpu: { x: WIDTH / 2, y: 70 },
    pauseTicks: 0,
    lastScorer: null,
    winner: null,
  }
}

function resetPuck(state: AirHockeyState, toward: 'player' | 'cpu'): void {
  state.puck.x = WIDTH / 2
  state.puck.y = HEIGHT / 2
  state.puck.vx = (Math.random() - 0.5) * 2
  state.puck.vy = toward === 'player' ? 3.5 : -3.5
}

function resolvePaddleCollision(
  puck: AirHockeyState['puck'],
  paddle: { x: number; y: number },
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

  const dot = puck.vx * nx + puck.vy * ny
  if (dot > 0) {
    puck.vx -= 2 * dot * nx
    puck.vy -= 2 * dot * ny
  }

  puck.vx += nx * 2.4
  puck.vy += ny * 2.4
  const next = clampSpeed(puck.vx, puck.vy)
  puck.vx = next.vx
  puck.vy = next.vy
}

function updateCpu(state: AirHockeyState): void {
  let targetX = state.puck.x
  if (state.puck.y > HEIGHT * 0.45) {
    targetX = WIDTH / 2
  }

  const dx = targetX - state.cpu.x
  const step = clamp(dx, -CPU_SPEED, CPU_SPEED)
  state.cpu.x = clamp(
    state.cpu.x + step,
    WALL_PADDING + PADDLE_R,
    WIDTH - WALL_PADDING - PADDLE_R,
  )
  state.cpu.y = 70
}

function updatePlayer(state: AirHockeyState, input: PointerInput): void {
  if (!input.active) return

  state.player.x = clamp(
    input.x,
    WALL_PADDING + PADDLE_R,
    WIDTH - WALL_PADDING - PADDLE_R,
  )
  state.player.y = clamp(
    input.y,
    HEIGHT * 0.55,
    HEIGHT - WALL_PADDING - PADDLE_R,
  )
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

export function startGame(): AirHockeyState {
  const next = createGameState()
  next.phase = 'playing'
  resetPuck(next, Math.random() > 0.5 ? 'player' : 'cpu')
  return next
}

export function updateGame(state: AirHockeyState, input: PointerInput): AirHockeyState {
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
  updateCpu(next)

  next.puck.x += next.puck.vx
  next.puck.y += next.puck.vy

  const left = WALL_PADDING + PUCK_R
  const right = WIDTH - WALL_PADDING - PUCK_R
  const top = WALL_PADDING + PUCK_R
  const bottom = HEIGHT - WALL_PADDING - PUCK_R
  const goalLeft = WIDTH / 2 - GOAL_WIDTH / 2
  const goalRight = WIDTH / 2 + GOAL_WIDTH / 2

  if (next.puck.x < left) {
    next.puck.x = left
    next.puck.vx = Math.abs(next.puck.vx) * 0.95
  }
  if (next.puck.x > right) {
    next.puck.x = right
    next.puck.vx = -Math.abs(next.puck.vx) * 0.95
  }

  const inGoalX = next.puck.x > goalLeft && next.puck.x < goalRight
  if (next.puck.y < top && !inGoalX) {
    next.puck.y = top
    next.puck.vy = Math.abs(next.puck.vy) * 0.95
  }
  if (next.puck.y > bottom && !inGoalX) {
    next.puck.y = bottom
    next.puck.vy = -Math.abs(next.puck.vy) * 0.95
  }

  resolvePaddleCollision(next.puck, next.player)
  resolvePaddleCollision(next.puck, next.cpu)

  next.puck.vx *= 0.999
  next.puck.vy *= 0.999
  const speed = clampSpeed(next.puck.vx, next.puck.vy)
  next.puck.vx = speed.vx
  next.puck.vy = speed.vy

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
    ctx.fillText('エアホッケー', WIDTH / 2 - 78, HEIGHT / 2 - 24)
    ctx.font = '14px sans-serif'
    ctx.fillText('タップ / ドラッグで操作', WIDTH / 2 - 72, HEIGHT / 2 + 8)
    ctx.fillText('先に5点取った方の勝ち', WIDTH / 2 - 78, HEIGHT / 2 + 32)
    ctx.fillStyle = '#67e8f9'
    ctx.fillText('▶ タップしてスタート', WIDTH / 2 - 72, HEIGHT / 2 + 72)
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
