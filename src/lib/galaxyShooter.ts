export const WIDTH = 360
export const HEIGHT = 480

export type GamePhase = 'title' | 'playing' | 'gameover'

export type EnemyType = 'flag' | 'red' | 'blue' | 'green'

export interface Enemy {
  id: number
  x: number
  y: number
  type: EnemyType
  alive: boolean
  diving: boolean
  diveVx: number
  diveVy: number
  homeX: number
  homeY: number
}

export interface Bullet {
  id: number
  x: number
  y: number
  vy: number
  fromPlayer: boolean
}

export interface GameState {
  phase: GamePhase
  playerX: number
  lives: number
  score: number
  highScore: number
  enemies: Enemy[]
  bullets: Bullet[]
  formationDir: 1 | -1
  formationY: number
  tick: number
  nextId: number
  lastFireTick: number
}

const FIRE_INTERVAL = 4
const MAX_PLAYER_BULLETS = 5

const ENEMY_SCORE: Record<EnemyType, number> = {
  flag: 150,
  red: 80,
  blue: 60,
  green: 50,
}

const FORMATION_ROWS: EnemyType[][] = [
  ['flag', 'flag'],
  ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
  ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
  ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
  ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
]

function loadHighScore() {
  const v = localStorage.getItem('coffee-break-galaxy-highscore')
  return v ? parseInt(v, 10) : 0
}

function saveHighScore(score: number) {
  localStorage.setItem('coffee-break-galaxy-highscore', String(score))
}

function buildFormation(nextId: number): { enemies: Enemy[]; nextId: number } {
  const enemies: Enemy[] = []
  let id = nextId
  const startX = 50
  const startY = 70
  const gapX = 34
  const gapY = 30

  FORMATION_ROWS.forEach((row, ri) => {
    const offsetX = ri === 0 ? gapX * 3 : 0
    row.forEach((type, ci) => {
      const x = startX + offsetX + ci * gapX
      const y = startY + ri * gapY
      enemies.push({
        id: id++,
        x,
        y,
        type,
        alive: true,
        diving: false,
        diveVx: 0,
        diveVy: 0,
        homeX: x,
        homeY: y,
      })
    })
  })

  return { enemies, nextId: id }
}

export function createGameState(): GameState {
  const { enemies, nextId } = buildFormation(1)
  return {
    phase: 'title',
    playerX: WIDTH / 2,
    lives: 3,
    score: 0,
    highScore: loadHighScore(),
    enemies,
    bullets: [],
    formationDir: 1,
    formationY: 0,
    tick: 0,
    nextId,
    lastFireTick: -FIRE_INTERVAL,
  }
}

function aliveEnemies(state: GameState) {
  return state.enemies.filter((e) => e.alive)
}

function spawnBullet(state: GameState, fromPlayer: boolean): GameState {
  if (fromPlayer) {
    const playerBullets = state.bullets.filter((b) => b.fromPlayer)
    if (playerBullets.length >= MAX_PLAYER_BULLETS) return state
    if (state.tick - state.lastFireTick < FIRE_INTERVAL) return state
    return {
      ...state,
      lastFireTick: state.tick,
      bullets: [
        ...state.bullets,
        { id: state.nextId, x: state.playerX, y: HEIGHT - 50, vy: -7, fromPlayer: true },
      ],
      nextId: state.nextId + 1,
    }
  }
  return state
}

function startDive(state: GameState): GameState {
  const candidates = state.enemies.filter((e) => e.alive && !e.diving)
  if (candidates.length === 0) return state
  const enemy = candidates[Math.floor(Math.random() * candidates.length)]
  const toward = state.playerX > enemy.x ? 1.2 : -1.2
  return {
    ...state,
    enemies: state.enemies.map((e) =>
      e.id === enemy.id
        ? { ...e, diving: true, diveVx: toward, diveVy: 2.5 }
        : e,
    ),
  }
}

function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export function updateGame(state: GameState, keys: { left: boolean; right: boolean; fire: boolean }): GameState {
  if (state.phase !== 'playing') return state

  let next: GameState = { ...state, tick: state.tick + 1 }

  // Player move
  const speed = 4
  if (keys.left) next = { ...next, playerX: Math.max(20, next.playerX - speed) }
  if (keys.right) next = { ...next, playerX: Math.min(WIDTH - 20, next.playerX + speed) }
  if (keys.fire) next = spawnBullet(next, true)

  // Formation movement
  const alive = aliveEnemies(next)
  if (alive.some((e) => !e.diving)) {
    const moveX = next.formationDir * 0.6
    let hitEdge = false
    for (const e of next.enemies) {
      if (!e.alive || e.diving) continue
      const nx = e.x + moveX
      if (nx < 16 || nx > WIDTH - 16) hitEdge = true
    }
    if (hitEdge) {
      next = {
        ...next,
        formationDir: (next.formationDir * -1) as 1 | -1,
        formationY: next.formationY + 8,
        enemies: next.enemies.map((e) =>
          e.alive && !e.diving ? { ...e, y: e.y + 8 } : e,
        ),
      }
    } else {
      next = {
        ...next,
        enemies: next.enemies.map((e) =>
          e.alive && !e.diving ? { ...e, x: e.x + moveX } : e,
        ),
      }
    }
  }

  // Random dive
  if (next.tick % 90 === 0 && Math.random() < 0.55) {
    next = startDive(next)
  }

  // Diving enemies
  next = {
    ...next,
    enemies: next.enemies.map((e) => {
      if (!e.alive || !e.diving) return e
      let { x, y, diveVx, diveVy } = e
      x += diveVx
      y += diveVy
      if (y > HEIGHT * 0.45) diveVy = 3
      if (y > HEIGHT - 60) {
        diveVy = -2.5
        diveVx *= 0.5
      }
      if (y < e.homeY - 20) {
        return { ...e, x: e.homeX, y: e.homeY, diving: false, diveVx: 0, diveVy: 0 }
      }
      return { ...e, x, y, diveVx, diveVy }
    }),
  }

  // Bullets
  next = {
    ...next,
    bullets: next.bullets
      .map((b) => ({ ...b, y: b.y + b.vy }))
      .filter((b) => b.y > -10 && b.y < HEIGHT + 10),
  }

  // Collisions: player bullets vs enemies
  const bullets: Bullet[] = []
  const enemies = next.enemies.map((e) => ({ ...e }))
  for (const b of next.bullets) {
    if (!b.fromPlayer) {
      bullets.push(b)
      continue
    }
    let hit = false
    for (const e of enemies) {
      if (!e.alive) continue
      if (rectsOverlap(b.x - 2, b.y - 6, 4, 10, e.x - 12, e.y - 10, 24, 20)) {
        e.alive = false
        hit = true
        next = { ...next, score: next.score + ENEMY_SCORE[e.type] }
        break
      }
    }
    if (!hit) bullets.push(b)
  }
  next = { ...next, enemies, bullets }

  // Enemy bullets (diving enemies shoot)
  if (next.tick % 50 === 0) {
    const shooter = next.enemies.find((e) => e.alive && e.diving && e.y > 100)
    if (shooter) {
      next = {
        ...next,
        bullets: [
          ...next.bullets,
          { id: next.nextId, x: shooter.x, y: shooter.y + 10, vy: 4, fromPlayer: false },
        ],
        nextId: next.nextId + 1,
      }
    }
  }

  // Collisions: enemy bullets vs player
  const playerBullets: Bullet[] = []
  let hitPlayer = false
  for (const b of next.bullets) {
    if (b.fromPlayer) {
      playerBullets.push(b)
      continue
    }
    if (rectsOverlap(b.x - 2, b.y - 4, 4, 8, next.playerX - 14, HEIGHT - 58, 28, 20)) {
      hitPlayer = true
    } else {
      playerBullets.push(b)
    }
  }
  next = { ...next, bullets: playerBullets }

  if (hitPlayer) {
    const lives = next.lives - 1
    if (lives <= 0) {
      const highScore = Math.max(next.highScore, next.score)
      saveHighScore(highScore)
      return { ...createGameState(), phase: 'gameover', score: next.score, highScore }
    }
    return { ...next, lives, bullets: next.bullets.filter((b) => b.fromPlayer) }
  }

  // Enemy crash into player
  for (const e of next.enemies) {
    if (!e.alive) continue
    if (rectsOverlap(e.x - 12, e.y - 10, 24, 20, next.playerX - 14, HEIGHT - 58, 28, 20)) {
      const lives = next.lives - 1
      e.alive = false
      if (lives <= 0) {
        const highScore = Math.max(next.highScore, next.score)
        saveHighScore(highScore)
        return { ...createGameState(), phase: 'gameover', score: next.score, highScore }
      }
      return { ...next, lives }
    }
  }

  // Win wave -> next wave
  if (aliveEnemies(next).length === 0) {
    const { enemies: newEnemies, nextId } = buildFormation(next.nextId)
    return {
      ...next,
      enemies: newEnemies,
      nextId,
      formationDir: 1,
      formationY: 0,
      score: next.score + 200,
    }
  }

  // Game over if formation too low
  if (next.enemies.some((e) => e.alive && !e.diving && e.y > HEIGHT - 120)) {
    const highScore = Math.max(next.highScore, next.score)
    saveHighScore(highScore)
    return { ...createGameState(), phase: 'gameover', score: next.score, highScore }
  }

  return next
}

export function startGame(state: GameState): GameState {
  const fresh = createGameState()
  return { ...fresh, phase: 'playing', highScore: state.highScore }
}

export const ENEMY_COLORS: Record<EnemyType, { body: string; wing: string }> = {
  flag: { body: '#f5c400', wing: '#3b82f6' },
  red: { body: '#ef4444', wing: '#fca5a5' },
  blue: { body: '#3b82f6', wing: '#93c5fd' },
  green: { body: '#22c55e', wing: '#86efac' },
}
