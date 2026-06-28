import { useState } from 'react'
import { Header } from './components/Header'
import { Home } from './components/Home'
import { Games } from './components/Games'
import { Calendar } from './components/Calendar'
import { Chat } from './components/Chat'
import { Creative } from './components/Creative'
import { Clock } from './components/Clock'
import { Memo } from './components/Memo'
import type { Tab } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <div className="min-h-screen min-h-dvh">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto max-w-4xl px-4 pb-8">
        {activeTab === 'home' && (
          <Home onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'games' && <Games />}
        {activeTab === 'creative' && <Creative />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'clock' && <Clock />}
        {activeTab === 'memo' && <Memo />}
      </main>
    </div>
  )
}
