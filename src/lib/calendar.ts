import type { CalendarEvent } from '../types'

const STORAGE_KEY = 'coffee-break-calendar-events'

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CalendarEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

export const MONTH_LABELS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
] as const
