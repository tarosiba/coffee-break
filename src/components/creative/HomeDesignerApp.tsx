import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addFurniture,
  addRoom,
  applyFloorColor,
  applyWallColor,
  canvasToGrid,
  clonePlan,
  drawFloorPlan2D,
  drawFloorPlan3D,
  FLOOR_COLORS,
  FURNITURE_KINDS,
  FURNITURE_PRESETS,
  removeAt,
  type DesignerTool,
  type FloorPlan,
  type FurnitureKind,
  WALL_COLORS,
} from '../../lib/homeDesigner'
import { loadFloorPlan, saveFloorPlan } from '../../lib/homeDesignerStorage'
import { downloadCanvas } from '../../lib/imageFilters'

type ViewMode = '2d' | '3d'

const TOOLS: { id: DesignerTool; label: string; icon: string }[] = [
  { id: 'room', label: '部屋', icon: '▢' },
  { id: 'furniture', label: '家具', icon: '🪑' },
  { id: 'wallpaper', label: '壁紙', icon: '🎨' },
  { id: 'floor', label: '床', icon: '🟫' },
  { id: 'erase', label: '消す', icon: '🗑' },
]

const MAX_HISTORY = 30

export function HomeDesignerApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const historyRef = useRef<FloorPlan[]>([])
  const historyIndexRef = useRef(0)

  const [plan, setPlan] = useState<FloorPlan>(() => loadFloorPlan())
  const [tool, setTool] = useState<DesignerTool>('room')
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [furnitureKind, setFurnitureKind] = useState<FurnitureKind>('sofa')
  const [wallColor, setWallColor] = useState<string>(WALL_COLORS[0].color)
  const [floorColor, setFloorColor] = useState<string>(FLOOR_COLORS[0].color)
  const [preview, setPreview] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [saved, setSaved] = useState(false)

  const syncHistoryState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const pushHistory = useCallback(
    (next: FloorPlan) => {
      const snapshot = clonePlan(next)
      const stack = historyRef.current.slice(0, historyIndexRef.current + 1)
      stack.push(snapshot)
      if (stack.length > MAX_HISTORY) stack.shift()
      historyRef.current = stack
      historyIndexRef.current = stack.length - 1
      syncHistoryState()
      setPlan(snapshot)
      setSaved(false)
    },
    [syncHistoryState],
  )

  useEffect(() => {
    historyRef.current = [clonePlan(plan)]
    historyIndexRef.current = 0
    syncHistoryState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    if (viewMode === '2d') {
      drawFloorPlan2D(ctx, plan, preview)
    } else {
      drawFloorPlan3D(ctx, plan)
    }
  }, [plan, preview, viewMode])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.min(420, Math.floor(rect.width * 0.85))

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    redraw()
  }, [redraw])

  useEffect(() => {
    resizeCanvas()
    const observer = new ResizeObserver(resizeCanvas)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [resizeCanvas])

  useEffect(() => {
    redraw()
  }, [redraw])

  const applyPlan = useCallback(
    (updater: (current: FloorPlan) => FloorPlan) => {
      pushHistory(updater(plan))
    },
    [plan, pushHistory],
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (viewMode === '3d') return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const { x, y } = canvasToGrid(px, py, canvas.width, canvas.height)

    if (tool === 'room') {
      dragStartRef.current = { x, y }
      setPreview({ x1: x, y1: y, x2: x, y2: y })
      canvas.setPointerCapture(e.pointerId)
      return
    }

    if (tool === 'furniture') {
      applyPlan((p) => addFurniture(p, furnitureKind, x, y))
      return
    }

    if (tool === 'wallpaper') {
      const room = plan.rooms.find((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h)
      if (room) applyPlan((p) => applyWallColor(p, room.id, wallColor))
      return
    }

    if (tool === 'floor') {
      const room = plan.rooms.find((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h)
      if (room) applyPlan((p) => applyFloorColor(p, room.id, floorColor))
      return
    }

    if (tool === 'erase') {
      applyPlan((p) => removeAt(p, x, y))
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (viewMode === '3d' || tool !== 'room' || !dragStartRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const { x, y } = canvasToGrid(px, py, canvas.width, canvas.height)
    setPreview({
      x1: dragStartRef.current.x,
      y1: dragStartRef.current.y,
      x2: x,
      y2: y,
    })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool !== 'room' || !dragStartRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const { x, y } = canvasToGrid(px, py, canvas.width, canvas.height)
    const start = dragStartRef.current

    applyPlan((p) => addRoom(p, start.x, start.y, x, y))
    dragStartRef.current = null
    setPreview(null)
    canvas.releasePointerCapture(e.pointerId)
  }

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    setPlan(clonePlan(historyRef.current[historyIndexRef.current]))
    syncHistoryState()
    setSaved(false)
  }

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    setPlan(clonePlan(historyRef.current[historyIndexRef.current]))
    syncHistoryState()
    setSaved(false)
  }

  const handleSave = () => {
    saveFloorPlan(plan)
    setSaved(true)
  }

  const handleExportPng = () => {
    const canvas = canvasRef.current
    if (canvas) downloadCanvas(canvas, `floor-plan-${viewMode}`)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-coffee-600">
        部屋をドラッグで配置し、家具・壁紙・床を選んで、3Dでイメージを確認できます。データは端末内に保存されます。
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setViewMode('2d')}
          className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition ${
            viewMode === '2d' ? 'bg-coffee-600 text-cream' : 'bg-coffee-100 text-coffee-700'
          }`}
        >
          2D 平面図
        </button>
        <button
          type="button"
          onClick={() => setViewMode('3d')}
          className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition ${
            viewMode === '3d' ? 'bg-coffee-600 text-cream' : 'bg-coffee-100 text-coffee-700'
          }`}
        >
          3D 表示
        </button>
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border-2 border-coffee-200 bg-white shadow-inner"
      >
        <canvas
          ref={canvasRef}
          className={`block w-full touch-none ${viewMode === '2d' ? 'cursor-crosshair' : 'cursor-default'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label={viewMode === '2d' ? '間取り平面図キャンバス' : '間取り3Dプレビュー'}
        />
      </div>

      {viewMode === '2d' && (
        <>
          <div className="flex flex-wrap justify-center gap-1 rounded-xl bg-coffee-50 p-2">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTool(t.id)}
                className={`touch-target flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-xs font-medium transition ${
                  tool === t.id ? 'bg-coffee-600 text-cream' : 'bg-white text-coffee-700'
                }`}
              >
                <span className="text-lg" aria-hidden>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {tool === 'furniture' && (
            <div className="flex flex-wrap gap-2">
              {FURNITURE_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setFurnitureKind(kind)}
                  className={`touch-target rounded-lg px-3 py-2 text-sm transition ${
                    furnitureKind === kind
                      ? 'bg-coffee-600 text-cream'
                      : 'bg-coffee-100 text-coffee-700'
                  }`}
                >
                  {FURNITURE_PRESETS[kind].emoji} {FURNITURE_PRESETS[kind].label}
                </button>
              ))}
            </div>
          )}

          {tool === 'wallpaper' && (
            <div className="flex flex-wrap gap-2">
              {WALL_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setWallColor(c.color)}
                  className={`touch-target flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    wallColor === c.color ? 'border-coffee-600 ring-2 ring-coffee-400' : 'border-coffee-200'
                  }`}
                >
                  <span
                    className="inline-block h-5 w-5 rounded border border-coffee-300"
                    style={{ backgroundColor: c.color }}
                    aria-hidden
                  />
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {tool === 'floor' && (
            <div className="flex flex-wrap gap-2">
              {FLOOR_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFloorColor(c.color)}
                  className={`touch-target flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    floorColor === c.color ? 'border-coffee-600 ring-2 ring-coffee-400' : 'border-coffee-200'
                  }`}
                >
                  <span
                    className="inline-block h-5 w-5 rounded border border-coffee-300"
                    style={{ backgroundColor: c.color }}
                    aria-hidden
                  />
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-coffee-500">
            {tool === 'room' && 'ドラッグして部屋の範囲を指定'}
            {tool === 'furniture' && '部屋の中をタップして家具を配置'}
            {tool === 'wallpaper' && '部屋をタップして壁紙の色を変更'}
            {tool === 'floor' && '部屋をタップして床の色を変更'}
            {tool === 'erase' && '部屋や家具をタップして削除'}
          </p>
        </>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="touch-target rounded-lg bg-coffee-100 px-4 py-2 text-sm font-medium text-coffee-700 disabled:opacity-40"
        >
          元に戻す
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className="touch-target rounded-lg bg-coffee-100 px-4 py-2 text-sm font-medium text-coffee-700 disabled:opacity-40"
        >
          やり直す
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="touch-target rounded-lg bg-coffee-600 px-4 py-2 text-sm font-medium text-cream"
        >
          保存
        </button>
        <button
          type="button"
          onClick={handleExportPng}
          className="touch-target rounded-lg bg-coffee-100 px-4 py-2 text-sm font-medium text-coffee-700"
        >
          画像で保存
        </button>
        {saved && (
          <span className="self-center text-sm text-coffee-500" role="status">
            保存しました
          </span>
        )}
      </div>
    </div>
  )
}
