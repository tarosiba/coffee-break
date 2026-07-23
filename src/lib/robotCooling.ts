export const WIDTH = 360
export const HEIGHT = 480

export type CoolingDifficulty = 'beginner' | 'intermediate'
export type GamePhase = 'title' | 'playing' | 'cleared' | 'overheat'

export type CoolingItemType = 'fan' | 'ice' | 'shade' | 'drink' | 'sunbeam'

export interface CoolingItem {
  id: number
  type: CoolingItemType
  x: number
  y: number
  vy: number
  ttl: number
}

export interface RobotCoolingState {
  phase: GamePhase
  difficulty: CoolingDifficulty
  temperature: number
  comfortSeconds: number
  elapsed: number
  goalSeconds: number
  heatPause: number
  items: CoolingItem[]
  nextId: number
  spawnCooldown: number
  message: string
  highComfort: number
}

const COMFORT_MIN = 35
const COMFORT_MAX = 68
const OVERHEAT = 100
const GOAL_SECONDS = 75

const ITEM_CONFIG: Record<
  CoolingItemType,
  { emoji: string; label: string; cool: number; isTrap: boolean }
> = {
  fan: { emoji: '🌬️', label: '扇ぐ', cool: -12, isTrap: false },
  ice: { emoji: '🧊', label: '氷', cool: -18, isTrap: false },
  shade: { emoji: '☂️', label: '日陰', cool: -14, isTrap: false },
  drink: { emoji: '🥤', label: '冷たい飲み物', cool: -10, isTrap: false },
  sunbeam: { emoji: '☀️', label: '直射日光', cool: 10, isTrap: true },
}

function loadHighComfort(): number {
  const value = localStorage.getItem('coffee-break-robot-cooling-high')
  return value ? parseInt(value, 10) : 0
}

function saveHighComfort(seconds: number) {
  localStorage.setItem('coffee-break-robot-cooling-high', String(seconds))
}

function heatRate(difficulty: CoolingDifficulty): number {
  return difficulty === 'beginner' ? 0.32 : 0.5
}

function spawnInterval(difficulty: CoolingDifficulty): number {
  return difficulty === 'beginner' ? 1.4 : 1.1
}

function randomItemType(difficulty: CoolingDifficulty): CoolingItemType {
  const pool: CoolingItemType[] =
    difficulty === 'beginner'
      ? ['fan', 'fan', 'ice', 'shade', 'drink', 'drink']
      : ['fan', 'ice', 'shade', 'drink', 'sunbeam', 'fan', 'ice']
  return pool[Math.floor(Math.random() * pool.length)]
}

export function difficultyLabel(difficulty: CoolingDifficulty): string {
  return difficulty === 'beginner' ? '初級（のんびり）' : '中級（暑い日）'
}

export function createGameState(difficulty: CoolingDifficulty = 'beginner'): RobotCoolingState {
  return {
    phase: 'title',
    difficulty,
    temperature: 52,
    comfortSeconds: 0,
    elapsed: 0,
    goalSeconds: GOAL_SECONDS,
    heatPause: 0,
    items: [],
    nextId: 1,
    spawnCooldown: 0.8,
    message: 'ロボット君を涼しくして、夏の休憩をのんびり守ろう',
    highComfort: loadHighComfort(),
  }
}

export function startGame(difficulty: CoolingDifficulty): RobotCoolingState {
  return {
    ...createGameState(difficulty),
    phase: 'playing',
    temperature: 55,
    message: '涼しいアイテムをタップ！ 直射日光は早めにタップして避けよう',
  }
}

function spawnItem(state: RobotCoolingState): RobotCoolingState {
  const type = randomItemType(state.difficulty)
  const margin = 36
  const item: CoolingItem = {
    id: state.nextId,
    type,
    x: margin + Math.random() * (WIDTH - margin * 2),
    y: -24,
    vy: 38 + Math.random() * 22,
    ttl: type === 'sunbeam' ? 4.5 : 6,
  }
  return {
    ...state,
    nextId: state.nextId + 1,
    items: [...state.items, item],
  }
}

export function tapItem(state: RobotCoolingState, itemId: number): RobotCoolingState {
  if (state.phase !== 'playing') return state
  const item = state.items.find((entry) => entry.id === itemId)
  if (!item) return state

  const config = ITEM_CONFIG[item.type]
  let temperature = state.temperature + config.cool
  let heatPause = state.heatPause
  let message = `${config.label}！ ひと息つけたね`

  if (item.type === 'shade') {
    heatPause = Math.max(heatPause, 2.5)
    message = '日陰で休憩。熱が上がりにくくなった'
  }
  if (item.type === 'sunbeam') {
    message = '直射日光を避けた！'
  }

  temperature = Math.max(18, Math.min(96, temperature))

  return {
    ...state,
    temperature,
    heatPause,
    message,
    items: state.items.filter((entry) => entry.id !== itemId),
  }
}

export function updateGame(state: RobotCoolingState, dt: number): RobotCoolingState {
  if (state.phase !== 'playing') return state

  const elapsed = state.elapsed + dt
  const heatPause = Math.max(0, state.heatPause - dt)
  let temperature = state.temperature
  if (heatPause <= 0) {
    temperature += heatRate(state.difficulty) * dt
  }

  let comfortSeconds = state.comfortSeconds
  if (temperature >= COMFORT_MIN && temperature <= COMFORT_MAX) {
    comfortSeconds += dt
  }

  const spawnCooldown = state.spawnCooldown - dt
  let next = { ...state, elapsed, heatPause, temperature, comfortSeconds, spawnCooldown }
  if (spawnCooldown <= 0) {
    next = spawnItem(next)
    next.spawnCooldown = spawnInterval(state.difficulty)
  }

  next.items = next.items
    .map((item) => ({
      ...item,
      y: item.y + item.vy * dt,
      ttl: item.ttl - dt,
    }))
    .filter((item) => item.ttl > 0 && item.y < HEIGHT + 40)

  if (temperature >= OVERHEAT) {
    return {
      ...next,
      phase: 'overheat',
      message: 'ロボット君が熱暴走… 深呼吸して、もう一度のんびり涼まそう',
    }
  }

  if (elapsed >= state.goalSeconds) {
    const highComfort = Math.max(state.highComfort, Math.floor(comfortSeconds))
    saveHighComfort(highComfort)
    return {
      ...next,
      phase: 'cleared',
      highComfort,
      message: '夏の休憩クリア！ ロボット君もおじさんも、のんびりできたね ☕',
    }
  }

  return next
}

export function comfortLabel(temperature: number): string {
  if (temperature < COMFORT_MIN) return 'ちょっと寒い？'
  if (temperature <= COMFORT_MAX) return '快適ゾーン'
  if (temperature < 88) return '暑くなってきた'
  return '危険！ 急いで冷やして'
}

export function drawScene(ctx: CanvasRenderingContext2D, state: RobotCoolingState) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  gradient.addColorStop(0, '#fff7ed')
  gradient.addColorStop(1, '#fde6c8')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'
  ctx.beginPath()
  ctx.arc(WIDTH - 48, 52, 34, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = '28px sans-serif'
  ctx.fillText('☀️', WIDTH - 64, 64)

  const barX = 24
  const barY = 18
  const barW = WIDTH - 48
  const barH = 14
  ctx.fillStyle = '#f5e6d3'
  ctx.fillRect(barX, barY, barW, barH)
  const fillW = (state.temperature / 100) * barW
  const tempColor =
    state.temperature <= COMFORT_MAX
      ? '#65a30d'
      : state.temperature < 88
        ? '#d97706'
        : '#dc2626'
  ctx.fillStyle = tempColor
  ctx.fillRect(barX, barY, fillW, barH)
  ctx.strokeStyle = '#a67c52'
  ctx.strokeRect(barX, barY, barW, barH)

  ctx.fillStyle = '#5c3d2e'
  ctx.font = '12px sans-serif'
  ctx.fillText(`体温 ${Math.round(state.temperature)}℃`, barX, barY + 30)
  ctx.fillText(comfortLabel(state.temperature), barX + 120, barY + 30)

  const robotX = WIDTH / 2
  const robotY = HEIGHT - 118
  const wobble = Math.sin(state.elapsed * 4) * (state.temperature > 80 ? 2.5 : 0.8)
  ctx.font = '56px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🤖', robotX + wobble, robotY)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = '#7c5c45'
  ctx.fillText('ロボット君', robotX, robotY + 24)

  ctx.font = '20px sans-serif'
  ctx.textAlign = 'left'
  for (const item of state.items) {
    const config = ITEM_CONFIG[item.type]
    ctx.fillText(config.emoji, item.x - 12, item.y)
    if (item.type === 'sunbeam') {
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.35)'
      ctx.beginPath()
      ctx.arc(item.x, item.y - 8, 22, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  if (state.phase === 'title') {
    drawOverlay(ctx, 'ロボット君冷却ゲーム', 'タップでスタート', 'マンガ第2話の続き・猛暑ののんびり休憩')
  } else if (state.phase === 'overheat') {
    drawOverlay(ctx, 'ちょっと休憩', 'タップでもう一度', state.message)
  } else if (state.phase === 'cleared') {
    drawOverlay(
      ctx,
      'クリア！',
      'タップでもう一度',
      `快適時間 ${Math.floor(state.comfortSeconds)} 秒 / 最高 ${state.highComfort} 秒`,
    )
  }
}

function drawOverlay(ctx: CanvasRenderingContext2D, title: string, action: string, subtitle: string) {
  ctx.fillStyle = 'rgba(92, 61, 46, 0.55)'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = '#fff7ed'
  ctx.textAlign = 'center'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText(title, WIDTH / 2, HEIGHT / 2 - 28)
  ctx.font = '14px sans-serif'
  ctx.fillText(subtitle, WIDTH / 2, HEIGHT / 2)
  ctx.font = '16px sans-serif'
  ctx.fillText(action, WIDTH / 2, HEIGHT / 2 + 36)
}

export function findItemAt(state: RobotCoolingState, x: number, y: number): number | null {
  for (let i = state.items.length - 1; i >= 0; i -= 1) {
    const item = state.items[i]
    const dx = x - item.x
    const dy = y - (item.y - 8)
    if (dx * dx + dy * dy <= 28 * 28) return item.id
  }
  return null
}
