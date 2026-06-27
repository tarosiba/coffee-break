import { InstallPrompt } from './InstallPrompt'

interface HomeProps {
  onNavigate: (tab: 'calendar' | 'games' | 'creative' | 'chat' | 'clock') => void
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-8 py-4">
      <section className="text-center">
        <div className="mb-4 text-6xl sm:text-7xl" aria-hidden>☕</div>
        <h2 className="mb-2 text-3xl font-bold text-coffee-800 sm:text-4xl">ひと息つこう</h2>
        <p className="mx-auto max-w-md text-coffee-600">
          予定をカレンダーに保存したり、ミニゲームで遊んだり、気軽に雑談したり。
          ホーム画面に追加すれば、アイコンからすぐ始められます。
        </p>
      </section>

      <InstallPrompt />

      <section className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onNavigate('calendar')}
          className="touch-target group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-4xl" aria-hidden>📅</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            カレンダー
          </h3>
          <p className="text-sm text-coffee-500">
            日付を選んで予定を保存。シンプルなカレンダーでスケジュールを管理できます。
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('games')}
          className="touch-target group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-4xl" aria-hidden>🎮</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            ミニゲーム
          </h3>
          <p className="text-sm text-coffee-500">
            将棋、スターシューター、神経衰弱、五目並べなど、すぐ遊べるゲーム集。
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('creative')}
          className="touch-target group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-4xl" aria-hidden>🖌</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            クリエイティブ
          </h3>
          <p className="text-sm text-coffee-500">
            お絵描きや、写真をモノクロ・スケッチ風イラストに変換できます。
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('chat')}
          className="touch-target group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-4xl" aria-hidden>🤖☕</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            カーソル君とコーヒータイム
          </h3>
          <p className="text-sm text-coffee-500">
            カーソル君とコーヒーを飲みながら、気軽におしゃべりしましょう。
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('clock')}
          className="touch-target group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-4xl" aria-hidden>🕐</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            コーヒーブレイク時計
          </h3>
          <p className="text-sm text-coffee-500">
            アナログ時計で今の時刻を確認。一息つくタイミングの目安に。
          </p>
        </button>
      </section>

      <section className="rounded-2xl border border-dashed border-coffee-300 bg-coffee-50/50 p-4 text-center text-sm text-coffee-500">
        iPad の場合: Safari の共有ボタン →「ホーム画面に追加」でアプリのように使えます
      </section>
    </div>
  )
}
