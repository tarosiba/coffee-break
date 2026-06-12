import { useState, type ReactNode } from 'react'
import type { GameId } from '../types'
import { JankenGame } from './games/JankenGame'
import { NumberGuessGame } from './games/NumberGuessGame'
import { TicTacToeGame } from './games/TicTacToeGame'
import { MemoryGame } from './games/MemoryGame'
import { GomokuGame } from './games/GomokuGame'
import { LifeBoardGame } from './games/LifeBoardGame'
import { TerrainShowcase } from './terrain/TerrainShowcase'

const games: { id: GameId; title: string; description: string; icon: string; category: string }[] = [
  { id: 'memory', title: '神経衰弱', description: 'トランプのペアを探そう', icon: '🂠', category: 'トランプ' },
  { id: 'gomoku', title: '五目並べ', description: '15×15の盤で対戦', icon: '⚫', category: 'ボード' },
  { id: 'life-board', title: '人生ゲーム', description: 'サイコロですすむボードゲーム', icon: '🎲', category: 'ボード' },
  { id: 'janken', title: 'じゃんけん', description: 'CPUと対戦', icon: '✊', category: 'カジュアル' },
  { id: 'number-guess', title: '数当て', description: '1〜100を当てよう', icon: '🔢', category: 'カジュアル' },
  { id: 'tic-tac-toe', title: '三目並べ', description: 'CPUと対戦', icon: '⭕', category: 'ボード' },
  { id: 'terrain-showcase', title: 'タイルチップ見本', description: '都市地形タイルのデザイン見本', icon: '🏙️', category: 'ツール' },
]

const gameComponents: Record<GameId, ReactNode> = {
  janken: <JankenGame />,
  'number-guess': <NumberGuessGame />,
  'tic-tac-toe': <TicTacToeGame />,
  memory: <MemoryGame />,
  gomoku: <GomokuGame />,
  'life-board': <LifeBoardGame />,
  'terrain-showcase': <TerrainShowcase />,
}

export function Games() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const active = games.find((g) => g.id === activeGame)

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold text-coffee-800">ミニゲーム</h2>
        <p className="text-sm text-coffee-500">トランプ・ボードゲーム・カジュアルゲーム</p>
      </div>

      {!activeGame ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setActiveGame(game.id)}
              className="touch-target flex items-center gap-4 rounded-2xl border border-coffee-200 bg-white/70 p-4 text-left transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-sm"
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>{game.icon}</span>
              <div className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-coffee-400">{game.category}</span>
                <h3 className="font-semibold text-coffee-800">{game.title}</h3>
                <p className="text-sm text-coffee-500">{game.description}</p>
              </div>
              <span className="text-coffee-400">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-coffee-200 bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              className="touch-target rounded-lg px-3 py-2 text-sm text-coffee-500 hover:bg-coffee-100"
            >
              ← 戻る
            </button>
            <h3 className="text-lg font-semibold text-coffee-800">
              <span className="mr-2" aria-hidden>{active?.icon}</span>
              {active?.title}
            </h3>
          </div>
          {activeGame && gameComponents[activeGame]}
        </div>
      )}
    </div>
  )
}
