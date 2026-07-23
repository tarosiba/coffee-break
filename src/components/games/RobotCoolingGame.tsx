import { useEffect, useRef, useState } from 'react'
import {
  WIDTH,
  HEIGHT,
  createGameState,
  difficultyLabel,
  drawScene,
  findItemAt,
  startGame,
  tapItem,
  updateGame,
  type CoolingDifficulty,
  type RobotCoolingState,
} from '../../lib/robotCooling'

function canvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}

export function RobotCoolingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<RobotCoolingState>(createGameState())
  const difficultyRef = useRef<CoolingDifficulty>('beginner')
  const [difficulty, setDifficulty] = useState<CoolingDifficulty>('beginner')
  const [hud, setHud] = useState({
    temperature: 52,
    comfortSeconds: 0,
    elapsed: 0,
    goalSeconds: 75,
    message: '',
    highComfort: 0,
    phase: 'title' as const,
  })

  useEffect(() => {
    difficultyRef.current = difficulty
    stateRef.current = createGameState(difficulty)
  }, [difficulty])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      stateRef.current = updateGame(stateRef.current, dt)
      drawScene(ctx, stateRef.current)
      const state = stateRef.current
      setHud({
        temperature: state.temperature,
        comfortSeconds: state.comfortSeconds,
        elapsed: state.elapsed,
        goalSeconds: state.goalSeconds,
        message: state.message,
        highComfort: state.highComfort,
        phase: state.phase,
      })
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const handlePointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const point = canvasPoint(canvas, clientX, clientY)
    const state = stateRef.current

    if (state.phase === 'title') {
      stateRef.current = startGame(difficultyRef.current)
      return
    }
    if (state.phase === 'overheat' || state.phase === 'cleared') {
      stateRef.current = startGame(difficultyRef.current)
      return
    }

    const itemId = findItemAt(state, point.x, point.y)
    if (itemId != null) {
      stateRef.current = tapItem(state, itemId)
    }
  }

  const remaining = Math.max(0, Math.ceil(hud.goalSeconds - hud.elapsed))
  const level = difficultyLabel(difficulty)

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-coffee-200 bg-white/70 p-3">
        <p className="mb-2 text-center text-sm font-medium text-coffee-700">難易度を選んでください</p>
        <div className="flex justify-center gap-2">
          {(['beginner', 'intermediate'] as const).map((levelOption) => (
            <button
              key={levelOption}
              type="button"
              onClick={() => setDifficulty(levelOption)}
              className={`touch-target rounded-xl px-4 py-2 text-sm font-medium transition ${
                difficulty === levelOption
                  ? 'bg-coffee-600 text-cream'
                  : 'border border-coffee-300 bg-white text-coffee-700 hover:border-coffee-400'
              }`}
            >
              {difficultyLabel(levelOption)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-coffee-600">
        マンガ「熱暴走するロボット君」の続き。{level}で {hud.goalSeconds} 秒、のんびり涼まそう。
      </p>

      <div className="flex justify-center gap-4 text-sm text-coffee-600">
        <span>残り {remaining} 秒</span>
        <span>快適 {Math.floor(hud.comfortSeconds)} 秒</span>
        <span>最高 {hud.highComfort} 秒</span>
      </div>

      {hud.message && hud.phase === 'playing' && (
        <p className="text-center text-sm text-coffee-700">{hud.message}</p>
      )}

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="max-w-full touch-none rounded-2xl border border-coffee-200 shadow-sm"
          style={{ width: '100%', maxWidth: WIDTH }}
          onPointerDown={(event) => {
            event.preventDefault()
            handlePointer(event.clientX, event.clientY)
          }}
        />
      </div>

      <p className="text-center text-xs text-coffee-500">
        🌬️🧊☂️🥤 で冷やす。☀️ はタップして避ける。体温が 100℃ で休憩タイム。
      </p>
    </div>
  )
}
