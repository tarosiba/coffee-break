import { useCallback, useEffect, useRef, useState } from 'react'
import { downloadCanvas } from '../../lib/imageFilters'

const COLORS = ['#2a1b0f', '#6f4a2a', '#8b5e34', '#c9a97a', '#3d2817', '#1a1a1a', '#ffffff', '#b08852']
const MAX_HISTORY = 30

type Tool = 'pen' | 'eraser'

export function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const drawingRef = useRef(false)
  const historyRef = useRef<ImageData[]>([])
  const historyIndexRef = useRef(-1)

  const [color, setColor] = useState(COLORS[0])
  const [brushSize, setBrushSize] = useState(4)
  const [tool, setTool] = useState<Tool>('pen')
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const syncHistoryState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const next = historyRef.current.slice(0, historyIndexRef.current + 1)
    next.push(snapshot)
    if (next.length > MAX_HISTORY) next.shift()
    historyRef.current = next
    historyIndexRef.current = next.length - 1
    syncHistoryState()
  }, [syncHistoryState])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.min(480, Math.floor(rect.width * 0.75))

    if (canvas.width === width && canvas.height === height) return

    const ctx = canvas.getContext('2d')
    let previous: ImageData | null = null
    if (ctx && canvas.width > 0) {
      previous = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }

    canvas.width = width
    canvas.height = height
    if (!ctx) return

    ctx.fillStyle = '#fff8f0'
    ctx.fillRect(0, 0, width, height)

    if (previous) {
      const temp = document.createElement('canvas')
      temp.width = previous.width
      temp.height = previous.height
      temp.getContext('2d')?.putImageData(previous, 0, 0)
      ctx.drawImage(temp, 0, 0, width, height)
    } else {
      const snapshot = ctx.getImageData(0, 0, width, height)
      historyRef.current = [snapshot]
      historyIndexRef.current = 0
      syncHistoryState()
    }
  }, [syncHistoryState])

  useEffect(() => {
    resizeCanvas()
    const observer = new ResizeObserver(resizeCanvas)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [resizeCanvas])

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = brushSize
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
    }
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
  }

  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = true
    const point = getPoint(e)
    lastPointRef.current = point

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = brushSize
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = color
    }
    ctx.beginPath()
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastPointRef.current) return
    const point = getPoint(e)
    drawLine(lastPointRef.current, point)
    lastPointRef.current = point
  }

  const handlePointerUp = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    lastPointRef.current = null
    saveSnapshot()
  }

  const undo = () => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const snapshot = historyRef.current[historyIndexRef.current]
    if (canvas && ctx && snapshot) ctx.putImageData(snapshot, 0, 0)
    syncHistoryState()
  }

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const snapshot = historyRef.current[historyIndexRef.current]
    if (canvas && ctx && snapshot) ctx.putImageData(snapshot, 0, 0)
    syncHistoryState()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#fff8f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveSnapshot()
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    downloadCanvas(canvas, `coffee-break-drawing-${Date.now()}.png`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTool('pen')}
          className={`touch-target rounded-lg px-3 py-2 text-sm font-medium ${
            tool === 'pen' ? 'bg-coffee-600 text-cream' : 'bg-coffee-100 text-coffee-700'
          }`}
        >
          ✏️ ペン
        </button>
        <button
          type="button"
          onClick={() => setTool('eraser')}
          className={`touch-target rounded-lg px-3 py-2 text-sm font-medium ${
            tool === 'eraser' ? 'bg-coffee-600 text-cream' : 'bg-coffee-100 text-coffee-700'
          }`}
        >
          🧹 消しゴム
        </button>
        <label className="flex items-center gap-2 text-sm text-coffee-600">
          太さ
          <input
            type="range"
            min={1}
            max={24}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-6 text-center">{brushSize}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setColor(c)
              setTool('pen')
            }}
            className={`h-9 w-9 rounded-full border-2 ${
              color === c && tool === 'pen' ? 'border-coffee-600 ring-2 ring-coffee-300' : 'border-coffee-200'
            }`}
            style={{ backgroundColor: c }}
            aria-label={`色 ${c}`}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border-2 border-coffee-200 bg-white shadow-inner"
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="touch-target rounded-lg bg-coffee-100 px-3 py-2 text-sm text-coffee-700 disabled:opacity-40"
        >
          ↩ 元に戻す
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="touch-target rounded-lg bg-coffee-100 px-3 py-2 text-sm text-coffee-700 disabled:opacity-40"
        >
          ↪ やり直す
        </button>
        <button
          type="button"
          onClick={clearCanvas}
          className="touch-target rounded-lg bg-coffee-100 px-3 py-2 text-sm text-coffee-700"
        >
          🗑 クリア
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="touch-target rounded-lg bg-coffee-600 px-3 py-2 text-sm font-medium text-cream"
        >
          💾 PNG保存
        </button>
      </div>
    </div>
  )
}
