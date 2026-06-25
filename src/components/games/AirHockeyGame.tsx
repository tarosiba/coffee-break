import { useEffect, useRef, useState } from 'react'
import {
  HEIGHT,
  WIDTH,
  createGameState,
  drawTable,
  startGame,
  updateGame,
  type AirHockeyState,
  type PointerInput,
} from '../../lib/airHockey'

function canvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}

export function AirHockeyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<AirHockeyState>(createGameState())
  const inputRef = useRef<PointerInput>({ x: WIDTH / 2, y: HEIGHT - 70, active: false })
  const [hud, setHud] = useState({ player: 0, cpu: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const loop = () => {
      stateRef.current = updateGame(stateRef.current, inputRef.current)
      drawTable(ctx, stateRef.current)
      setHud({
        player: stateRef.current.playerScore,
        cpu: stateRef.current.cpuScore,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const updatePointer = (clientX: number, clientY: number, active: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const point = canvasPoint(canvas, clientX, clientY)
    inputRef.current = { ...point, active }
  }

  const handleStart = (clientX: number, clientY: number) => {
    const phase = stateRef.current.phase
    if (phase === 'title' || phase === 'gameover') {
      stateRef.current = startGame()
      updatePointer(clientX, clientY, true)
      return
    }
    updatePointer(clientX, clientY, true)
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-coffee-600">
        あなた {hud.player} 点 · CPU {hud.cpu} 点（先に5点）
      </p>

      <div className="mx-auto w-fit overflow-hidden rounded-xl border-2 border-coffee-600 shadow-lg">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block max-w-full touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            handleStart(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => {
            if (inputRef.current.active || stateRef.current.phase === 'playing') {
              updatePointer(e.clientX, e.clientY, true)
            }
          }}
          onPointerUp={() => {
            inputRef.current = { ...inputRef.current, active: false }
          }}
          onPointerLeave={() => {
            inputRef.current = { ...inputRef.current, active: false }
          }}
        />
      </div>

      <p className="text-center text-xs text-coffee-500">
        エアホッケー — 素早くドラッグしてパックを打ち返そう。勢いよく当てると速く飛びます。
      </p>
    </div>
  )
}
