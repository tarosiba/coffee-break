import { useEffect, useState } from 'react'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const

function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return now
}

function handAngle(hours: number, minutes: number, seconds: number) {
  return {
    hour: (hours % 12) * 30 + minutes * 0.5,
    minute: minutes * 6 + seconds * 0.1,
    second: seconds * 6,
  }
}

export function Clock() {
  const now = useNow()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const angles = handAngle(hours, minutes, seconds)

  const dateLabel = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${WEEKDAYS[now.getDay()]}）`
  const timeLabel = now.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-coffee-800">コーヒーブレイク時計</h2>
        <p className="mt-1 text-sm text-coffee-500">ひと息つくタイミングを、アナログ時計で</p>
      </div>

      <div className="mx-auto max-w-md rounded-3xl border border-coffee-200 bg-white/80 p-6 shadow-sm sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[min(100%,320px)]">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full drop-shadow-md"
            role="img"
            aria-label={`アナログ時計 ${timeLabel}`}
          >
            <defs>
              <radialGradient id="clock-face" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#fffaf5" />
                <stop offset="70%" stopColor="#f5ebe0" />
                <stop offset="100%" stopColor="#e8d5c0" />
              </radialGradient>
              <filter id="hand-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
              </filter>
            </defs>

            <circle cx="100" cy="100" r="96" fill="url(#clock-face)" stroke="#c9a97a" strokeWidth="3" />
            <circle cx="100" cy="100" r="92" fill="none" stroke="#e0cdb3" strokeWidth="1" />

            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const outer = 88
              const inner = i % 3 === 0 ? 76 : 82
              const x1 = 100 + outer * Math.cos(angle)
              const y1 = 100 + outer * Math.sin(angle)
              const x2 = 100 + inner * Math.cos(angle)
              const y2 = 100 + inner * Math.sin(angle)
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 3 === 0 ? '#6f4a2a' : '#b08852'}
                  strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                  strokeLinecap="round"
                />
              )
            })}

            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const r = 68
              const x = 100 + r * Math.cos(angle)
              const y = 100 + r * Math.sin(angle)
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#5a3b22"
                  fontSize="11"
                  fontWeight="600"
                >
                  {num}
                </text>
              )
            })}

            <g filter="url(#hand-shadow)">
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="58"
                stroke="#3d2817"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angles.hour} 100 100)`}
              />
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="42"
                stroke="#5a3b22"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${angles.minute} 100 100)`}
              />
              <line
                x1="100"
                y1="108"
                x2="100"
                y2="32"
                stroke="#8b5e34"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${angles.second} 100 100)`}
              />
            </g>

            <circle cx="100" cy="100" r="5" fill="#6f4a2a" />
            <circle cx="100" cy="100" r="2" fill="#c9a97a" />

            <text x="100" y="128" textAnchor="middle" fontSize="14" aria-hidden>
              ☕
            </text>
          </svg>
        </div>

        <p className="mt-6 text-center text-2xl font-bold tabular-nums text-coffee-800 sm:text-3xl">
          {timeLabel}
        </p>
        <p className="mt-1 text-center text-sm text-coffee-500">{dateLabel}</p>
      </div>

      <section className="mx-auto max-w-md rounded-2xl border border-coffee-200 bg-coffee-50/60 p-4 text-center text-sm text-coffee-600">
        <p className="font-medium text-coffee-700">コーヒーブレイクの目安</p>
        <p className="mt-2">
          午前10時・午後3時ごろは、一息つくのにちょうどいい時間です。
          <br />
          ホーム画面に追加しておけば、いつでも時計を見られます。
        </p>
      </section>
    </div>
  )
}
