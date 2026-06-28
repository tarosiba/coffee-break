export type Tab = 'home' | 'calendar' | 'games' | 'creative' | 'chat' | 'clock' | 'memo'

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
  | 'shogi'
  | 'galaxy-shooter'
  | 'othello'
  | 'air-hockey'
  | 'checkers'
  | 'soccer'

export interface ChatMessage {
  id: string
  author: string
  text: string
  timestamp: Date
  isBot?: boolean
}
