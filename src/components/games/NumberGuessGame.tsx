import { useState } from 'react'

function createGame() {
  return {
    target: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    hint: null as string | null,
    won: false,
    history: [] as number[],
  }
}

export function NumberGuessGame() {
  const [game, setGame] = useState(createGame)
  const [guess, setGuess] = useState('')
  const { target, attempts, hint, won, history } = game

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(guess, 10)
    if (isNaN(num) || num < 1 || num > 100) {
      setGame({ ...game, hint: '1〜100 の数字を入力してください' })
      return
    }

    const nextAttempts = attempts + 1
    const nextHistory = [num, ...history].slice(0, 5)

    if (num === target) {
      setGame({
        target,
        attempts: nextAttempts,
        won: true,
        hint: `正解！ ${nextAttempts} 回で当てました 🎉`,
        history: nextHistory,
      })
    } else {
      setGame({
        target,
        attempts: nextAttempts,
        won: false,
        hint: num < target ? 'もっと大きい数字です ↑' : 'もっと小さい数字です ↓',
        history: nextHistory,
      })
    }
    setGuess('')
  }

  const restart = () => {
    setGame(createGame())
    setGuess('')
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-coffee-600">
        1〜100 の数字を当ててください
        <br />
        <span className="text-sm text-coffee-400">試行回数: {attempts}</span>
      </p>

      {!won ? (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="数字を入力"
            className="flex-1 rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-coffee-800 outline-none focus:border-coffee-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-coffee-600 px-5 py-2.5 font-medium text-cream transition hover:bg-coffee-700"
          >
            判定
          </button>
        </form>
      ) : (
        <div className="text-center">
          <button
            type="button"
            onClick={restart}
            className="rounded-xl bg-coffee-600 px-6 py-2.5 font-medium text-cream transition hover:bg-coffee-700"
          >
            もう一度
          </button>
        </div>
      )}

      {hint && (
        <p className="rounded-xl bg-coffee-100 px-4 py-3 text-center font-medium text-coffee-700">
          {hint}
        </p>
      )}

      {history.length > 0 && (
        <div className="text-center text-sm text-coffee-500">
          最近の入力: {history.join(' → ')}
        </div>
      )}
    </div>
  )
}
