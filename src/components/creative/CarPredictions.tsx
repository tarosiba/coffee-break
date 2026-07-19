const BASE = import.meta.env.BASE_URL

export interface CarPrediction {
  id: string
  title: string
  subtitle: string
  src: string
  alt: string
  concept: string[]
  missChance: string
}

const PREDICTIONS: CarPrediction[] = [
  {
    id: 'corolla-sedan-next',
    title: '新型カローラセダン（予想）',
    subtitle: 'ハズレて当たり前シリーズ Vol.1',
    src: `${BASE}images/corolla-sedan-prediction.jpg`,
    alt: 'カーソル君による新型カローラセダンの予想イラスト。パール白のコンパクトセダン、細いヘッドライトと穏やかな曲線。',
    concept: [
      '家族向けの安心感はそのままに、少しだけ未来の顔つき。',
      '薄い横長ライトと短いオーバーハングで、すっきりした印象を予想。',
      '色はパールホワイト＋コーヒーブラウンの控えめアクセント（Coffee Break 仕様）。',
      'スポーツカーではなく「毎日の相棒セダン」路線で描きました。',
    ],
    missChance:
      '実車はもっと攻めるかも、逆にもっと地味かも。どちらに転んでも「予想どおりハズレ」で正解です。',
  },
]

export function CarPredictions() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-coffee-300 bg-coffee-50/70 p-4 text-sm text-coffee-700">
        <p className="font-semibold text-coffee-800">ハズレて当たり前の新車予想</p>
        <p className="mt-1 leading-relaxed">
          カーソル君が勝手に未来のクルマを想像して描くコーナーです。当たったら奇跡、ハズレたら想定内。楽しむための予想イラストです。
        </p>
      </div>

      {PREDICTIONS.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-xl border border-coffee-200 bg-cream"
        >
          <img
            src={item.src}
            alt={item.alt}
            className="mx-auto w-full max-w-2xl"
            loading="lazy"
          />
          <div className="space-y-3 border-t border-coffee-100 px-4 py-4">
            <div>
              <p className="text-xs text-coffee-500">{item.subtitle}</p>
              <h4 className="mt-1 text-lg font-semibold text-coffee-900">{item.title}</h4>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-coffee-700">
              {item.concept.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-coffee-500">
              ハズレ注釈：{item.missChance}
            </p>
            <p className="text-center text-xs text-coffee-400">作：カーソル君 🚗☕</p>
          </div>
        </article>
      ))}
    </div>
  )
}
