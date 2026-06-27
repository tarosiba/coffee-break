import { useEffect, useRef, useState } from 'react'
import {
  HEIGHT,
  WIDTH,
  createGameState,
  difficultyLabel,
  drawField,
  startGame,
  updateGame,
  type SoccerDifficulty,
  type SoccerInput,
  type SoccerState,
} from '../../lib/soccer'

const JOYSTICK_RADIUS = 52

export function SoccerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<SoccerState>(createGameState())
  const inputRef = useRef<SoccerInput>({ dx: 0, dy: 0, pass: false, shoot: false })
  const difficultyRef = useRef<SoccerDifficulty>('intermediate')
  const joystickRef = useRef({ active: false, cx: 0, cy: 0, dx: 0, dy: 0 })
  const passHeldRef = useRef(false)
  const shootHeldRef = useRef(false)
  const [, setJoyTick] = useState(0)

  const [difficulty, setDifficulty] = useState<SoccerDifficulty>('intermediate')
  const [hud, setHud] = useState({ red: 0, blue: 0, time: '02:00' })
  const [joyVisual, setJoyVisual] = useState({ dx: 0, dy: 0, active: false })

  const resetGame = () => {
    stateRef.current = createGameState()
    inputRef.current = { dx: 0, dy: 0, pass: false, shoot: false }
    joystickRef.current = { active: false, cx: 0, cy: 0, dx: 0, dy: 0 }
    setJoyVisual({ dx: 0, dy: 0, active: false })
    setHud({ red: 0, blue: 0, time: '02:00' })
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
      const joy = joystickRef.current
      inputRef.current = {
        dx: joy.dx,
        dy: joy.dy,
        pass: inputRef.current.pass,
        shoot: inputRef.current.shoot,
      }

      stateRef.current = updateGame(stateRef.current, inputRef.current, difficultyRef.current)
      inputRef.current.pass = false
      inputRef.current.shoot = false

      drawField(ctx, stateRef.current)

      const mins = Math.floor(stateRef.current.timeLeft / 60)
      const secs = Math.floor(stateRef.current.timeLeft % 60)
      setHud({
        red: stateRef.current.redScore,
        blue: stateRef.current.blueScore,
        time: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleCanvasStart = () => {
    const phase = stateRef.current.phase
    if (phase === 'title' || phase === 'gameover') {
      stateRef.current = startGame()
    }
  }

  const updateJoystick = (clientX: number, clientY: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const joy = joystickRef.current
    if (!joy.active) return

    const x = clientX - rect.left
    const y = clientY - rect.top
    const dx = x - joy.cx
    const dy = y - joy.cy
    const dist = Math.hypot(dx, dy)
    const max = JOYSTICK_RADIUS

    if (dist > max) {
      joy.dx = dx / dist
      joy.dy = dy / dist
    } else if (dist > 4) {
      joy.dx = dx / max
      joy.dy = dy / max
    } else {
      joy.dx = 0
      joy.dy = 0
    }
    setJoyVisual({ dx: joy.dx, dy: joy.dy, active: true })
    setJoyTick((n) => n + 1)
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
            ? '初級 — CPUがゆっくり。気軽に試合できる相手です'
            : '中級 — ボールを追いかけて攻めてくる相手（本気寄り）'}
        </p>
      </div>

      <p className="text-center text-sm text-coffee-600">
        あなた {hud.red} - {hud.blue} CPU（{level}） · {hud.time}
      </p>

      <div className="relative mx-auto w-fit">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block max-w-full rounded-xl border-2 border-coffee-600 shadow-lg touch-none"
          onPointerDown={() => {
            handleCanvasStart()
          }}
        />

        <div
          className="absolute bottom-4 left-2 h-32 w-32 touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            const rect = e.currentTarget.getBoundingClientRect()
            joystickRef.current = {
              active: true,
              cx: e.clientX - rect.left,
              cy: e.clientY - rect.top,
              dx: 0,
              dy: 0,
            }
            setJoyVisual({ dx: 0, dy: 0, active: true })
          }}
          onPointerMove={(e) => {
            updateJoystick(e.clientX, e.clientY, e.currentTarget)
          }}
          onPointerUp={() => {
            joystickRef.current = { active: false, cx: 0, cy: 0, dx: 0, dy: 0 }
            setJoyVisual({ dx: 0, dy: 0, active: false })
          }}
          onPointerCancel={() => {
            joystickRef.current = { active: false, cx: 0, cy: 0, dx: 0, dy: 0 }
            setJoyVisual({ dx: 0, dy: 0, active: false })
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-full border-2 border-white/40 bg-black/25" />
            {joyVisual.active && (
              <div
                className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-white/35"
                style={{
                  left: `${50 + joyVisual.dx * 40}%`,
                  top: `${50 + joyVisual.dy * 40}%`,
                }}
              />
            )}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium text-white/70">
              移動
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-2 flex flex-col gap-3 touch-none">
          <button
            type="button"
            className="touch-target flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/50 bg-blue-600/80 text-sm font-bold text-white shadow-lg active:scale-95"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              if (!passHeldRef.current) {
                passHeldRef.current = true
                inputRef.current.pass = true
              }
            }}
            onPointerUp={() => {
              passHeldRef.current = false
            }}
          >
            パス
          </button>
          <button
            type="button"
            className="touch-target flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/50 bg-red-600/85 text-sm font-bold text-white shadow-lg active:scale-95"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              if (!shootHeldRef.current) {
                shootHeldRef.current = true
                inputRef.current.shoot = true
              }
            }}
            onPointerUp={() => {
              shootHeldRef.current = false
            }}
          >
            シュート
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-coffee-500">
        ピクセルサッカー — 4対4・2分試合。ボールに近い選手が自動選択されます。上のゴールを目指そう！
      </p>
    </div>
  )
}
