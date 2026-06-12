import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'

const BOT_REPLIES = [
  'いいですね！☕ コーヒーブレイク最高です。',
  'わかります〜。ちょっと一息つきましょう。',
  '今日もお疲れさまです！',
  'ゲームの方も遊んでみてくださいね 🎮',
  '雑談、大歓迎です！',
  'そうそう、休憩は大事ですよね。',
  'いい天気ですね（たぶん）',
  'コーヒー、何杯目ですか？ 😄',
]

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    author: 'Coffee Bot',
    text: 'Coffee Break へようこそ！気軽にメッセージを送ってください ☕',
    timestamp: new Date(),
    isBot: true,
  },
]

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [nickname, setNickname] = useState(() => {
    const saved = localStorage.getItem('coffee-break-nickname')
    return saved ?? ''
  })
  const [showNicknameSetup, setShowNicknameSetup] = useState(() => {
    return !localStorage.getItem('coffee-break-nickname')
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveNickname = () => {
    if (!nickname.trim()) return
    localStorage.setItem('coffee-break-nickname', nickname.trim())
    setShowNicknameSetup(false)
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || !nickname.trim()) return

    const userMessage: ChatMessage = {
      id: generateId(),
      author: nickname.trim(),
      text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const reply: ChatMessage = {
        id: generateId(),
        author: 'Coffee Bot',
        text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
        timestamp: new Date(),
        isBot: true,
      }
      setMessages((prev) => [...prev, reply])
    }, 800 + Math.random() * 1200)
  }

  if (showNicknameSetup) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <span className="text-4xl" aria-hidden>💬</span>
        <h2 className="text-xl font-bold text-coffee-800">ニックネームを設定</h2>
        <p className="text-sm text-coffee-500">雑談ルームで使う名前を入力してください</p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例: コーヒー太郎"
          maxLength={20}
          className="w-full max-w-xs rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-coffee-800 outline-none focus:border-coffee-400"
          onKeyDown={(e) => e.key === 'Enter' && saveNickname()}
        />
        <button
          type="button"
          onClick={saveNickname}
          disabled={!nickname.trim()}
          className="rounded-xl bg-coffee-600 px-6 py-2.5 font-medium text-cream transition hover:bg-coffee-700 disabled:opacity-50"
        >
          はじめる
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col py-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-coffee-800">雑談ルーム</h2>
        <p className="text-sm text-coffee-500">
          {nickname} として参加中 · Coffee Bot がお相手します
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-coffee-200 bg-white/60 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}
          >
            <span className="mb-0.5 text-xs text-coffee-400">
              {msg.author} · {msg.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.isBot
                  ? 'rounded-tl-sm bg-coffee-100 text-coffee-800'
                  : 'rounded-tr-sm bg-coffee-600 text-cream'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          maxLength={500}
          className="flex-1 rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-coffee-800 outline-none focus:border-coffee-400"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-xl bg-coffee-600 px-5 py-2.5 font-medium text-cream transition hover:bg-coffee-700 disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </div>
  )
}
