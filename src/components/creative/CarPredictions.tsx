const BASE = import.meta.env.BASE_URL

export interface MissPrediction {
  id: string
  title: string
  subtitle: string
  src: string
  alt: string
  concept: string[]
  specs?: { label: string; value: string }[]
  missChance: string
}

const PREDICTIONS: MissPrediction[] = [
  {
    id: 'apple-glasses-1',
    title: 'Apple Glasses（予想）',
    subtitle: 'ハズレて当たり前シリーズ Vol.2（ガジェット編）',
    src: `${BASE}images/apple-glasses-prediction.jpg`,
    alt: 'カーソル君によるApple Glasses予想イラスト。薄いシャンパンゴールドのフレームと、淡い青のAR光をまとったスマートグラス。',
    concept: [
      '見た目は普通の薄型メガネに寄せる。ゴツいヘッドセット感は出さない路線。',
      'ヒンジ付近に小さなカメラ／センサーを忍ばせ、正面はクリーンに。',
      'レンズ縁にごく薄いARの光。常時ベタ塗りHUDではなく、必要なときだけ出る感じ。',
      '色はシャンパンゴールド寄り（Coffee Break のクリーム基調と相性よさげ）。',
    ],
    specs: [
      { label: '重量', value: '約38〜45g（一日かけても平気な軽さ狙い）' },
      { label: '表示', value: '導波路＋マイクロOLED。視野角は控えめでも文字が読める実用重視' },
      { label: '電池', value: '本体2〜3時間＋ケースで終日。ケースが充電ドック兼用' },
      { label: '接続', value: 'iPhone と超近距離連携が主。単独でも簡易AI応答は可能' },
      { label: '操作', value: '指先ジェスチャー＋小声ボイス＋テンプルタッチの三刀流' },
      { label: 'カメラ', value: '超小型。写真より「見て覚える」用途（翻訳・案内・メモ）' },
      { label: '価格（予想）', value: 'エントリー約12〜15万円、上位約20万円前後…たぶんハズレ' },
    ],
    missChance:
      '実物はもっと高い／もっと遅い／名前すら違うかもしれません。当たったら奇跡、ハズレて当たり前です。',
  },
  {
    id: 'corolla-sedan-next',
    title: '新型カローラセダン（予想）',
    subtitle: 'ハズレて当たり前シリーズ Vol.1（クルマ編）',
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
        <p className="font-semibold text-coffee-800">ハズレて当たり前の予想イラスト</p>
        <p className="mt-1 leading-relaxed">
          クルマでもガジェットでも、カーソル君が勝手に未来を想像して描くコーナーです。当たったら奇跡、ハズレたら想定内。
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
            {item.specs && item.specs.length > 0 && (
              <div className="rounded-lg border border-coffee-200 bg-white/70 p-3">
                <p className="mb-2 text-xs font-semibold text-coffee-600">性能・仕様の予想（あくまで想像）</p>
                <dl className="space-y-1.5 text-sm text-coffee-700">
                  {item.specs.map((spec) => (
                    <div key={spec.label} className="grid grid-cols-[5.5rem_1fr] gap-2 sm:grid-cols-[6.5rem_1fr]">
                      <dt className="font-medium text-coffee-800">{spec.label}</dt>
                      <dd className="leading-relaxed">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <p className="text-xs leading-relaxed text-coffee-500">
              ハズレ注釈：{item.missChance}
            </p>
            <p className="text-center text-xs text-coffee-400">作：カーソル君 ✨☕</p>
          </div>
        </article>
      ))}
    </div>
  )
}
