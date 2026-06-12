import { useState } from 'react'

type Hand = 'rock' | 'paper' | 'scissors'

const hands: { id: Hand; label: string; emoji: string }[] = [
  { id: 'rock', label: 'グー', emoji: '✊' },
  { id: 'paper', label: 'パー', emoji: '✋' },
  { id: 'scissors', label: 'チョキ', emoji: '✌️' },
]

const beats: Record<Hand, Hand> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
}

function getResult(player: Hand, cpu: Hand): 'win' | 'lose' | 'draw' {
  if (player === cpu) return 'draw'
  return beats[player] === cpu ? 'win' : 'lose'
}

const resultText = { win: '勝ち！ 🎉', lose: '負け…', draw: 'あいこ' }

function pickRandomHand(): Hand {
  const options: Hand[] = ['rock', 'paper', 'scissors']
  return options[Math.floor(Math.random() * options.length)]
}

export function JankenGame() {
  const [playerHand, setPlayerHand] = useState<Hand | null>(null)
  const [cpuHand, setCpuHand] = useState<Hand | null>(null)
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null)
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 })

  const play = (hand: Hand) => {
    const cpu = pickRandomHand()
    const outcome = getResult(hand, cpu)
    setPlayerHand(hand)
    setCpuHand(cpu)
    setResult(outcome)
    setScore((s) => ({ ...s, [outcome]: s[outcome] + 1 }))
  }

  const reset = () => {
    setPlayerHand(null)
    setCpuHand(null)
    setResult(null)
    setScore({ win: 0, lose: 0, draw: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-6 text-sm text-coffee-600">
        <span>勝ち: {score.win}</span>
        <span>負け: {score.lose}</span>
        <span>あいこ: {score.draw}</span>
      </div>

      {playerHand && cpuHand && (
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="mb-1 text-xs text-coffee-500">あなた</p>
            <span className="text-5xl">{hands.find((h) => h.id === playerHand)?.emoji}</span>
          </div>
          <span className="text-2xl text-coffee-400">vs</span>
          <div className="text-center">
            <p className="mb-1 text-xs text-coffee-500">相手</p>
            <span className="text-5xl">{hands.find((h) => h.id === cpuHand)?.emoji}</span>
          </div>
        </div>
      )}

      {result && (
        <p className="text-center text-xl font-bold text-coffee-700">{resultText[result]}</p>
      )}

      <div className="flex justify-center gap-3">
        {hands.map((hand) => (
          <button
            key={hand.id}
            type="button"
            onClick={() => play(hand.id)}
            className="touch-target flex flex-col items-center rounded-xl border border-coffee-200 bg-white px-6 py-5 transition hover:border-coffee-400 hover:bg-coffee-50 active:scale-95 sm:px-8 sm:py-6"
          >
            <span className="text-3xl">{hand.emoji}</span>
            <span className="mt-1 text-sm font-medium text-coffee-700">{hand.label}</span>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={reset}
          className="text-sm text-coffee-500 underline hover:text-coffee-700"
        >
          スコアをリセット
        </button>
      </div>
    </div>
  )
}
