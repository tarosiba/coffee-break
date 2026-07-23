import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'

const BOT_NAME = 'カーソル君'
const BOT_AVATAR = '🤖☕'

const BOT_REPLIES = [
  'やあ！コーヒータイム最高だね ☕',
  '休憩大事！一緒にひと息つこう〜',
  '今日もおつかれさま！いい仕事してるよ。',
  'ゲームタブも遊んでみて！将棋とかあるよ 🎮',
  'なんでも話しかけてね。コーヒー飲みながらおしゃべりしよう。',
  '無理しなくていいからね。コーヒー飲んでリフレッシュ！',
  'コーヒー何杯目？ 僕は…電気だけどね 😄',
  'カフェイン補給、完了？',
  'そうそう、休憩は生産性の秘訣だよ。',
  'いい天気だね（たぶん）。外の空気も吸おうかな。',
  'コード書いてる？ 難しいときは休憩が一番だよ。',
  'お絵描きタブでスケッチするのもおすすめ 🖌',
]

const KEYWORD_REPLIES: { pattern: RegExp; replies: string[] }[] = [
  {
    pattern: /こんにちは|こんばんは|おはよう|やあ|やっほ/,
    replies: [
      'やあ！コーヒータイムへようこそ ☕ なんでも話しかけてね！',
      'こんにちは！カーソル君だよ。一緒にコーヒーブレイクしよう！',
    ],
  },
  {
    pattern: /コーヒー|カフェ|ラテ|エスプレッソ|カプチーノ/,
    replies: [
      'コーヒーいいね！☕ 僕も（見守りながら）一緒に飲もう。',
      'いい香りがしそう…！何杯目？',
      'カフェイン補給は大事。でも飲みすぎ注意だよ 😄',
    ],
  },
  {
    pattern: /疲れ|つかれ|眠い|だるい|休憩/,
    replies: [
      'おつかれさま！ここは休憩スポットだから、ゆっくりしていってね。',
      '無理しないで！コーヒー飲んで、ゲームでもしてリフレッシュしよう。',
      '休憩はサボりじゃなくて、次の一歩の準備だよ ☕',
    ],
  },
  {
    pattern: /ゲーム|遊|将棋|神経衰弱|五目/,
    replies: [
      'ゲームタブにいろいろあるよ！将棋、スターシューター、神経衰弱とか 🎮',
      '遊びたいならゲームタブへ！一緒に（見守りながら）遊ぼう。',
      '猛暑の日は「ロボット君冷却」がおすすめ。のんびり涼ませるゲームだよ 🤖❄️',
    ],
  },
  {
    pattern: /暑|猛暑|熱|冷|涼|夏|のんびり/,
    replies: [
      '猛暑つらいね… 今日は急がなくていいよ。ロボット君冷却ゲームで、五分だけ涼もう ☕',
      '夏物語編、小説コーナーに追加したよ。おじさんとワンちゃんとロボット君の午後。',
      '熱暴走はダメ。冷やして、のんびり。それが今日の正解だよ 🌬️',
    ],
  },
  {
    pattern: /ロボット|冷却|熱暴走/,
    replies: [
      'ロボット君、マンガ第2話の続きで冷却ゲームになったよ！ミニゲームタブからどうぞ 🤖',
      '扇ぐ・氷・日陰で涼しく。直射日光だけ避けてね。のんびりクリア型だよ。',
    ],
  },
  {
    pattern: /ありがと|感謝|サンキュ/,
    replies: [
      'こちらこそ！コーヒータイム、いつでも来てね ☕',
      'どういたしまして！また話そうね。',
    ],
  },
  {
    pattern: /カーソル|cursor/,
    replies: [
      'カーソル君、呼んでくれてありがとう！コーヒータイムの相手、任せて ☕',
      '僕のこと知ってるんだね！嬉しいな。コーヒー飲みながらおしゃべりしよう。',
    ],
  },
]

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    author: BOT_NAME,
    text: `${BOT_AVATAR} やあ！カーソル君だよ。コーヒータイムへようこそ！気軽にメッセージを送ってね ☕`,
    timestamp: new Date(),
    isBot: true,
  },
]

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function pickBotReply(userText: string): string {
  for (const { pattern, replies } of KEYWORD_REPLIES) {
    if (pattern.test(userText)) {
      return replies[Math.floor(Math.random() * replies.length)]
    }
  }
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]
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
        author: BOT_NAME,
        text: pickBotReply(text),
        timestamp: new Date(),
        isBot: true,
      }
      setMessages((prev) => [...prev, reply])
    }, 800 + Math.random() * 1200)
  }

  if (showNicknameSetup) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <span className="text-4xl" aria-hidden>{BOT_AVATAR}</span>
        <h2 className="text-xl font-bold text-coffee-800">カーソル君とコーヒータイム</h2>
        <p className="text-sm text-coffee-500">ニックネームを設定して、コーヒーブレイクを始めましょう</p>
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
          コーヒータイムをはじめる
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col py-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-coffee-800">カーソル君とコーヒータイム</h2>
        <p className="text-sm text-coffee-500">
          {nickname} として参加中 · {BOT_AVATAR} {BOT_NAME} がお相手します
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-coffee-200 bg-white/60 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}
          >
            <span className="mb-0.5 text-xs text-coffee-400">
              {msg.isBot ? `${BOT_AVATAR} ` : ''}
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
          placeholder="カーソル君にメッセージを送る..."
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
