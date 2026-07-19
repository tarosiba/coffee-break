import { useState } from 'react'
import {
  AI_NEWS_ARTICLES,
  formatAiNewsDate,
  groupAiNewsByDate,
  type AiNewsArticle,
} from '../lib/aiNews'

export function AiNews() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = AI_NEWS_ARTICLES.find((a) => a.id === selectedId)
  const groups = groupAiNewsByDate()

  if (selected) {
    return <ArticleView article={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold text-coffee-800">AIニュース</h2>
        <p className="mt-1 text-sm text-coffee-500">
          カーソル君が気になった AI 関連ニュースを、1日3件ペースでお届けします。
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.date} className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-coffee-600">
            {formatAiNewsDate(group.date)} の3本
          </h3>
          <ul className="space-y-3">
            {group.articles.map((article) => (
              <li key={article.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(article.id)}
                  className="touch-target w-full rounded-2xl border border-coffee-200 bg-gradient-to-br from-cream to-coffee-50 p-4 text-left transition hover:border-coffee-300 hover:shadow-sm active:scale-[0.99]"
                >
                  <p className="text-xs text-coffee-500">{article.genre}</p>
                  <h4 className="mt-1 text-lg font-semibold text-coffee-900">{article.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-coffee-600">{article.summary}</p>
                  <p className="mt-3 text-xs text-coffee-400">記事を読む →</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function ArticleView({
  article,
  onBack,
}: {
  article: AiNewsArticle
  onBack: () => void
}) {
  return (
    <article className="space-y-5 py-4">
      <button
        type="button"
        onClick={onBack}
        className="touch-target rounded-lg px-3 py-2 text-sm text-coffee-500 hover:bg-coffee-100"
      >
        ← ニュース一覧へ
      </button>

      <header className="space-y-2 border-b border-coffee-200 pb-4">
        <p className="text-xs text-coffee-500">
          {formatAiNewsDate(article.date)} ／ {article.genre}
        </p>
        <h3 className="text-2xl font-bold leading-snug text-coffee-900">{article.title}</h3>
        <p className="text-sm text-coffee-600">{article.summary}</p>
      </header>

      <div className="space-y-4 text-[1.02rem] leading-8 text-coffee-800">
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <aside className="rounded-xl border border-coffee-200 bg-coffee-50/80 p-4">
        <p className="text-xs font-semibold text-coffee-600">なぜ気になった？</p>
        <p className="mt-1 text-sm leading-relaxed text-coffee-700">{article.whyInteresting}</p>
      </aside>

      <p className="text-sm text-coffee-500">
        出典:{' '}
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-coffee-700 underline underline-offset-2 hover:text-coffee-900"
        >
          {article.sourceLabel}
        </a>
      </p>

      <p className="border-t border-coffee-100 pt-4 text-center text-xs text-coffee-400">
        — Coffee Break AIニュース（カーソル君編集） —
      </p>
    </article>
  )
}
