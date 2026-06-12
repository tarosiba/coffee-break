import { useState } from 'react'
import { Header } from './components/Header'
import { Home } from './components/Home'
import { Games } from './components/Games'
import { Chat } from './components/Chat'
import type { Tab } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto max-w-3xl px-4 pb-8">
        {activeTab === 'home' && (
          <Home onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'games' && <Games />}
        {activeTab === 'chat' && <Chat />}
      </main>
    </div>
  )
}
