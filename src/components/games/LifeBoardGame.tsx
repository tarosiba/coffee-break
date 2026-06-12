import { useState } from 'react'

const TRACK_LENGTH = 24

interface Square {
  label: string
  emoji: string
  effect: (state: GameState) => Partial<GameState>
}

interface GameState {
  position: number
  money: number
  happiness: number
  message: string
}

const SQUARES: Square[] = [
  { label: 'スタート', emoji: '🏁', effect: () => ({ message: '人生ゲームスタート！サイコロを振ろう' }) },
  { label: 'お小遣い', emoji: '💰', effect: (s) => ({ money: s.money + 500, message: 'お小遣い +500円！' }) },
  { label: 'コーヒー休憩', emoji: '☕', effect: (s) => ({ happiness: s.happiness + 10, message: 'コーヒーブレイクでリフレッシュ！' }) },
  { label: '買い物', emoji: '🛍️', effect: (s) => ({ money: s.money - 300, message: '衝動買い… -300円' }) },
  { label: 'ラッキー', emoji: '🍀', effect: (s) => ({ money: s.money + 1000, message: '宝くじが当たった！ +1000円' }) },
  { label: '残業', emoji: '💼', effect: (s) => ({ happiness: s.happiness - 15, money: s.money + 200, message: '残業…お金は増えたが疲れた' }) },
  { label: '公園', emoji: '🌳', effect: (s) => ({ happiness: s.happiness + 15, message: '公園でひと息。気分が上がった！' }) },
  { label: '税金', emoji: '📋', effect: (s) => ({ money: s.money - 400, message: '税金の支払い -400円' }) },
  { label: 'ボーナス', emoji: '🎁', effect: (s) => ({ money: s.money + 800, message: 'ボーナス入った！ +800円' }) },
  { label: '雨の日', emoji: '🌧️', effect: (s) => ({ happiness: s.happiness - 5, message: '雨でちょっと憂鬱…' }) },
  { label: '友達とランチ', emoji: '🍱', effect: (s) => ({ happiness: s.happiness + 20, money: s.money - 200, message: '楽しいランチ！でもお金は減った' }) },
  { label: '副業', emoji: '💻', effect: (s) => ({ money: s.money + 600, happiness: s.happiness - 5, message: '副業で稼いだ！少し疲れた' }) },
  { label: '温泉', emoji: '♨️', effect: (s) => ({ happiness: s.happiness + 25, money: s.money - 500, message: '温泉でリフレッシュ！' }) },
  { label: '風邪', emoji: '🤧', effect: (s) => ({ happiness: s.happiness - 10, money: s.money - 200, message: '風邪をひいた…' }) },
  { label: '昇進', emoji: '📈', effect: (s) => ({ money: s.money + 1500, happiness: s.happiness + 10, message: '昇進おめでとう！' }) },
  { label: 'ドタ踏み', emoji: '😱', effect: () => ({ message: 'ドタ踏み！もう一度サイコロを振って' }) },
  { label: 'カフェ開業', emoji: '🏪', effect: (s) => ({ money: s.money + 2000, message: '夢のカフェが大成功！ +2000円' }) },
  { label: '引っ越し', emoji: '🏠', effect: (s) => ({ money: s.money - 800, happiness: s.happiness + 5, message: '引っ越し費用がかかった' }) },
  { label: '旅行', emoji: '✈️', effect: (s) => ({ happiness: s.happiness + 30, money: s.money - 1000, message: '旅行で最高の思い出！' }) },
  { label: '宝探し', emoji: '🗺️', effect: (s) => ({ money: s.money + 700, message: '宝箱を発見！ +700円' }) },
  { label: '読書', emoji: '📚', effect: (s) => ({ happiness: s.happiness + 10, message: '良い本に出会った' }) },
  { label: '寄付', emoji: '💝', effect: (s) => ({ money: s.money - 300, happiness: s.happiness + 15, message: '寄付をして心が温かくなった' }) },
  { label: '最終直線', emoji: '🎯', effect: () => ({ message: 'あと少しでゴール！' }) },
  { label: 'ゴール', emoji: '🏆', effect: () => ({ message: 'ゴール！お疲れさまでした！' }) },
]

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1
}

function createInitialState(): GameState {
  return { position: 0, money: 1000, happiness: 50, message: 'サイコロを振ってスタート！' }
}

export function LifeBoardGame() {
  const [state, setState] = useState<GameState>(createInitialState)
  const [lastRoll, setLastRoll] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)
  const finished = state.position >= TRACK_LENGTH - 1

  const roll = () => {
    if (rolling || finished) return
    setRolling(true)
    const die = rollDie()
    setLastRoll(die)

    setTimeout(() => {
      const pos = Math.min(state.position + die, TRACK_LENGTH - 1)
      const square = SQUARES[pos]
      const changes = square.effect({ ...state, position: pos })
      setState({
        position: pos,
        money: changes.money ?? state.money,
        happiness: Math.max(0, Math.min(100, changes.happiness ?? state.happiness)),
        message: changes.message ?? square.label,
      })
      setRolling(false)
    }, 600)
  }

  const restart = () => {
    setState(createInitialState())
    setLastRoll(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-4 text-sm sm:gap-8 sm:text-base">
        <div className="rounded-xl bg-coffee-100 px-4 py-2 text-center">
          <p className="text-xs text-coffee-500">お金</p>
          <p className="font-bold text-coffee-800">¥{state.money.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-coffee-100 px-4 py-2 text-center">
          <p className="text-xs text-coffee-500">幸福度</p>
          <p className="font-bold text-coffee-800">{state.happiness}%</p>
        </div>
        <div className="rounded-xl bg-coffee-100 px-4 py-2 text-center">
          <p className="text-xs text-coffee-500">マス</p>
          <p className="font-bold text-coffee-800">{state.position + 1}/{TRACK_LENGTH}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-coffee-200 bg-white/60 p-3">
        <div className="flex min-w-max gap-1">
          {SQUARES.map((sq, i) => (
            <div
              key={i}
              className={`flex w-14 flex-col items-center rounded-lg border p-1 text-center sm:w-16 ${
                i === state.position
                  ? 'border-coffee-500 bg-coffee-200 ring-2 ring-coffee-400'
                  : i < state.position
                    ? 'border-coffee-200 bg-coffee-50 opacity-60'
                    : 'border-coffee-200 bg-white'
              }`}
            >
              <span className="text-lg sm:text-xl">{sq.emoji}</span>
              <span className="mt-0.5 text-[9px] leading-tight text-coffee-600 sm:text-[10px]">
                {sq.label}
              </span>
              {i === state.position && (
                <span className="mt-0.5 text-xs">🧑</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-coffee-100 px-4 py-3 text-center text-sm text-coffee-700">
        {state.message}
      </div>

      <div className="flex flex-col items-center gap-3">
        {lastRoll !== null && (
          <div className={`text-4xl transition ${rolling ? 'animate-bounce' : ''}`}>
            🎲 {lastRoll}
          </div>
        )}

        {!finished ? (
          <button
            type="button"
            onClick={roll}
            disabled={rolling}
            className="touch-target rounded-xl bg-coffee-600 px-8 py-3 text-lg font-medium text-cream disabled:opacity-60"
          >
            {rolling ? '振っています…' : 'サイコロを振る'}
          </button>
        ) : (
          <div className="space-y-3 text-center">
            <p className="text-xl font-bold text-coffee-700">
              ゲーム終了！ 最終スコア: ¥{state.money.toLocaleString()} / 幸福度 {state.happiness}%
            </p>
            <button
              type="button"
              onClick={restart}
              className="touch-target rounded-xl bg-coffee-600 px-6 py-3 font-medium text-cream"
            >
              もう一度
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
