export type FurnitureKind = 'sofa' | 'table' | 'bed' | 'chair' | 'desk' | 'plant'

export type DesignerTool = 'room' | 'furniture' | 'wallpaper' | 'floor' | 'erase'

export interface Room {
  id: string
  x: number
  y: number
  w: number
  h: number
  name: string
  wallColor: string
  floorColor: string
}

export interface Furniture {
  id: string
  kind: FurnitureKind
  x: number
  y: number
  w: number
  h: number
}

export interface FloorPlan {
  id: string
  name: string
  gridCols: number
  gridRows: number
  rooms: Room[]
  furniture: Furniture[]
}

export const GRID_COLS = 20
export const GRID_ROWS = 16
export const WALL_HEIGHT = 2.4

export const WALL_COLORS = [
  { id: 'cream', label: 'クリーム', color: '#f5f0e8' },
  { id: 'beige', label: 'ベージュ', color: '#e8dfd0' },
  { id: 'sand', label: 'サンド', color: '#d4c4b0' },
  { id: 'sky', label: 'スカイ', color: '#c8dce8' },
  { id: 'rose', label: 'ローズ', color: '#e8d0d0' },
  { id: 'sage', label: 'セージ', color: '#d0e0d4' },
] as const

export const FLOOR_COLORS = [
  { id: 'wood', label: 'フローリング', color: '#b08852' },
  { id: 'light-wood', label: '明るい床', color: '#d4b896' },
  { id: 'tile', label: 'タイル', color: '#d8d8d8' },
  { id: 'carpet', label: 'カーペット', color: '#c9a97a' },
  { id: 'dark-wood', label: 'ダークウッド', color: '#6f4a2a' },
] as const

export const FURNITURE_PRESETS: Record<
  FurnitureKind,
  { w: number; h: number; label: string; color: string; height: number; emoji: string }
> = {
  sofa: { w: 3, h: 1, label: 'ソファ', color: '#8b5e34', height: 0.8, emoji: '🛋' },
  table: { w: 2, h: 2, label: 'テーブル', color: '#6f4a2a', height: 0.75, emoji: '🪑' },
  bed: { w: 3, h: 4, label: 'ベッド', color: '#c9a97a', height: 0.6, emoji: '🛏' },
  chair: { w: 1, h: 1, label: '椅子', color: '#b08852', height: 0.9, emoji: '💺' },
  desk: { w: 2, h: 1, label: '机', color: '#5c4033', height: 0.75, emoji: '🖥' },
  plant: { w: 1, h: 1, label: '観葉植物', color: '#4a7c59', height: 1.0, emoji: '🪴' },
}

export const FURNITURE_KINDS = Object.keys(FURNITURE_PRESETS) as FurnitureKind[]

export function createDefaultPlan(): FloorPlan {
  return {
    id: generateId(),
    name: 'マイプラン',
    gridCols: GRID_COLS,
    gridRows: GRID_ROWS,
    rooms: [],
    furniture: [],
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function clonePlan(plan: FloorPlan): FloorPlan {
  return JSON.parse(JSON.stringify(plan)) as FloorPlan
}

export function snapToGrid(gx: number, gy: number): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(GRID_COLS - 1, Math.round(gx))),
    y: Math.max(0, Math.min(GRID_ROWS - 1, Math.round(gy))),
  }
}

export function canvasToGrid(
  px: number,
  py: number,
  canvasW: number,
  canvasH: number,
): { x: number; y: number } {
  const cell = Math.min(canvasW / GRID_COLS, canvasH / GRID_ROWS)
  const offsetX = (canvasW - cell * GRID_COLS) / 2
  const offsetY = (canvasH - cell * GRID_ROWS) / 2
  const gx = (px - offsetX) / cell
  const gy = (py - offsetY) / cell
  return snapToGrid(gx, gy)
}

export function getCellSize(canvasW: number, canvasH: number): number {
  return Math.min(canvasW / GRID_COLS, canvasH / GRID_ROWS)
}

export function getGridOffset(canvasW: number, canvasH: number, cell: number): { x: number; y: number } {
  return {
    x: (canvasW - cell * GRID_COLS) / 2,
    y: (canvasH - cell * GRID_ROWS) / 2,
  }
}

export function findRoomAt(plan: FloorPlan, gx: number, gy: number): Room | null {
  for (let i = plan.rooms.length - 1; i >= 0; i--) {
    const r = plan.rooms[i]
    if (gx >= r.x && gx < r.x + r.w && gy >= r.y && gy < r.y + r.h) return r
  }
  return null
}

export function findFurnitureAt(plan: FloorPlan, gx: number, gy: number): Furniture | null {
  for (let i = plan.furniture.length - 1; i >= 0; i--) {
    const f = plan.furniture[i]
    if (gx >= f.x && gx < f.x + f.w && gy >= f.y && gy < f.y + f.h) return f
  }
  return null
}

export function canPlaceFurniture(plan: FloorPlan, x: number, y: number, w: number, h: number): boolean {
  if (x < 0 || y < 0 || x + w > GRID_COLS || y + h > GRID_ROWS) return false
  for (let gy = y; gy < y + h; gy++) {
    for (let gx = x; gx < x + w; gx++) {
      if (!findRoomAt(plan, gx, gy)) return false
    }
  }
  return true
}

export function addRoom(plan: FloorPlan, x1: number, y1: number, x2: number, y2: number): FloorPlan {
  const x = Math.min(x1, x2)
  const y = Math.min(y1, y2)
  const w = Math.abs(x2 - x1) + 1
  const h = Math.abs(y2 - y1) + 1
  if (w < 1 || h < 1) return plan

  const next = clonePlan(plan)
  next.rooms.push({
    id: generateId(),
    x,
    y,
    w,
    h,
    name: `部屋${next.rooms.length + 1}`,
    wallColor: WALL_COLORS[0].color,
    floorColor: FLOOR_COLORS[0].color,
  })
  return next
}

export function addFurniture(plan: FloorPlan, kind: FurnitureKind, x: number, y: number): FloorPlan {
  const preset = FURNITURE_PRESETS[kind]
  if (!canPlaceFurniture(plan, x, y, preset.w, preset.h)) return plan

  const next = clonePlan(plan)
  next.furniture.push({
    id: generateId(),
    kind,
    x,
    y,
    w: preset.w,
    h: preset.h,
  })
  return next
}

export function applyWallColor(plan: FloorPlan, roomId: string, color: string): FloorPlan {
  const next = clonePlan(plan)
  const room = next.rooms.find((r) => r.id === roomId)
  if (room) room.wallColor = color
  return next
}

export function applyFloorColor(plan: FloorPlan, roomId: string, color: string): FloorPlan {
  const next = clonePlan(plan)
  const room = next.rooms.find((r) => r.id === roomId)
  if (room) room.floorColor = color
  return next
}

export function removeAt(plan: FloorPlan, gx: number, gy: number): FloorPlan {
  const furniture = findFurnitureAt(plan, gx, gy)
  if (furniture) {
    const next = clonePlan(plan)
    next.furniture = next.furniture.filter((f) => f.id !== furniture.id)
    return next
  }

  const room = findRoomAt(plan, gx, gy)
  if (room) {
    const next = clonePlan(plan)
    next.rooms = next.rooms.filter((r) => r.id !== room.id)
    next.furniture = next.furniture.filter(
      (f) => !(f.x >= room.x && f.x + f.w <= room.x + room.w && f.y >= room.y && f.y + f.h <= room.y + room.h),
    )
    return next
  }

  return plan
}

function gridToScreen(
  gx: number,
  gy: number,
  cell: number,
  offsetX: number,
  offsetY: number,
): { x: number; y: number } {
  return { x: offsetX + gx * cell, y: offsetY + gy * cell }
}

export function drawFloorPlan2D(
  ctx: CanvasRenderingContext2D,
  plan: FloorPlan,
  preview: { x1: number; y1: number; x2: number; y2: number } | null,
): void {
  const { width, height } = ctx.canvas
  const cell = getCellSize(width, height)
  const { x: offsetX, y: offsetY } = getGridOffset(width, height, cell)

  ctx.fillStyle = '#e8f0e4'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#fff8f0'
  ctx.fillRect(offsetX, offsetY, cell * GRID_COLS, cell * GRID_ROWS)

  ctx.strokeStyle = '#e8dfd0'
  ctx.lineWidth = 1
  for (let gx = 0; gx <= GRID_COLS; gx++) {
    const x = offsetX + gx * cell
    ctx.beginPath()
    ctx.moveTo(x, offsetY)
    ctx.lineTo(x, offsetY + cell * GRID_ROWS)
    ctx.stroke()
  }
  for (let gy = 0; gy <= GRID_ROWS; gy++) {
    const y = offsetY + gy * cell
    ctx.beginPath()
    ctx.moveTo(offsetX, y)
    ctx.lineTo(offsetX + cell * GRID_COLS, y)
    ctx.stroke()
  }

  for (const room of plan.rooms) {
    const topLeft = gridToScreen(room.x, room.y, cell, offsetX, offsetY)
    ctx.fillStyle = room.floorColor
    ctx.fillRect(topLeft.x, topLeft.y, room.w * cell, room.h * cell)

    ctx.fillStyle = room.wallColor
    ctx.globalAlpha = 0.35
    ctx.fillRect(topLeft.x, topLeft.y, room.w * cell, room.h * cell)
    ctx.globalAlpha = 1

    ctx.strokeStyle = '#6f4a2a'
    ctx.lineWidth = 2
    ctx.strokeRect(topLeft.x, topLeft.y, room.w * cell, room.h * cell)

    ctx.fillStyle = '#6f4a2a'
    ctx.font = `bold ${Math.max(10, cell * 0.35)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      room.name,
      topLeft.x + (room.w * cell) / 2,
      topLeft.y + (room.h * cell) / 2,
    )
  }

  for (const item of plan.furniture) {
    const preset = FURNITURE_PRESETS[item.kind]
    const topLeft = gridToScreen(item.x, item.y, cell, offsetX, offsetY)
    ctx.fillStyle = preset.color
    ctx.fillRect(topLeft.x + 2, topLeft.y + 2, item.w * cell - 4, item.h * cell - 4)
    ctx.strokeStyle = '#3d2817'
    ctx.lineWidth = 1
    ctx.strokeRect(topLeft.x + 2, topLeft.y + 2, item.w * cell - 4, item.h * cell - 4)

    ctx.font = `${Math.max(12, cell * 0.5)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      preset.emoji,
      topLeft.x + (item.w * cell) / 2,
      topLeft.y + (item.h * cell) / 2,
    )
  }

  if (preview) {
    const x = Math.min(preview.x1, preview.x2)
    const y = Math.min(preview.y1, preview.y2)
    const w = Math.abs(preview.x2 - preview.x1) + 1
    const h = Math.abs(preview.y2 - preview.y1) + 1
    const topLeft = gridToScreen(x, y, cell, offsetX, offsetY)
    ctx.fillStyle = 'rgba(111, 74, 42, 0.2)'
    ctx.fillRect(topLeft.x, topLeft.y, w * cell, h * cell)
    ctx.strokeStyle = '#6f4a2a'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.strokeRect(topLeft.x, topLeft.y, w * cell, h * cell)
    ctx.setLineDash([])
  }
}

function isoProject(
  gx: number,
  gy: number,
  gz: number,
  cell: number,
  originX: number,
  originY: number,
): { x: number; y: number } {
  // 2:1 アイソメトリック（上から斜めに見下ろすドールハウス視点）
  const sx = (gx - gy) * cell * 0.5
  const sy = (gx + gy) * cell * 0.25 - gz * cell * 0.5
  return { x: originX + sx, y: originY + sy }
}

function isoDepth(gx: number, gy: number, gz = 0): number {
  return gx + gy - gz * 0.01
}

function drawIsoQuad(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  fill: string,
  stroke?: string,
): void {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

function shadeColor(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + amount))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amount))
  return `rgb(${r},${g},${b})`
}

type IsoDrawable = { depth: number; draw: () => void }

function isoCorners(
  points: { gx: number; gy: number; gz: number }[],
  cell: number,
  ox: number,
  oy: number,
): { x: number; y: number }[] {
  return points.map((p) => isoProject(p.gx, p.gy, p.gz, cell, ox, oy))
}

function getPlanBounds(plan: FloorPlan): { minX: number; minY: number; maxX: number; maxY: number } {
  if (plan.rooms.length === 0) {
    return { minX: 1, minY: 1, maxX: GRID_COLS - 1, maxY: GRID_ROWS - 1 }
  }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const r of plan.rooms) {
    minX = Math.min(minX, r.x)
    minY = Math.min(minY, r.y)
    maxX = Math.max(maxX, r.x + r.w)
    maxY = Math.max(maxY, r.y + r.h)
  }
  return { minX: minX - 0.5, minY: minY - 0.5, maxX: maxX + 0.5, maxY: maxY + 0.5 }
}

function pushBox(
  items: IsoDrawable[],
  x: number,
  y: number,
  w: number,
  h: number,
  height: number,
  color: string,
  cell: number,
  ox: number,
  oy: number,
  ctx: CanvasRenderingContext2D,
): void {
  const faces: { corners: { gx: number; gy: number; gz: number }[]; shade: number }[] = [
    {
      corners: [
        { gx: x, gy: y, gz: height },
        { gx: x + w, gy: y, gz: height },
        { gx: x + w, gy: y + h, gz: height },
        { gx: x, gy: y + h, gz: height },
      ],
      shade: 20,
    },
    {
      corners: [
        { gx: x, gy: y + h, gz: 0 },
        { gx: x + w, gy: y + h, gz: 0 },
        { gx: x + w, gy: y + h, gz: height },
        { gx: x, gy: y + h, gz: height },
      ],
      shade: -30,
    },
    {
      corners: [
        { gx: x + w, gy: y, gz: 0 },
        { gx: x + w, gy: y + h, gz: 0 },
        { gx: x + w, gy: y + h, gz: height },
        { gx: x + w, gy: y, gz: height },
      ],
      shade: -45,
    },
    {
      corners: [
        { gx: x, gy: y, gz: 0 },
        { gx: x, gy: y + h, gz: 0 },
        { gx: x, gy: y + h, gz: height },
        { gx: x, gy: y, gz: height },
      ],
      shade: -15,
    },
    {
      corners: [
        { gx: x, gy: y, gz: 0 },
        { gx: x + w, gy: y, gz: 0 },
        { gx: x + w, gy: y, gz: height },
        { gx: x, gy: y, gz: height },
      ],
      shade: -5,
    },
  ]

  for (const face of faces) {
    const depth = Math.max(...face.corners.map((c) => isoDepth(c.gx, c.gy, c.gz)))
    const screen = isoCorners(face.corners, cell, ox, oy)
    const fill = shadeColor(color, face.shade)
    items.push({
      depth,
      draw: () => drawIsoQuad(ctx, screen, fill, '#3d2817'),
    })
  }
}

export function drawFloorPlan3D(ctx: CanvasRenderingContext2D, plan: FloorPlan): void {
  const { width, height } = ctx.canvas
  const bounds = getPlanBounds(plan)
  const spanX = bounds.maxX - bounds.minX
  const spanY = bounds.maxY - bounds.minY
  const cell = Math.min(width / (spanX + spanY + 2), height / ((spanX + spanY) * 0.25 + WALL_HEIGHT + 4))

  const centerGx = (bounds.minX + bounds.maxX) / 2
  const centerGy = (bounds.minY + bounds.maxY) / 2
  const centerScreen = isoProject(centerGx, centerGy, 0, cell, 0, 0)
  const originX = width / 2 - centerScreen.x
  const originY = height * 0.55 - centerScreen.y

  ctx.fillStyle = '#dff0d8'
  ctx.fillRect(0, 0, width, height)

  const items: IsoDrawable[] = []

  const ground = [
    { gx: bounds.minX, gy: bounds.minY, gz: 0 },
    { gx: bounds.maxX, gy: bounds.minY, gz: 0 },
    { gx: bounds.maxX, gy: bounds.maxY, gz: 0 },
    { gx: bounds.minX, gy: bounds.maxY, gz: 0 },
  ]
  const groundDepth = Math.min(...ground.map((c) => isoDepth(c.gx, c.gy)))
  items.push({
    depth: groundDepth - 1,
    draw: () =>
      drawIsoQuad(ctx, isoCorners(ground, cell, originX, originY), '#c8e0b8', '#8ab878'),
  })

  for (const room of plan.rooms) {
    const { x, y, w, h, floorColor, wallColor } = room
    const wh = WALL_HEIGHT

    const floorCorners = [
      { gx: x, gy: y, gz: 0 },
      { gx: x + w, gy: y, gz: 0 },
      { gx: x + w, gy: y + h, gz: 0 },
      { gx: x, gy: y + h, gz: 0 },
    ]
    items.push({
      depth: isoDepth(x + w / 2, y + h / 2),
      draw: () =>
        drawIsoQuad(ctx, isoCorners(floorCorners, cell, originX, originY), floorColor, '#6f4a2a'),
    })

    const walls: { x1: number; y1: number; x2: number; y2: number; shade: number }[] = [
      { x1: x, y1: y, x2: x + w, y2: y, shade: -10 },
      { x1: x, y1: y + h, x2: x + w, y2: y + h, shade: -35 },
      { x1: x, y1: y, x2: x, y2: y + h, shade: -20 },
      { x1: x + w, y1: y, x2: x + w, y2: y + h, shade: -45 },
    ]

    for (const wall of walls) {
      const corners = [
        { gx: wall.x1, gy: wall.y1, gz: 0 },
        { gx: wall.x2, gy: wall.y2, gz: 0 },
        { gx: wall.x2, gy: wall.y2, gz: wh },
        { gx: wall.x1, gy: wall.y1, gz: wh },
      ]
      const depth = Math.max(...corners.map((c) => isoDepth(c.gx, c.gy, c.gz)))
      const screen = isoCorners(corners, cell, originX, originY)
      const fill = shadeColor(wallColor, wall.shade)
      items.push({
        depth,
        draw: () => drawIsoQuad(ctx, screen, fill, '#6f4a2a'),
      })
    }
  }

  for (const item of plan.furniture) {
    const preset = FURNITURE_PRESETS[item.kind]
    pushBox(items, item.x, item.y, item.w, item.h, preset.height, preset.color, cell, originX, originY, ctx)
  }

  items.sort((a, b) => a.depth - b.depth)
  for (const item of items) item.draw()

  ctx.fillStyle = '#6f4a2a'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('3Dプレビュー（上から見下ろすドールハウス視点）', width / 2, height - 16)
}
