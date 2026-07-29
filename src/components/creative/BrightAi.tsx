import { useState } from 'react'
import {
  BRIGHT_AI_ARTICLES,
  formatBrightAiDate,
  type BrightAiArticle,
} from '../../lib/brightAi'

export function BrightAi() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = BRIGHT_AI_ARTICLES.find((a) => a.id === selectedId)

  if (selected) {
    return <ArticleView article={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-cream p-4">
        <p className="text-sm leading-relaxed text-coffee-700">
          しんどいニュースが続くときこそ、暮らしを少し楽にする AI の使い方を。
          カーソル君が「明るい技」としてまとめます。難しい話より、今日試せる一手を。
        </p>
      </div>

      <ul className="space-y-3">
        {BRIGHT_AI_ARTICLES.map((article) => (
          <li key={article.id}>
            <button
              type="button"
              onClick={() => setSelectedId(article.id)}
              className="touch-target w-full rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/50 p-4 text-left transition hover:border-amber-300 hover:shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden>
                  {article.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-amber-700/80">{article.category}</p>
                  <h4 className="mt-1 font-semibold text-coffee-900">{article.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-coffee-600">{article.summary}</p>
                  <p className="mt-3 text-xs text-coffee-400">読む →</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ArticleView({
  article,
  onBack,
}: {
  article: BrightAiArticle
  onBack: () => void
}) {
  return (
    <article className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="touch-target rounded-lg px-3 py-2 text-sm text-coffee-500 hover:bg-coffee-100"
      >
        ← 明るいAI一覧へ
      </button>

      <header className="space-y-2 border-b border-amber-200/60 pb-4">
        <p className="text-xs text-amber-700/80">
          {formatBrightAiDate(article.date)} ／ {article.category}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {article.icon}
          </span>
          <h4 className="text-2xl font-bold leading-snug text-coffee-900">{article.title}</h4>
        </div>
        <p className="text-sm text-coffee-600">{article.summary}</p>
      </header>

      <div className="space-y-4 text-[1.02rem] leading-8 text-coffee-800">
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <aside className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <p className="text-xs font-semibold text-amber-800">今日試せる一手</p>
        <p className="mt-1 text-sm leading-relaxed text-coffee-800">{article.tryThis}</p>
      </aside>

      <p className="border-t border-coffee-100 pt-4 text-center text-xs text-coffee-400">
        — Coffee Break 明るいAI（カーソル君より） —
      </p>
    </article>
  )
}
