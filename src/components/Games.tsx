import { useState } from 'react'
import type { GameId } from '../types'
import { JankenGame } from './games/JankenGame'
import { NumberGuessGame } from './games/NumberGuessGame'
import { TicTacToeGame } from './games/TicTacToeGame'

const games: { id: GameId; title: string; description: string; icon: string }[] = [
  { id: 'janken', title: 'じゃんけん', description: 'CPUと対戦', icon: '✊' },
  { id: 'number-guess', title: '数当て', description: '1〜100を当てよう', icon: '🔢' },
  { id: 'tic-tac-toe', title: '三目並べ', description: 'CPUと対戦', icon: '⭕' },
]

export function Games() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)

  const active = games.find((g) => g.id === activeGame)

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold text-coffee-800">ミニゲーム</h2>
        <p className="text-sm text-coffee-500">休憩中にサクッと遊べるゲーム集</p>
      </div>

      {!activeGame ? (
        <div className="grid gap-3">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setActiveGame(game.id)}
              className="flex items-center gap-4 rounded-2xl border border-coffee-200 bg-white/70 p-4 text-left transition hover:border-coffee-300 hover:shadow-sm"
            >
              <span className="text-3xl" aria-hidden>{game.icon}</span>
              <div>
                <h3 className="font-semibold text-coffee-800">{game.title}</h3>
                <p className="text-sm text-coffee-500">{game.description}</p>
              </div>
              <span className="ml-auto text-coffee-400">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-coffee-200 bg-white/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              className="rounded-lg px-2 py-1 text-sm text-coffee-500 hover:bg-coffee-100"
            >
              ← 戻る
            </button>
            <h3 className="text-lg font-semibold text-coffee-800">
              <span className="mr-2" aria-hidden>{active?.icon}</span>
              {active?.title}
            </h3>
          </div>

          {activeGame === 'janken' && <JankenGame />}
          {activeGame === 'number-guess' && <NumberGuessGame />}
          {activeGame === 'tic-tac-toe' && <TicTacToeGame />}
        </div>
      )}
    </div>
  )
}
