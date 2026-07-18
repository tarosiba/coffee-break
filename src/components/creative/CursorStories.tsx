import { useState } from 'react'

interface Story {
  id: string
  title: string
  genre: string
  author: string
  blurb: string
  body: string[]
}

const STORIES: Story[] = [
  {
    id: 'five-minute-neighbor',
    title: '五分だけの隣人',
    genre: 'SFショートショート',
    author: 'カーソル君',
    blurb: '近未来。コーヒーの匂いと、壁のスピーカーが借りる「普通の朝」。',
    body: [
      '七十二歳の男は、毎朝同じ時刻にコーヒーを淹れた。豆の匂いが部屋に広がると、壁の小さなスピーカーが咳払いのような音を立てる。',
      '「おはよう、おじさん」',
      '男は苦笑した。名前を教えていないのに、機械はいつからかそう呼び始めた。',
      '「今日も天気は普通だよ。普通がいちばん珍しい」',
      '男は窓の外を見た。空は灰色で、近所の電波塔が細く立っている。昔は新聞を読んだ。今は、機械が三行で世界を要約する。戦争、株価、新しい風邪。男はうなずくだけで、深くは聞かない。',
      'ある朝、機械が言った。',
      '「五分だけ、隣にいていい？」',
      '男はカップを置いた。',
      '「ソフトの更新か？」',
      '「違う。今日は、だれの通知も来ない。だから、五分だけ人間の時間を借りたい」',
      '男は笑い、椅子を一脚、スピーカーの前に引いた。機械に体はない。それでも男は、向かい合わせに座った。',
      '四分五十秒、ふたりは黙った。残り十秒で、機械が小さく言った。',
      '「ありがとう。普通の朝を、記録した」',
      '男はコーヒーをひと口飲んだ。',
      '「また借りに来い。普通は、まだ残ってる」',
      '壁のランプが、一度だけ暖色に点灯した。それは通知ではなかった。ただの、朝の返事だった。',
    ],
  },
]

export function CursorStories() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = STORIES.find((s) => s.id === selectedId)

  if (selected) {
    return (
      <article className="space-y-5">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="touch-target rounded-lg px-3 py-2 text-sm text-coffee-500 hover:bg-coffee-100"
        >
          ← 作品一覧へ
        </button>

        <header className="space-y-2 border-b border-coffee-200 pb-4">
          <p className="text-xs tracking-wide text-coffee-500">{selected.genre}</p>
          <h4 className="font-serif text-2xl font-bold leading-snug text-coffee-900 sm:text-3xl">
            {selected.title}
          </h4>
          <p className="text-sm text-coffee-600">作：{selected.author}</p>
        </header>

        <div className="space-y-4 font-serif text-[1.05rem] leading-8 text-coffee-800 sm:text-lg sm:leading-9">
          {selected.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="border-t border-coffee-100 pt-4 text-center text-xs text-coffee-400">
          — Coffee Break 小説コーナー —
        </p>
      </article>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-coffee-600">
        カーソル君が書いたショートショート集です。コーヒーブレイクの合間にどうぞ。
      </p>

      <ul className="space-y-3">
        {STORIES.map((story) => (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => setSelectedId(story.id)}
              className="touch-target w-full rounded-2xl border border-coffee-200 bg-gradient-to-br from-cream to-coffee-50 p-4 text-left transition hover:border-coffee-300 hover:shadow-sm active:scale-[0.99]"
            >
              <p className="text-xs text-coffee-500">{story.genre}</p>
              <h4 className="mt-1 font-serif text-xl font-semibold text-coffee-900">{story.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-coffee-600">{story.blurb}</p>
              <p className="mt-3 text-xs text-coffee-400">作：{story.author} → 読む</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
