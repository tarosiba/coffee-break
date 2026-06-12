interface HomeProps {
  onNavigate: (tab: 'games' | 'chat') => void
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-8 py-4">
      <section className="text-center">
        <div className="mb-4 text-6xl" aria-hidden>☕</div>
        <h2 className="mb-2 text-3xl font-bold text-coffee-800">ひと息つこう</h2>
        <p className="mx-auto max-w-md text-coffee-600">
          仕事の合間に、コーヒーを片手にミニゲームで遊んだり、気軽に雑談したり。
          ちょっとした休憩のためのアプリです。
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onNavigate('games')}
          className="group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-3xl" aria-hidden>🎮</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            ミニゲーム
          </h3>
          <p className="text-sm text-coffee-500">
            じゃんけん、数当て、三目並べなど、すぐ遊べるゲームを用意しています。
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('chat')}
          className="group rounded-2xl border border-coffee-200 bg-white/70 p-6 text-left shadow-sm transition hover:border-coffee-300 hover:shadow-md"
        >
          <span className="mb-3 block text-3xl" aria-hidden>💬</span>
          <h3 className="mb-1 text-lg font-semibold text-coffee-800 group-hover:text-coffee-600">
            雑談ルーム
          </h3>
          <p className="text-sm text-coffee-500">
            気軽にメッセージを送って、コーヒーブレイク仲間とおしゃべりしましょう。
          </p>
        </button>
      </section>

      <section className="rounded-2xl border border-dashed border-coffee-300 bg-coffee-50/50 p-4 text-center text-sm text-coffee-500">
        💡 ヒント: 上のタブからいつでもゲームや雑談に切り替えられます
      </section>
    </div>
  )
}
