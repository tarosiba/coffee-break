import { useEffect, useRef, useState } from 'react'
import {
  ENEMY_COLORS,
  HEIGHT,
  WIDTH,
  createGameState,
  startGame,
  updateGame,
  type GameState,
} from '../../lib/galaxyShooter'

function drawStarfield(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  for (let i = 0; i < 40; i++) {
    const x = (i * 97 + tick * 0.2) % WIDTH
    const y = (i * 53) % HEIGHT
    ctx.fillStyle = i % 3 === 0 ? '#fff' : i % 3 === 1 ? '#f87171' : '#60a5fa'
    ctx.fillRect(x, y, 2, 2)
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number) {
  const y = HEIGHT - 50
  ctx.fillStyle = '#22d3ee'
  ctx.beginPath()
  ctx.moveTo(x, y - 14)
  ctx.lineTo(x - 16, y + 10)
  ctx.lineTo(x + 16, y + 10)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#ef4444'
  ctx.fillRect(x - 4, y - 8, 8, 10)
  ctx.fillStyle = '#fff'
  ctx.fillRect(x - 2, y + 4, 4, 6)
}

function drawEnemy(ctx: CanvasRenderingContext2D, type: keyof typeof ENEMY_COLORS, x: number, y: number) {
  const { body, wing } = ENEMY_COLORS[type]
  ctx.fillStyle = wing
  ctx.beginPath()
  ctx.moveTo(x - 14, y)
  ctx.lineTo(x - 4, y - 8)
  ctx.lineTo(x, y)
  ctx.lineTo(x + 4, y - 8)
  ctx.lineTo(x + 14, y)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.ellipse(x, y + 2, 10, 8, 0, 0, Math.PI * 2)
  ctx.fill()
  if (type === 'flag') {
    ctx.fillStyle = '#fff'
    ctx.fillRect(x - 3, y - 2, 6, 4)
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, state: GameState) {
  drawStarfield(ctx, state.tick)

  ctx.fillStyle = '#ef4444'
  ctx.font = 'bold 12px monospace'
  ctx.fillText('1UP', 12, 18)
  ctx.fillStyle = '#fff'
  ctx.fillText(String(state.score), 12, 34)

  ctx.fillStyle = '#ef4444'
  ctx.fillText('HI-SCORE', WIDTH / 2 - 36, 18)
  ctx.fillStyle = '#60a5fa'
  ctx.fillText(String(state.highScore), WIDTH / 2 - 20, 34)

  ctx.fillStyle = '#ef4444'
  ctx.fillText(`♥×${state.lives}`, WIDTH - 52, 18)

  if (state.phase === 'title') {
    ctx.fillStyle = '#1e3a8a'
    ctx.fillRect(40, 140, WIDTH - 80, 60)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.strokeRect(40, 140, WIDTH - 80, 60)
    ctx.fillStyle = '#000'
    ctx.font = 'bold 28px monospace'
    ctx.fillText('STAR SHOOTER', 62, 178)
    ctx.fillStyle = '#67e8f9'
    ctx.font = 'bold 16px monospace'
    ctx.fillText('▶ タップしてスタート', WIDTH / 2 - 88, 260)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('ギャラクシアン風シューティング', WIDTH / 2 - 78, 300)
    return
  }

  if (state.phase === 'gameover') {
    for (const e of state.enemies) {
      if (e.alive) drawEnemy(ctx, e.type, e.x, e.y)
    }
    drawPlayer(ctx, state.playerX)
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 24px monospace'
    ctx.fillText('GAME OVER', WIDTH / 2 - 68, HEIGHT / 2 - 10)
    ctx.fillStyle = '#fff'
    ctx.font = '14px monospace'
    ctx.fillText(`SCORE ${state.score}`, WIDTH / 2 - 42, HEIGHT / 2 + 20)
    ctx.fillStyle = '#67e8f9'
    ctx.fillText('タップしてリトライ', WIDTH / 2 - 68, HEIGHT / 2 + 50)
    return
  }

  for (const e of state.enemies) {
    if (e.alive) drawEnemy(ctx, e.type, e.x, e.y)
  }
  for (const b of state.bullets) {
    ctx.fillStyle = b.fromPlayer ? '#fef08a' : '#f87171'
    ctx.fillRect(b.x - 2, b.y - 4, 4, 8)
  }
  drawPlayer(ctx, state.playerX)
}

export function GalaxyShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(createGameState())
  const keysRef = useRef({ left: false, right: false, fire: false })
  const [hud, setHud] = useState({ score: 0, lives: 3 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const loop = () => {
      stateRef.current = updateGame(stateRef.current, keysRef.current)
      drawFrame(ctx, stateRef.current)
      setHud({ score: stateRef.current.score, lives: stateRef.current.lives })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const setKey = (key: 'left' | 'right' | 'fire', value: boolean) => {
    keysRef.current = { ...keysRef.current, [key]: value }
  }

  const handleCanvasPress = () => {
    const phase = stateRef.current.phase
    if (phase === 'title' || phase === 'gameover') {
      stateRef.current = startGame(stateRef.current)
    } else {
      setKey('fire', true)
    }
  }

  const handleCanvasRelease = () => {
    setKey('fire', false)
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-coffee-600">
        スコア {hud.score} · 残機 {hud.lives}
      </p>

      <div className="mx-auto w-fit overflow-hidden rounded-xl border-2 border-coffee-600 shadow-lg">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block max-w-full touch-none"
          onMouseDown={handleCanvasPress}
          onMouseUp={handleCanvasRelease}
          onMouseLeave={handleCanvasRelease}
          onTouchStart={handleCanvasPress}
          onTouchEnd={handleCanvasRelease}
        />
      </div>

      <div className="mx-auto flex max-w-[360px] justify-between gap-2">
        <button
          type="button"
          className="touch-target flex-1 rounded-xl bg-coffee-200 py-4 text-2xl active:bg-coffee-300"
          onTouchStart={() => setKey('left', true)}
          onTouchEnd={() => setKey('left', false)}
          onMouseDown={() => setKey('left', true)}
          onMouseUp={() => setKey('left', false)}
          onMouseLeave={() => setKey('left', false)}
        >
          ◀
        </button>
        <button
          type="button"
          className="touch-target flex-1 rounded-xl bg-coffee-600 py-4 text-lg font-bold text-cream active:bg-coffee-700"
          onTouchStart={() => setKey('fire', true)}
          onTouchEnd={() => setKey('fire', false)}
          onMouseDown={() => setKey('fire', true)}
          onMouseUp={() => setKey('fire', false)}
          onMouseLeave={() => setKey('fire', false)}
        >
          連射
        </button>
        <button
          type="button"
          className="touch-target flex-1 rounded-xl bg-coffee-200 py-4 text-2xl active:bg-coffee-300"
          onTouchStart={() => setKey('right', true)}
          onTouchEnd={() => setKey('right', false)}
          onMouseDown={() => setKey('right', true)}
          onMouseUp={() => setKey('right', false)}
          onMouseLeave={() => setKey('right', false)}
        >
          ▶
        </button>
      </div>

      <p className="text-center text-xs text-coffee-500">
        左右ボタンで移動。発射ボタンまたは画面を押し続けると連射できます。
      </p>
    </div>
  )
}
