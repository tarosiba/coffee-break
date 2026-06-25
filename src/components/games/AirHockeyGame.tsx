import { useEffect, useRef, useState } from 'react'
import {
  HEIGHT,
  WIDTH,
  createGameState,
  difficultyLabel,
  drawTable,
  startGame,
  updateGame,
  type AirHockeyDifficulty,
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
  const difficultyRef = useRef<AirHockeyDifficulty>('intermediate')
  const [difficulty, setDifficulty] = useState<AirHockeyDifficulty>('intermediate')
  const [hud, setHud] = useState({ player: 0, cpu: 0 })

  const resetGame = () => {
    stateRef.current = createGameState()
    inputRef.current = { x: WIDTH / 2, y: HEIGHT - 70, active: false }
    setHud({ player: 0, cpu: 0 })
  }

  useEffect(() => {
    difficultyRef.current = difficulty
  }, [difficulty])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const loop = () => {
      stateRef.current = updateGame(stateRef.current, inputRef.current, difficultyRef.current)
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
              onClick={() => {
                setDifficulty(levelOption)
                resetGame()
              }}
              className={`touch-target rounded-xl px-4 py-2 text-sm font-medium transition ${
                difficulty === levelOption
                  ? 'bg-coffee-600 text-cream'
                  : 'border border-coffee-300 bg-white text-coffee-700 hover:border-coffee-400'
              }`}
            >
              {levelOption === 'beginner' ? '初級' : '中級'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-coffee-500">
          {difficulty === 'beginner'
            ? '初級 — 反応がゆっくり。気軽に打ち合える相手です'
            : '中級 — パックを追いかけて打ち返す相手（本気寄り）'}
        </p>
      </div>

      <p className="text-center text-sm text-coffee-600">
        あなた {hud.player} 点 · CPU（{level}） {hud.cpu} 点（先に5点）
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
