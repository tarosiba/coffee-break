export type Tab = 'home' | 'calendar' | 'games' | 'chat'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  memo?: string
}

export type GameId =
  | 'janken'
  | 'number-guess'
  | 'tic-tac-toe'
  | 'memory'
  | 'gomoku'
  | 'life-board'
  | 'terrain-showcase'

export interface ChatMessage {
  id: string
  author: string
  text: string
  timestamp: Date
  isBot?: boolean
}
