import { useMemo, useState } from 'react'
import type { CalendarEvent } from '../types'
import {
  formatDateKey,
  generateEventId,
  getDaysInMonth,
  getFirstDayOfWeek,
  loadEvents,
  MONTH_LABELS,
  saveEvents,
  WEEKDAY_LABELS,
} from '../lib/calendar'

export function Calendar() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()))
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents())
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [memo, setMemo] = useState('')

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))
    }
    return map
  }, [events])

  const selectedEvents = eventsByDate.get(selectedDate) ?? []

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let day = 1; day <= daysInMonth; day++) cells.push(day)
    return cells
  }, [daysInMonth, firstDay])

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const persist = (next: CalendarEvent[]) => {
    setEvents(next)
    saveEvents(next)
  }

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const goToToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelectedDate(todayKey)
  }

  const selectDay = (day: number) => {
    setSelectedDate(formatDateKey(viewYear, viewMonth, day))
  }

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const newEvent: CalendarEvent = {
      id: generateEventId(),
      title: trimmed,
      date: selectedDate,
      time: time.trim() || undefined,
      memo: memo.trim() || undefined,
    }

    persist([...events, newEvent])
    setTitle('')
    setTime('')
    setMemo('')
  }

  const deleteEvent = (id: string) => {
    persist(events.filter((event) => event.id !== id))
  }

  const formatSelectedLabel = () => {
    const [y, m, d] = selectedDate.split('-').map(Number)
    return `${y}年${m}月${d}日`
  }

  return (
    <div className="space-y-6 py-4">
      <section className="rounded-2xl border border-coffee-200 bg-white/70 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="touch-target rounded-xl px-3 py-2 text-coffee-600 transition hover:bg-coffee-100"
            aria-label="前の月"
          >
            ‹
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-coffee-800 sm:text-xl">
              {viewYear}年 {MONTH_LABELS[viewMonth]}
            </h2>
            <button
              type="button"
              onClick={goToToday}
              className="mt-1 text-xs text-coffee-500 underline-offset-2 hover:underline"
            >
              今日に戻る
            </button>
          </div>
          <button
            type="button"
            onClick={goToNextMonth}
            className="touch-target rounded-xl px-3 py-2 text-coffee-600 transition hover:bg-coffee-100"
            aria-label="次の月"
          >
            ›
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-coffee-500 sm:text-sm">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} className={i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''}>
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const dateKey = formatDateKey(viewYear, viewMonth, day)
            const isSelected = dateKey === selectedDate
            const isToday = dateKey === todayKey
            const dayEvents = eventsByDate.get(dateKey) ?? []
            const dayOfWeek = (firstDay + day - 1) % 7

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => selectDay(day)}
                className={`touch-target relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition sm:text-base ${
                  isSelected
                    ? 'bg-coffee-600 text-cream shadow-sm'
                    : 'text-coffee-800 hover:bg-coffee-100'
                } ${!isSelected && dayOfWeek === 0 ? 'text-red-400' : ''} ${
                  !isSelected && dayOfWeek === 6 ? 'text-blue-400' : ''
                } ${isToday && !isSelected ? 'ring-2 ring-coffee-400 ring-offset-1' : ''}`}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <span
                    className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                      isSelected ? 'bg-cream' : 'bg-coffee-400'
                    }`}
                    aria-hidden
                  />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-coffee-200 bg-white/70 p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-coffee-800">
          {formatSelectedLabel()}の予定
        </h3>

        {selectedEvents.length === 0 ? (
          <p className="mb-4 text-sm text-coffee-500">予定はまだありません</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {selectedEvents.map((event) => (
              <li
                key={event.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-coffee-100 bg-coffee-50/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="font-medium text-coffee-800">{event.title}</p>
                  {event.time && (
                    <p className="text-xs text-coffee-500">{event.time}</p>
                  )}
                  {event.memo && (
                    <p className="mt-1 text-sm text-coffee-600">{event.memo}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteEvent(event.id)}
                  className="touch-target shrink-0 rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  aria-label={`${event.title}を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={addEvent} className="space-y-3 border-t border-coffee-100 pt-4">
          <p className="text-sm font-medium text-coffee-700">予定を追加</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル（必須）"
            className="w-full rounded-xl border border-coffee-200 bg-white px-3 py-2 text-sm text-coffee-800 placeholder:text-coffee-400 focus:border-coffee-400 focus:outline-none"
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white px-3 py-2 text-sm text-coffee-800 focus:border-coffee-400 focus:outline-none"
          />
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモ（任意）"
            rows={2}
            className="w-full resize-none rounded-xl border border-coffee-200 bg-white px-3 py-2 text-sm text-coffee-800 placeholder:text-coffee-400 focus:border-coffee-400 focus:outline-none"
          />
          <button
            type="submit"
            className="touch-target w-full rounded-xl bg-coffee-600 py-2.5 text-sm font-medium text-cream transition hover:bg-coffee-700"
          >
            保存する
          </button>
        </form>
      </section>
    </div>
  )
}
