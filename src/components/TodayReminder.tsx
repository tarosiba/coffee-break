import { useMemo } from 'react'
import { buildTodayReminderMessage, getTodayEvents } from '../lib/calendar'

interface TodayReminderProps {
  onOpenCalendar: () => void
}

export function TodayReminder({ onOpenCalendar }: TodayReminderProps) {
  const events = useMemo(() => getTodayEvents(), [])
  const message = buildTodayReminderMessage(events)

  return (
    <section
      className="rounded-2xl border border-coffee-200 bg-gradient-to-br from-coffee-50 to-white/80 p-4 shadow-sm"
      aria-label="今日の予定リマインド"
    >
      <div className="flex gap-3">
        <span className="shrink-0 text-3xl" aria-hidden>
          🤖☕
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium text-coffee-500">カーソル君からのリマインド</p>
          <p className="text-sm leading-relaxed text-coffee-800">{message}</p>
          {events.length > 0 && (
            <button
              type="button"
              onClick={onOpenCalendar}
              className="touch-target mt-2 text-xs font-medium text-coffee-600 underline-offset-2 hover:text-coffee-700 hover:underline"
            >
              カレンダーで確認 →
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
