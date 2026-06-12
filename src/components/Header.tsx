import type { Tab } from '../types'

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'ホーム', icon: '☕' },
  { id: 'games', label: 'ゲーム', icon: '🎮' },
  { id: 'chat', label: '雑談', icon: '💬' },
]

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-coffee-200/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>☕</span>
          <h1 className="text-lg font-bold tracking-tight text-coffee-800">Coffee Break</h1>
        </div>
        <nav className="flex gap-1 rounded-full bg-coffee-100/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-coffee-600 text-cream shadow-sm'
                  : 'text-coffee-600 hover:bg-coffee-200/60'
              }`}
            >
              <span className="mr-1" aria-hidden>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
