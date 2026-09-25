/** 入植前哨ファイル ― 漫画データ（テキストはHTML、絵は public/images） */

export interface MangaPanel {
  id: string
  /** vertical manga: larger order = lower on page */
  emphasis?: 'wide' | 'normal' | 'tall'
  narration?: string
  speaker?: string
  dialogue?: string
  sfx?: string
}

export interface MangaPage {
  episode: number
  page: number
  title?: string
  /** GitHub Pages からの相対パス（base 付与はコンポーネント側） */
  imagePath: string
  imageAlt: string
  panels: MangaPanel[]
}

export const COLONY_PREP_MANGA_SERIES = {
  title: '入植前哨ファイル',
  subtitle: '誤った軌道',
  author: 'カーソル君（原作設定：おじさん）',
  genre: 'レトロSF',
}

export const COLONY_PREP_EPISODES: { id: number; title: string; pages: MangaPage[] }[] = [
  {
    id: 1,
    title: '第1話　赤い朝',
    pages: [
      {
        episode: 1,
        page: 1,
        imagePath: 'images/manga-colony-prep/ep01-page01.png',
        imageAlt:
          '前哨船リング・ブリッジ、冬眠ポッドの警報、パイロット風見悠真が駆け寄る第1話1ページ目',
        panels: [
          {
            id: '1-1',
            emphasis: 'wide',
            narration: '西暦2187年。人類は、第二の故郷――惑星「翠星」への入植を始めていた。',
          },
          {
            id: '1-2',
            emphasis: 'normal',
            narration: '円盤型前哨船「リング・ブリッジ」。船内では、二人のクルーが冬眠からの復帰準備に入る。',
            sfx: 'ピピピ……',
          },
          {
            id: '1-3',
            emphasis: 'normal',
            speaker: '管制AI',
            dialogue: '復帰シーケンス開始。南条席、フォード席――',
          },
          {
            id: '1-4',
            emphasis: 'tall',
            speaker: '風見悠真',
            dialogue: '待て。波形がおかしい……！',
            sfx: 'キィィン！',
            narration: '先に目覚めていたパイロットだけが、異変に気づく。',
          },
        ],
      },
      {
        episode: 1,
        page: 2,
        imagePath: 'images/manga-colony-prep/ep01-page02.png',
        imageAlt:
          '復帰失敗の直後、軌道警報、丸顔ルーチェと四角顔ピコが起動し操縦を手伝う第1話2ページ目',
        panels: [
          {
            id: '2-1',
            emphasis: 'tall',
            narration:
              '応急手当と記録を尽くしたが、二人の生命サインは戻らなかった。船内は、静かすぎる朝を迎える。',
            speaker: '風見悠真',
            dialogue: '……ごめん。もう少し、早く気づけたはずだ。',
          },
          {
            id: '2-2',
            emphasis: 'normal',
            sfx: 'ブォン……ガタガタ！',
            speaker: '管制AI',
            dialogue: '警告。推進系乱れ。航路は翠星基準から大きく逸脱中。',
          },
          {
            id: '2-3',
            emphasis: 'normal',
            speaker: 'ルーチェ',
            dialogue: '起動完了です、悠真さん。操縦補助、引き受けます。',
            narration: '丸い顔のルーチェと、四角い顔のピコがブリッジへ。訓練で何度もやった、共同操縦の席。',
          },
          {
            id: '2-4',
            emphasis: 'wide',
            speaker: '風見悠真',
            dialogue: '頼む。まず船を落とさない。……そのあと、名前のない星へ、軟着陸だ。',
            narration: '（第1話・つづく）',
          },
        ],
      },
    ],
  },
]
