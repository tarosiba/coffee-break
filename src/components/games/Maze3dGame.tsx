import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createMazeGame,
  drawMaze3D,
  HEIGHT,
  type MazeGameState,
  type MazeMode,
  type MazeSize,
  type PlayerInput,
  type TextureTheme,
  turnMaze90,
  updateMazeGame,
  WIDTH,
} from '../../lib/maze3d'

type Phase = 'menu' | 'playing' | 'won' | 'gameover'

const MODES: { id: MazeMode; label: string; desc: string }[] = [
  { id: 'classic', label: 'ふつう', desc: 'ゴールを目指すだけ' },
  { id: 'dungeon', label: 'ダンジョンRPG', desc: '宝箱とスケルトンが出現' },
]

const SIZES: { id: MazeSize; label: string }[] = [
  { id: 'small', label: '小' },
  { id: 'medium', label: '中' },
  { id: 'large', label: '大' },
]

const THEMES: { id: TextureTheme; label: string; desc: string }[] = [
  { id: 'classic', label: 'クラシック', desc: '赤レンガ（Win95風）' },
  { id: 'cosmic', label: 'コズミック', desc: '宇宙テクスチャ（OpenGL版風）' },
  { id: 'garden', label: 'ガーデン', desc: '屋外迷路風' },
]

export function Maze3dGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<MazeGameState | null>(null)
  const inputRef = useRef<PlayerInput>({
    forward: false,
    backward: false,
  })
  const lastTimeRef = useRef(0)

  const [phase, setPhase] = useState<Phase>('menu')
  const [size, setSize] = useState<MazeSize>('medium')
  const [theme, setTheme] = useState<TextureTheme>('classic')
  const [mode, setMode] = useState<MazeMode>('dungeon')
  const [steps, setSteps] = useState(0)
  const [treasures, setTreasures] = useState(0)
  const [hp, setHp] = useState(3)

  const startGame = useCallback(() => {
    const state = createMazeGame(size, theme, mode)
    stateRef.current = state
    setSteps(0)
    setTreasures(0)
    setHp(state.maxHp)
    setPhase('playing')
  }, [size, theme, mode])

  const handleTurn90 = useCallback((left: boolean) => {
    if (!stateRef.current || stateRef.current.won || stateRef.current.gameOver) return
    stateRef.current = turnMaze90(stateRef.current, left)
  }, [])

  const setInput = useCallback((key: keyof PlayerInput, value: boolean) => {
    inputRef.current[key] = value
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    const loop = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.05) : 0.016
      lastTimeRef.current = time

      if (stateRef.current && !stateRef.current.won && !stateRef.current.gameOver) {
        stateRef.current = updateMazeGame(stateRef.current, inputRef.current, dt)
        setSteps(stateRef.current.steps)
        setTreasures(stateRef.current.treasures)
        setHp(stateRef.current.hp)
        if (stateRef.current.won) {
          setPhase('won')
        } else if (stateRef.current.gameOver) {
          setPhase('gameover')
        }
      }

      if (stateRef.current) {
        drawMaze3D(ctx, stateRef.current)
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.floor(Math.min(rect.width, WIDTH))
      const h = Math.floor(w * (HEIGHT / WIDTH))
      canvas.width = w
      canvas.height = h
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [phase])

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (phase !== 'playing') return
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          inputRef.current.forward = down
          e.preventDefault()
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          inputRef.current.backward = down
          e.preventDefault()
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (down && !e.repeat) handleTurn90(true)
          e.preventDefault()
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (down && !e.repeat) handleTurn90(false)
          e.preventDefault()
          break
      }
    }

    const down = (e: KeyboardEvent) => onKey(e, true)
    const up = (e: KeyboardEvent) => onKey(e, false)

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [phase, handleTurn90])

  if (phase === 'menu') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-coffee-600">
          Windows の「3D 迷路」スクリーンセーバー風。ダンジョンRPGモードでは宝箱とスケルトンが出現します。
        </p>

        <div>
          <p className="mb-2 text-sm font-medium text-coffee-700">モード</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`touch-target rounded-xl border p-3 text-left ${
                  mode === m.id ? 'border-coffee-600 bg-coffee-50 ring-2 ring-coffee-400' : 'border-coffee-200 bg-white'
                }`}
              >
                <span className="block font-medium text-coffee-800">{m.label}</span>
                <span className="text-xs text-coffee-500">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-coffee-700">迷路の大きさ</p>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSize(s.id)}
                className={`touch-target rounded-lg px-5 py-2 text-sm font-medium ${
                  size === s.id ? 'bg-coffee-600 text-cream' : 'bg-coffee-100 text-coffee-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-coffee-700">テクスチャ</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`touch-target rounded-xl border p-3 text-left ${
                  theme === t.id ? 'border-coffee-600 bg-coffee-50 ring-2 ring-coffee-400' : 'border-coffee-200 bg-white'
                }`}
              >
                <span className="block font-medium text-coffee-800">{t.label}</span>
                <span className="text-xs text-coffee-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={startGame}
          className="touch-target w-full rounded-xl bg-coffee-600 py-3 text-lg font-semibold text-cream"
        >
          迷路に入る 🧱
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-coffee-600">
        <span>歩数: {steps}</span>
        {mode === 'dungeon' && (
          <span>
            HP {'❤️'.repeat(hp)}{'🖤'.repeat(3 - hp)} / 📦 {treasures}
          </span>
        )}
        <span className="text-xs">左上にミニマップ</span>
      </div>

      <div
        ref={containerRef}
        className="mx-auto overflow-hidden rounded-xl border-2 border-coffee-200 bg-black shadow-inner"
        style={{ maxWidth: WIDTH }}
      >
        <canvas ref={canvasRef} className="block touch-none" aria-label="3D迷路" />
      </div>

      {phase === 'won' && (
        <div
          className="rounded-xl border border-coffee-300 bg-coffee-50 p-4 text-center"
          role="alert"
        >
          <p className="mb-1 text-2xl">🎉 ゴール！</p>
          <p className="mb-3 text-sm text-coffee-600">
            歩数 {steps} 歩で脱出
            {mode === 'dungeon' && `・宝箱 ${treasures} 個・残りHP ${hp}`}
          </p>
          <button
            type="button"
            onClick={() => setPhase('menu')}
            className="touch-target rounded-lg bg-coffee-600 px-6 py-2 text-sm font-medium text-cream"
          >
            もう一度
          </button>
        </div>
      )}

      {phase === 'gameover' && (
        <div
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-center"
          role="alert"
        >
          <p className="mb-1 text-2xl">💀 ゲームオーバー</p>
          <p className="mb-3 text-sm text-coffee-600">
            スケルトンにやられてしまった… 宝箱 {treasures} 個・歩数 {steps}
          </p>
          <button
            type="button"
            onClick={() => setPhase('menu')}
            className="touch-target rounded-lg bg-coffee-600 px-6 py-2 text-sm font-medium text-cream"
          >
            もう一度
          </button>
        </div>
      )}

      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        <div />
        <ControlButton
          label="↑"
          ariaLabel="前進"
          onPress={() => setInput('forward', true)}
          onRelease={() => setInput('forward', false)}
        />
        <div />
        <TapButton label="↺90°" ariaLabel="左に90度曲がる" onTap={() => handleTurn90(true)} />
        <ControlButton
          label="↓"
          ariaLabel="後退"
          onPress={() => setInput('backward', true)}
          onRelease={() => setInput('backward', false)}
        />
        <TapButton label="90°↻" ariaLabel="右に90度曲がる" onTap={() => handleTurn90(false)} />
      </div>

      <p className="text-center text-xs text-coffee-500">
        前後: 長押し / 曲がる: 90度ボタンをタップ（キーボードは矢印左右）
      </p>

      <button
        type="button"
        onClick={() => setPhase('menu')}
        className="touch-target w-full rounded-lg bg-coffee-100 py-2 text-sm text-coffee-600"
      >
        メニューに戻る
      </button>
    </div>
  )
}

function TapButton({
  label,
  ariaLabel,
  onTap,
}: {
  label: string
  ariaLabel: string
  onTap: () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="touch-target select-none rounded-xl border-2 border-coffee-400 bg-coffee-100 py-3 text-sm font-bold text-coffee-800 active:bg-coffee-300"
      onPointerDown={(e) => {
        e.preventDefault()
        onTap()
      }}
    >
      {label}
    </button>
  )
}

function ControlButton({
  label,
  ariaLabel,
  onPress,
  onRelease,
}: {
  label: string
  ariaLabel: string
  onPress: () => void
  onRelease: () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="touch-target select-none rounded-xl border border-coffee-300 bg-coffee-50 py-4 text-2xl font-bold text-coffee-700 active:bg-coffee-200"
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerUp={(e) => {
        onRelease()
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
      onPointerCancel={(e) => {
        onRelease()
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
      onPointerLeave={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) return
        onRelease()
      }}
    >
      {label}
    </button>
  )
}
