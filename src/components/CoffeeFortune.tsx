import { useMemo, useState } from 'react'
import {
  COFFEE_BEANS,
  drawFortune,
  getFortuneById,
  loadTodayDraw,
} from '../lib/coffeeFortune'

export function CoffeeFortune() {
  const [draw, setDraw] = useState(() => loadTodayDraw())
  const fortune = useMemo(
    () => (draw ? getFortuneById(draw.fortuneId) : undefined),
    [draw],
  )

  const onPick = (beanIndex: number) => {
    if (draw) return
    setDraw(drawFortune(beanIndex))
  }

  return (
    <section
      className="rounded-2xl border border-coffee-200 bg-gradient-to-br from-white to-coffee-50/80 p-4 shadow-sm"
      aria-label="今日のコーヒー豆占い"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-coffee-800">今日のコーヒー豆占い</h3>
        <p className="text-xs text-coffee-400">1日1回</p>
      </div>

      {fortune && draw ? (
        <div className="space-y-3">
          <p className="text-xs font-medium text-coffee-500">カーソル君の今日の一杯</p>
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden>
              {fortune.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-coffee-500">{fortune.bean}</p>
              <p className="text-base font-semibold text-coffee-800">{fortune.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-coffee-700">{fortune.message}</p>
              <p className="mt-3 rounded-xl bg-coffee-100/70 px-3 py-2 text-sm text-coffee-700">
                今日の一手：{fortune.tryThis}
              </p>
            </div>
          </div>
          <p className="text-xs text-coffee-400">
            同じ日の引き直しはなし。コーヒーも抽出は一度きり。また明日ね ☕
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-coffee-600">
            豆を1つ選んでください。カーソル君が、今日の味わいを教えます。占いというより、ひと息のきっかけです。
          </p>
          <div className="grid grid-cols-5 gap-2">
            {COFFEE_BEANS.map((bean, index) => (
              <button
                key={bean.label}
                type="button"
                onClick={() => onPick(index)}
                className="touch-target flex flex-col items-center justify-center rounded-2xl border border-coffee-200 bg-white/80 px-1 py-3 text-center transition hover:border-coffee-400 hover:shadow-sm active:scale-[0.96]"
                aria-label={`${bean.label}を選ぶ`}
              >
                <span className="text-2xl sm:text-3xl" aria-hidden>
                  {bean.emoji}
                </span>
                <span className="mt-1 text-[10px] leading-tight text-coffee-500 sm:text-xs">
                  {bean.label.replace('の豆', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
