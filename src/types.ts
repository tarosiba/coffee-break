export type Tab = 'home' | 'games' | 'chat'

export type GameId =
  | 'janken'
  | 'number-guess'
  | 'tic-tac-toe'
  | 'memory'
  | 'gomoku'
  | 'life-board'

export interface ChatMessage {
  id: string
  author: string
  text: string
  timestamp: Date
  isBot?: boolean
}
