const BASE = import.meta.env.BASE_URL

const GALLERY_ITEMS = [
  {
    src: `${BASE}images/ojisan-wan-robot-coffee.jpg`,
    alt: 'おじさん・しば犬ワンちゃん・ロボット君がコーヒーを飲むモノクロ漫画イラスト。65歳の白髪のおじさん、首輪の柴犬、丸い頭のロボットがテーブルを囲む。',
    caption: 'おじさん・ワンちゃん・ロボット君のコーヒーブレイク ☕🤖🐕',
  },
  {
    src: `${BASE}images/smart-living-room.jpg`,
    alt: '夕暮れの街並みが見えるスマートリビングルーム。間接照明、薄型テレビ、観葉植物、モジュールソファのある洗練された室内。',
    caption: 'スマートリビングルーム（売り出し中のモデルルーム風）🏙️✨',
  },
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
  {
    src: `${BASE}images/adventure-no-signs.jpg`,
    alt: '壁を突き破るサッカー選手と大冒険のイラスト（看板なし）',
    caption: '大冒険イラスト（看板なし版）🏃⚽🐕',
  },
] as const

export function CursorGallery() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-coffee-600">
        カーソル君が描いたイラスト集です。おじさんと仲間たち、インテリア、騙し絵、しば犬、サッカー選手など。
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
