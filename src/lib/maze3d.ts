export const WIDTH = 480
export const HEIGHT = 320
export const MOVE_SPEED = 2.8

export type MazeSize = 'small' | 'medium' | 'large'
export type TextureTheme = 'classic' | 'cosmic' | 'garden'
export type MazeMode = 'classic' | 'dungeon'

export const MAZE_CELL_COUNTS: Record<MazeSize, number> = {
  small: 6,
  medium: 10,
  large: 14,
}

export type EntityKind = 'chest' | 'skeleton'

export interface MazeTextures {
  wall: CanvasPattern
  floor: CanvasPattern
  ceiling: CanvasPattern
}

export interface MazeEntity {
  id: string
  kind: EntityKind
  x: number
  y: number
  collected?: boolean
  defeated?: boolean
}

export interface MazeGameState {
  grid: number[][]
  width: number
  height: number
  playerX: number
  playerY: number
  dirX: number
  dirY: number
  planeX: number
  planeY: number
  goalX: number
  goalY: number
  size: MazeSize
  theme: TextureTheme
  mode: MazeMode
  entities: MazeEntity[]
  hp: number
  maxHp: number
  treasures: number
  totalChests: number
  won: boolean
  gameOver: boolean
  steps: number
  message: string
  messageTimer: number
}

export type PlayerInput = {
  forward: boolean
  backward: boolean
}

const HALF_PI = Math.PI / 2
const CARDINAL_DIRS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

function snapToCardinal(dirX: number, dirY: number): { dirX: number; dirY: number; planeX: number; planeY: number } {
  let bestX = 1
  let bestY = 0
  let bestDot = -2
  for (const [dx, dy] of CARDINAL_DIRS) {
    const dot = dirX * dx + dirY * dy
    if (dot > bestDot) {
      bestDot = dot
      bestX = dx
      bestY = dy
    }
  }
  return { dirX: bestX, dirY: bestY, planeX: -bestY * 0.66, planeY: bestX * 0.66 }
}

export function turnMaze90(state: MazeGameState, left: boolean): MazeGameState {
  if (state.won) return state
  const angle = left ? HALF_PI : -HALF_PI
  const next = { ...state }
  const oldDirX = next.dirX
  next.dirX = next.dirX * Math.cos(angle) - next.dirY * Math.sin(angle)
  next.dirY = oldDirX * Math.sin(angle) + next.dirY * Math.cos(angle)
  const snapped = snapToCardinal(next.dirX, next.dirY)
  next.dirX = snapped.dirX
  next.dirY = snapped.dirY
  next.planeX = snapped.planeX
  next.planeY = snapped.planeY
  return next
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateMaze(cellCount: number): number[][] {
  const w = cellCount * 2 + 1
  const h = cellCount * 2 + 1
  const grid = Array.from({ length: h }, () => Array<number>(w).fill(1))

  function carve(x: number, y: number) {
    grid[y][x] = 0
    for (const [dx, dy] of shuffle([
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ])) {
      const nx = x + dx
      const ny = y + dy
      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === 1) {
        grid[y + dy / 2][x + dx / 2] = 0
        carve(nx, ny)
      }
    }
  }

  carve(1, 1)
  grid[h - 2][w - 2] = 0
  if (grid[h - 2][w - 3] === 1) grid[h - 2][w - 3] = 0
  if (grid[h - 3][w - 2] === 1) grid[h - 3][w - 2] = 0
  return grid
}

function listFloorCells(grid: number[][], exclude: { x: number; y: number }[]): { x: number; y: number }[] {
  const blocked = new Set(exclude.map((p) => `${p.x},${p.y}`))
  const cells: { x: number; y: number }[] = []
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 0 && !blocked.has(`${x},${y}`)) {
        cells.push({ x: x + 0.5, y: y + 0.5 })
      }
    }
  }
  return cells
}

function placeDungeonEntities(
  grid: number[][],
  size: MazeSize,
  goalX: number,
  goalY: number,
): MazeEntity[] {
  const floor = shuffle(
    listFloorCells(grid, [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: Math.floor(goalX), y: Math.floor(goalY) },
      { x: Math.floor(goalX) - 1, y: Math.floor(goalY) },
      { x: Math.floor(goalX), y: Math.floor(goalY) - 1 },
    ]),
  )

  const chestCount = size === 'small' ? 3 : size === 'medium' ? 5 : 7
  const skeletonCount = size === 'small' ? 2 : size === 'medium' ? 3 : 5
  const entities: MazeEntity[] = []
  let idx = 0

  for (let i = 0; i < chestCount && idx < floor.length; i++, idx++) {
    entities.push({
      id: `chest-${i}`,
      kind: 'chest',
      x: floor[idx].x,
      y: floor[idx].y,
    })
  }

  for (let i = 0; i < skeletonCount && idx < floor.length; i++, idx++) {
    entities.push({
      id: `skeleton-${i}`,
      kind: 'skeleton',
      x: floor[idx].x,
      y: floor[idx].y,
    })
  }

  return entities
}

export function createMazeGame(size: MazeSize, theme: TextureTheme, mode: MazeMode = 'classic'): MazeGameState {
  const cellCount = MAZE_CELL_COUNTS[size]
  const grid = generateMaze(cellCount)
  const height = grid.length
  const width = grid[0].length
  const goalX = width - 2.5
  const goalY = height - 2.5
  const entities = mode === 'dungeon' ? placeDungeonEntities(grid, size, goalX, goalY) : []
  const totalChests = entities.filter((e) => e.kind === 'chest').length

  return {
    grid,
    width,
    height,
    playerX: 1.5,
    playerY: 1.5,
    dirX: 1,
    dirY: 0,
    planeX: 0,
    planeY: 0.66,
    goalX,
    goalY,
    size,
    theme,
    mode,
    entities,
    hp: 3,
    maxHp: 3,
    treasures: 0,
    totalChests,
    won: false,
    gameOver: false,
    steps: 0,
    message: mode === 'dungeon' ? 'ダンジョンに入った！宝箱を集めてゴールへ' : '',
    messageTimer: 3,
  }
}

function isWall(grid: number[][], x: number, y: number): boolean {
  const gx = Math.floor(x)
  const gy = Math.floor(y)
  if (gx < 0 || gy < 0 || gy >= grid.length || gx >= grid[0].length) return true
  return grid[gy][gx] === 1
}

export function updateMazeGame(state: MazeGameState, input: PlayerInput, dt: number): MazeGameState {
  if (state.won || state.gameOver) return state

  const next: MazeGameState = {
    ...state,
    entities: state.entities.map((e) => ({ ...e })),
    messageTimer: Math.max(0, state.messageTimer - dt),
  }

  const move = MOVE_SPEED * dt

  let moved = false

  if (input.forward || input.backward) {
    const sign = input.forward ? 1 : -1
    const newX = next.playerX + next.dirX * move * sign
    const newY = next.playerY + next.dirY * move * sign
    if (!isWall(next.grid, newX, next.playerY)) next.playerX = newX
    if (!isWall(next.grid, next.playerX, newY)) next.playerY = newY
    moved = true
  }

  if (moved) next.steps += 1

  if (next.mode === 'dungeon') {
    processEntityEncounters(next)
  }

  const dist = Math.hypot(next.playerX - next.goalX, next.playerY - next.goalY)
  if (dist < 0.6 && !next.gameOver) {
    next.won = true
    if (next.mode === 'dungeon') {
      next.message = `ゴール！宝箱 ${next.treasures}/${next.totalChests} 個・残りHP ${next.hp}`
      next.messageTimer = 5
    }
  }

  return next
}

function processEntityEncounters(state: MazeGameState): void {
  for (const entity of state.entities) {
    if (entity.collected || entity.defeated) continue
    const dist = Math.hypot(state.playerX - entity.x, state.playerY - entity.y)
    if (entity.kind === 'chest' && dist < 0.55) {
      entity.collected = true
      state.treasures += 1
      state.message = `宝箱を見つけた！ (${state.treasures}/${state.totalChests})`
      state.messageTimer = 2
    }
    if (entity.kind === 'skeleton' && dist < 0.55) {
      entity.defeated = true
      state.hp -= 1
      state.playerX -= state.dirX * 0.4
      state.playerY -= state.dirY * 0.4
      if (state.hp <= 0) {
        state.hp = 0
        state.gameOver = true
        state.message = 'スケルトンにやられた…ゲームオーバー'
        state.messageTimer = 5
      } else {
        state.message = `スケルトンが襲いかかってきた！ HP ${state.hp}/${state.maxHp}`
        state.messageTimer = 2
      }
    }
  }
}

function makePattern(
  ctx: CanvasRenderingContext2D,
  theme: TextureTheme,
  kind: 'wall' | 'floor' | 'ceiling',
): CanvasPattern {
  const tile = document.createElement('canvas')
  tile.width = 64
  tile.height = 64
  const t = tile.getContext('2d')
  if (!t) return ctx.createPattern(tile, 'repeat')!

  if (kind === 'wall') {
    if (theme === 'classic') {
      t.fillStyle = '#c44'
      t.fillRect(0, 0, 64, 64)
      t.fillStyle = '#eee'
      t.fillRect(0, 0, 64, 4)
      t.fillRect(0, 0, 4, 64)
      t.fillRect(0, 30, 64, 4)
      t.fillRect(30, 0, 4, 32)
      t.fillRect(14, 34, 4, 30)
    } else if (theme === 'cosmic') {
      const grad = t.createLinearGradient(0, 0, 64, 64)
      grad.addColorStop(0, '#1a1a6e')
      grad.addColorStop(0.5, '#4a2a8e')
      grad.addColorStop(1, '#0a0a3e')
      t.fillStyle = grad
      t.fillRect(0, 0, 64, 64)
      for (let i = 0; i < 20; i++) {
        t.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.5})`
        t.fillRect(Math.random() * 60, Math.random() * 60, 2, 2)
      }
    } else {
      t.fillStyle = '#f5f5f0'
      t.fillRect(0, 0, 64, 64)
      t.strokeStyle = '#c8c8b8'
      t.lineWidth = 2
      for (let y = 0; y < 64; y += 16) {
        for (let x = 0; x < 64; x += 16) {
          t.strokeRect(x + 1, y + 1, 14, 14)
        }
      }
      t.fillStyle = '#7cb87c'
      t.globalAlpha = 0.15
      t.fillRect(0, 0, 64, 64)
      t.globalAlpha = 1
    }
  } else if (kind === 'floor') {
    if (theme === 'classic') {
      t.fillStyle = '#c9a050'
      t.fillRect(0, 0, 64, 64)
      for (let i = 0; i < 8; i++) {
        t.fillStyle = i % 2 === 0 ? '#b89040' : '#d4b060'
        t.fillRect(i * 8, 0, 8, 64)
      }
    } else if (theme === 'cosmic') {
      t.fillStyle = '#111'
      t.fillRect(0, 0, 64, 64)
      for (let i = 0; i < 30; i++) {
        t.fillStyle = `rgba(180,180,255,${Math.random()})`
        t.fillRect(Math.random() * 64, Math.random() * 64, 1, 1)
      }
    } else {
      t.fillStyle = '#c4a070'
      t.fillRect(0, 0, 64, 64)
      t.fillStyle = '#b09060'
      for (let y = 0; y < 64; y += 8) {
        t.fillRect(0, y, 64, 2)
      }
    }
  } else {
    if (theme === 'classic') {
      t.fillStyle = '#ddd'
      t.fillRect(0, 0, 64, 64)
      t.fillStyle = '#bbb'
      for (let y = 0; y < 64; y += 16) {
        for (let x = 0; x < 64; x += 16) {
          t.fillRect(x, y, 15, 15)
        }
      }
    } else if (theme === 'cosmic') {
      t.fillStyle = '#0a0a2a'
      t.fillRect(0, 0, 64, 64)
    } else {
      t.fillStyle = '#87ceeb'
      t.fillRect(0, 0, 64, 64)
      for (let i = 0; i < 5; i++) {
        t.fillStyle = 'rgba(255,255,255,0.7)'
        t.beginPath()
        t.arc(10 + i * 12, 10 + (i % 3) * 8, 6 + i, 0, Math.PI * 2)
        t.fill()
      }
    }
  }

  return ctx.createPattern(tile, 'repeat')!
}

const textureCache = new Map<string, MazeTextures>()

export function getMazeTextures(ctx: CanvasRenderingContext2D, theme: TextureTheme): MazeTextures {
  const key = theme
  const cached = textureCache.get(key)
  if (cached) return cached

  const textures = {
    wall: makePattern(ctx, theme, 'wall'),
    floor: makePattern(ctx, theme, 'floor'),
    ceiling: makePattern(ctx, theme, 'ceiling'),
  }
  textureCache.set(key, textures)
  return textures
}

export function drawMaze3D(ctx: CanvasRenderingContext2D, state: MazeGameState): void {
  const { width: screenW, height: screenH } = ctx.canvas
  const { grid, playerX, playerY, dirX, dirY, planeX, planeY } = state

  for (let y = 0; y < screenH / 2; y++) {
    const ceilingGrad = ctx.createLinearGradient(0, 0, 0, screenH / 2)
    ceilingGrad.addColorStop(0, state.theme === 'cosmic' ? '#0a0a2a' : state.theme === 'garden' ? '#87ceeb' : '#ccc')
    ceilingGrad.addColorStop(1, state.theme === 'cosmic' ? '#1a1a4a' : state.theme === 'garden' ? '#b0d8f0' : '#eee')
    ctx.fillStyle = ceilingGrad
    ctx.fillRect(0, y, screenW, 1)
  }

  for (let y = screenH / 2; y < screenH; y++) {
    const floorGrad = ctx.createLinearGradient(0, screenH / 2, 0, screenH)
    floorGrad.addColorStop(0, state.theme === 'cosmic' ? '#222' : state.theme === 'garden' ? '#c4a070' : '#c9a050')
    floorGrad.addColorStop(1, state.theme === 'cosmic' ? '#111' : state.theme === 'garden' ? '#907040' : '#8b6914')
    ctx.fillStyle = floorGrad
    ctx.fillRect(0, y, screenW, 1)
  }

  const zBuffer = new Array<number>(screenW)

  for (let x = 0; x < screenW; x++) {
    const cameraX = (2 * x) / screenW - 1
    const rayDirX = dirX + planeX * cameraX
    const rayDirY = dirY + planeY * cameraX

    let mapX = Math.floor(playerX)
    let mapY = Math.floor(playerY)

    const deltaDistX = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX)
    const deltaDistY = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY)

    let stepX: number
    let stepY: number
    let sideDistX: number
    let sideDistY: number

    if (rayDirX < 0) {
      stepX = -1
      sideDistX = (playerX - mapX) * deltaDistX
    } else {
      stepX = 1
      sideDistX = (mapX + 1 - playerX) * deltaDistX
    }
    if (rayDirY < 0) {
      stepY = -1
      sideDistY = (playerY - mapY) * deltaDistY
    } else {
      stepY = 1
      sideDistY = (mapY + 1 - playerY) * deltaDistY
    }

    let hit = false
    let side = 0

    while (!hit) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX
        mapX += stepX
        side = 0
      } else {
        sideDistY += deltaDistY
        mapY += stepY
        side = 1
      }
      if (mapX < 0 || mapY < 0 || mapY >= grid.length || mapX >= grid[0].length) {
        hit = true
      } else if (grid[mapY][mapX] === 1) {
        hit = true
      }
    }

    const perpWallDist =
      side === 0
        ? (mapX - playerX + (1 - stepX) / 2) / rayDirX
        : (mapY - playerY + (1 - stepY) / 2) / rayDirY

    const lineHeight = Math.floor(screenH / perpWallDist)
    let drawStart = Math.floor(-lineHeight / 2 + screenH / 2)
    if (drawStart < 0) drawStart = 0
    let drawEnd = Math.floor(lineHeight / 2 + screenH / 2)
    if (drawEnd >= screenH) drawEnd = screenH - 1

    zBuffer[x] = perpWallDist

    const wallX = side === 0 ? playerY + perpWallDist * rayDirY : playerX + perpWallDist * rayDirX
    const texX = Math.floor((wallX - Math.floor(wallX)) * 64)

    const shade = side === 1 ? 0.7 : 1.0
    const distShade = Math.max(0.35, 1 - perpWallDist / 14)

    ctx.fillStyle = state.theme === 'classic' ? `rgba(${Math.floor(180 * shade * distShade)},${Math.floor(50 * shade * distShade)},${Math.floor(50 * shade * distShade)},1)` : state.theme === 'cosmic' ? `rgba(${Math.floor(80 * shade * distShade)},${Math.floor(60 * shade * distShade)},${Math.floor(160 * shade * distShade)},1)` : `rgba(${Math.floor(220 * shade * distShade)},${Math.floor(220 * shade * distShade)},${Math.floor(210 * shade * distShade)},1)`

    if (state.theme === 'classic') {
      const brickH = Math.max(4, Math.floor(lineHeight / 8))
      for (let y = drawStart; y < drawEnd; y += brickH) {
        const offset = ((y / brickH) % 2) * brickH * 0.5
        ctx.fillRect(x - offset * 0.1, y, 1, brickH - 1)
        if (y % (brickH * 2) < brickH) {
          ctx.fillStyle = `rgba(${Math.floor(200 * shade * distShade)},${Math.floor(200 * shade * distShade)},${Math.floor(200 * shade * distShade)},0.5)`
          ctx.fillRect(x, y, 1, 2)
          ctx.fillStyle = state.theme === 'classic' ? `rgba(${Math.floor(180 * shade * distShade)},${Math.floor(50 * shade * distShade)},${Math.floor(50 * shade * distShade)},1)` : ''
        }
      }
    } else {
      ctx.fillRect(x, drawStart, 1, drawEnd - drawStart)
    }

    if (texX % 8 === 0 && state.theme === 'classic') {
      ctx.fillStyle = `rgba(255,255,255,${0.3 * distShade})`
      ctx.fillRect(x, drawStart, 1, drawEnd - drawStart)
    }
  }

  drawGoalMarker(ctx, state, screenW, screenH, zBuffer)
  drawEntitySprites(ctx, state, screenW, screenH, zBuffer)
  drawHud(ctx, state, screenW, screenH)
  drawMiniMap(ctx, state)
}

interface SpriteSpec {
  x: number
  y: number
  color: string
  label: string
  scale?: number
}

function drawBillboardSprite(
  ctx: CanvasRenderingContext2D,
  state: MazeGameState,
  screenW: number,
  screenH: number,
  zBuffer: number[],
  sprite: SpriteSpec,
): void {
  const spriteX = sprite.x - state.playerX
  const spriteY = sprite.y - state.playerY

  const invDet = 1 / (state.planeX * state.dirY - state.dirX * state.planeY)
  const transformX = invDet * (state.dirY * spriteX - state.dirX * spriteY)
  const transformY = invDet * (-state.planeY * spriteX + state.planeX * spriteY)

  if (transformY <= 0.2) return

  const spriteScreenX = Math.floor((screenW / 2) * (1 + transformX / transformY))
  const spriteHeight = Math.abs(Math.floor((screenH / transformY) * (sprite.scale ?? 0.8)))
  const spriteWidth = Math.abs(Math.floor((screenH / transformY) * (sprite.scale ?? 0.5)))
  const drawStartY = Math.max(0, -spriteHeight / 2 + screenH / 2)
  const drawEndY = Math.min(screenH - 1, spriteHeight / 2 + screenH / 2)
  const drawStartX = Math.max(0, -spriteWidth / 2 + spriteScreenX)
  const drawEndX = Math.min(screenW - 1, spriteWidth / 2 + spriteScreenX)

  for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
    if (transformY < zBuffer[stripe]) {
      ctx.fillStyle = sprite.color
      ctx.fillRect(stripe, drawStartY, 1, drawEndY - drawStartY)
    }
  }

  if (spriteScreenX > 0 && spriteScreenX < screenW && transformY < 10) {
    const fontSize = Math.max(14, Math.floor(60 / transformY))
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(sprite.label, spriteScreenX, drawStartY + fontSize * 0.5)
  }
}

function drawEntitySprites(
  ctx: CanvasRenderingContext2D,
  state: MazeGameState,
  screenW: number,
  screenH: number,
  zBuffer: number[],
): void {
  if (state.mode !== 'dungeon') return

  const sprites: SpriteSpec[] = []
  for (const entity of state.entities) {
    if (entity.collected || entity.defeated) continue
    if (entity.kind === 'chest') {
      sprites.push({ x: entity.x, y: entity.y, color: '#daa520', label: '📦', scale: 0.7 })
    } else {
      sprites.push({ x: entity.x, y: entity.y, color: '#e8e8e8', label: '💀', scale: 0.85 })
    }
  }

  sprites.sort((a, b) => {
    const da = (a.x - state.playerX) ** 2 + (a.y - state.playerY) ** 2
    const db = (b.x - state.playerX) ** 2 + (b.y - state.playerY) ** 2
    return db - da
  })

  for (const sprite of sprites) {
    drawBillboardSprite(ctx, state, screenW, screenH, zBuffer, sprite)
  }
}

function drawHud(ctx: CanvasRenderingContext2D, state: MazeGameState, screenW: number, screenH: number): void {
  if (state.mode === 'dungeon') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(screenW - 108, 8, 100, 52)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`HP ${'❤️'.repeat(state.hp)}${'🖤'.repeat(state.maxHp - state.hp)}`, screenW - 100, 26)
    ctx.fillText(`📦 ${state.treasures}/${state.totalChests}`, screenW - 100, 44)
  }

  if (state.messageTimer > 0 && state.message) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    const textW = Math.min(screenW - 20, state.message.length * 8 + 20)
    ctx.fillRect((screenW - textW) / 2, screenH - 36, textW, 28)
    ctx.fillStyle = '#fff8f0'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(state.message, screenW / 2, screenH - 18)
  }
}

function drawGoalMarker(
  ctx: CanvasRenderingContext2D,
  state: MazeGameState,
  screenW: number,
  screenH: number,
  zBuffer: number[],
): void {
  const spriteX = state.goalX - state.playerX
  const spriteY = state.goalY - state.playerY

  const invDet = 1 / (state.planeX * state.dirY - state.dirX * state.planeY)
  const transformX = invDet * (state.dirY * spriteX - state.dirX * spriteY)
  const transformY = invDet * (-state.planeY * spriteX + state.planeX * spriteY)

  if (transformY <= 0.2) return

  const spriteScreenX = Math.floor((screenW / 2) * (1 + transformX / transformY))
  const spriteHeight = Math.abs(Math.floor(screenH / transformY))
  const spriteWidth = Math.abs(Math.floor(screenH / transformY))
  const drawStartY = Math.max(0, -spriteHeight / 2 + screenH / 2)
  const drawEndY = Math.min(screenH - 1, spriteHeight / 2 + screenH / 2)
  const drawStartX = Math.max(0, -spriteWidth / 2 + spriteScreenX)
  const drawEndX = Math.min(screenW - 1, spriteWidth / 2 + spriteScreenX)

  for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
    if (transformY < zBuffer[stripe]) {
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(stripe, drawStartY, 1, drawEndY - drawStartY)
    }
  }

  if (spriteScreenX > 0 && spriteScreenX < screenW && transformY < 8) {
    ctx.font = `bold ${Math.max(12, Math.floor(80 / transformY))}px sans-serif`
    ctx.fillStyle = '#ffd700'
    ctx.textAlign = 'center'
    ctx.fillText('GOAL', spriteScreenX, drawStartY - 4)
  }
}

function drawMiniMap(ctx: CanvasRenderingContext2D, state: MazeGameState): void {
  const mapSize = 80
  const cell = mapSize / Math.max(state.width, state.height)
  const ox = 8
  const oy = 8

  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(ox - 2, oy - 2, state.width * cell + 4, state.height * cell + 4)

  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      ctx.fillStyle = state.grid[y][x] === 1 ? '#888' : '#eee'
      ctx.fillRect(ox + x * cell, oy + y * cell, cell - 0.5, cell - 0.5)
    }
  }

  ctx.fillStyle = '#ffd700'
  ctx.fillRect(ox + state.goalX * cell, oy + state.goalY * cell, cell - 0.5, cell - 0.5)

  if (state.mode === 'dungeon') {
    for (const entity of state.entities) {
      if (entity.collected || entity.defeated) continue
      ctx.fillStyle = entity.kind === 'chest' ? '#daa520' : '#ccc'
      ctx.fillRect(ox + entity.x * cell - cell * 0.2, oy + entity.y * cell - cell * 0.2, cell * 0.4, cell * 0.4)
    }
  }

  ctx.fillStyle = '#22d3ee'
  ctx.beginPath()
  ctx.arc(ox + state.playerX * cell, oy + state.playerY * cell, cell * 0.4, 0, Math.PI * 2)
  ctx.fill()

  const angleX = ox + state.playerX * cell + state.dirX * cell * 0.8
  const angleY = oy + state.playerY * cell + state.dirY * cell * 0.8
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(ox + state.playerX * cell, oy + state.playerY * cell)
  ctx.lineTo(angleX, angleY)
  ctx.stroke()
}
