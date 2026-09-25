import { COLONY_PREP_EPISODES, COLONY_PREP_MANGA_SERIES } from '../../lib/colonyPrepManga'

const BASE = import.meta.env.BASE_URL

function panelClass(emphasis?: 'wide' | 'normal' | 'tall'): string {
  switch (emphasis) {
    case 'wide':
      return 'min-h-[4.5rem] sm:min-h-[5.5rem]'
    case 'tall':
      return 'min-h-[6.5rem] sm:min-h-[7.5rem]'
    default:
      return 'min-h-[4rem] sm:min-h-[5rem]'
  }
}

export function ColonyPrepManga() {
  const episode = COLONY_PREP_EPISODES[0]

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-coffee-200 pb-4">
        <p className="text-xs font-medium tracking-wide text-coffee-500">Coffee Break 漫画コーナー</p>
        <h3 className="text-xl font-bold text-coffee-900">{COLONY_PREP_MANGA_SERIES.title}</h3>
        <p className="text-sm text-coffee-600">{COLONY_PREP_MANGA_SERIES.subtitle}</p>
        <p className="text-xs text-coffee-400">
          {COLONY_PREP_MANGA_SERIES.genre}／{COLONY_PREP_MANGA_SERIES.author}
        </p>
        <p className="text-sm font-semibold text-coffee-800">{episode.title}</p>
        <p className="text-xs leading-relaxed text-coffee-500">
          レトロSF風オリジナル。人間3名・自立型ロボット2体の前哨船が、冬眠トラブルと軌道逸脱のあと、未確認惑星へ向かう物語。
        </p>
      </header>

      {episode.pages.map((page) => (
        <article
          key={`ep${page.episode}-p${page.page}`}
          className="overflow-hidden rounded-2xl border-2 border-coffee-900/80 bg-[#f5f0e8] shadow-md"
        >
          <div className="border-b border-coffee-900/20 bg-coffee-800 px-3 py-1.5 text-center text-xs font-bold text-coffee-50">
            {episode.title} — {page.page}ページ
          </div>

          <img
            src={`${BASE}${page.imagePath}`}
            alt={page.imageAlt}
            className="w-full border-b border-coffee-900/30 bg-white object-cover"
            loading="lazy"
          />

          <div className="space-y-0 divide-y divide-coffee-900/15 p-2 sm:p-3">
            {page.panels.map((panel) => (
              <div
                key={panel.id}
                className={`relative border border-coffee-900/25 bg-white/90 p-3 ${panelClass(panel.emphasis)}`}
              >
                {panel.narration && (
                  <p className="mb-2 text-xs leading-relaxed text-coffee-700">{panel.narration}</p>
                )}
                {panel.sfx && (
                  <p className="mb-1 text-right font-bold tracking-widest text-coffee-800">{panel.sfx}</p>
                )}
                {panel.dialogue && (
                  <div className="flex flex-col gap-1">
                    {panel.speaker && (
                      <span className="text-[10px] font-bold text-coffee-500">{panel.speaker}</span>
                    )}
                    <p className="rounded-xl border border-coffee-300 bg-coffee-50 px-3 py-2 text-sm leading-relaxed text-coffee-900">
                      {panel.dialogue}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}

      <p className="text-center text-xs text-coffee-400">第1話は現在2ページまで公開。続きはのんびり追加します。</p>
    </div>
  )
}
