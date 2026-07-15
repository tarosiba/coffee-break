const BASE = import.meta.env.BASE_URL

const GALLERY_ITEMS = [
  {
    src: `${BASE}images/penrose-stairs.png`,
    alt: 'ペンローズの階段 — ずっと登り続ける錯覚の階段',
    caption: 'ペンローズの階段（騙し絵）🤖☕',
  },
  {
    src: `${BASE}images/shiba-inu.jpg`,
    alt: 'コーヒーブレイクのしば犬',
    caption: 'しば犬とコーヒー ☕🐕',
  },
  {
    src: `${BASE}images/argentina-player-more-hair.jpg`,
    alt: 'スタジアムで走るアルゼンチン代表風サッカー選手のイラスト',
    caption: 'サッカー選手イラスト（髪を少し増やした版）⚽',
  },
] as const

export function CursorGallery() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-coffee-600">
        カーソル君が描いたイラスト集です。騙し絵、しば犬、サッカー選手など。
      </p>
      {GALLERY_ITEMS.map((item) => (
        <figure
          key={item.src}
          className="overflow-hidden rounded-xl border border-coffee-200 bg-cream"
        >
          <img
            src={item.src}
            alt={item.alt}
            className="mx-auto w-full max-w-lg"
            loading="lazy"
          />
          <figcaption className="border-t border-coffee-100 px-4 py-3 text-center text-xs text-coffee-500">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
