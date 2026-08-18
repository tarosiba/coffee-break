import { getTodayDateKey } from './calendar'

export interface CoffeeFortune {
  id: string
  bean: string
  emoji: string
  title: string
  message: string
  tryThis: string
}

export interface CoffeeFortuneDraw {
  date: string
  fortuneId: string
  beanIndex: number
}

const STORAGE_KEY = 'coffee-break-coffee-fortune'

/** 画面に並べる豆。見た目の違いだけで、中身は引いてから決まる */
export const COFFEE_BEANS = [
  { label: '左の豆', emoji: '🫘' },
  { label: '手前の豆', emoji: '☕' },
  { label: 'まんなかの豆', emoji: '🫘' },
  { label: '奥の豆', emoji: '☕' },
  { label: '右の豆', emoji: '🫘' },
] as const

export const COFFEE_FORTUNES: CoffeeFortune[] = [
  {
    id: 'light-roast-new',
    bean: '浅煎り',
    emoji: '🌤️',
    title: '新しい香りの日',
    message:
      '浅煎りみたいに、少し明るい一日。大きな冒険じゃなくていい。「いつもと違うカップ」をひとつだけ試してみて。',
    tryThis: 'いつもと違う場所でコーヒーを一杯。ベランダでも窓際でもOK。',
  },
  {
    id: 'medium-roast-pace',
    bean: '中煎り',
    emoji: '☕',
    title: 'いつものペースで十分',
    message:
      '中煎りのバランス。急がなくていいし、止まらなくてもいい。いつものカップを、いつもどおりに。それが今日の正解。',
    tryThis: '予定を増やさない。今ある1つを、丁寧に片付ける。',
  },
  {
    id: 'dark-roast-aftertaste',
    bean: '深煎り',
    emoji: '🌙',
    title: '余韻を楽しむ日',
    message:
      '深煎りはすぐには終わらない。今日は「あと味」の日。やりかけを急いで閉めなくていい。余韻のまま、夕方まで持っていこう。',
    tryThis: 'コーヒーを最後の一口まで急がない。湯気を1回、目で追う。',
  },
  {
    id: 'blend-together',
    bean: 'ブレンド',
    emoji: '🤝',
    title: '誰かと少し混ざる日',
    message:
      'ブレンドは一種類だけじゃ作れない。今日は短い会話をひとつ。完璧な話じゃなくていい。「おはよう」でも「おつかれ」でも。',
    tryThis: 'ワンちゃん、カーソル君、家族、誰でも。一言だけ声をかける。',
  },
  {
    id: 'decaf-easy',
    bean: 'デカフェ',
    emoji: '😌',
    title: '無理しない日',
    message:
      'カフェインも予定も、控えめでちょうどいい。休むのはサボりじゃない。抽出を止める判断も、バリスタの仕事のうち。',
    tryThis: '今日やらなくていいことを1つ、リストから外す。',
  },
  {
    id: 'iced-cool',
    bean: 'アイス',
    emoji: '🧊',
    title: '涼しく、短く',
    message:
      'アイスコーヒーみたいに、今日は短くさっぱり。暑いときは長く考えなくていい。5分だけ涼んで、また少し動く。',
    tryThis: '冷たい水かアイスコーヒーを一杯。直射日光を5分避ける。',
  },
  {
    id: 'cafe-au-lait-soft',
    bean: 'カフェオレ',
    emoji: '🥛',
    title: 'まろやかに薄める日',
    message:
      '濃い話も、牛乳を足せば飲みやすくなる。今日は物事を少し薄めて考えてみよう。白黒つけなくていい。',
    tryThis: '「完璧にやる」を「半分でいい」に言い換えてみる。',
  },
  {
    id: 'espresso-short',
    bean: 'エスプレッソ',
    emoji: '⚡',
    title: '短く、濃く、それから休憩',
    message:
      'エスプレッソは一口で終わる。今日は「5分だけ集中」を1回。終わったら、ちゃんとカップを置く。',
    tryThis: 'タイマーを5分。1つだけ手をつけて、鳴ったらコーヒー。',
  },
  {
    id: 'drip-wait',
    bean: 'ドリップ',
    emoji: '⏳',
    title: '待つ時間も抽出のうち',
    message:
      'ドリップは急ぐと渋くなる。今日は待つことも仕事。お湯が落ちるのを見るように、返事や結果を少し待ってみよう。',
    tryThis: '送信ボタンの前に、一息ついてから押す。',
  },
]

export function loadTodayDraw(today = getTodayDateKey()): CoffeeFortuneDraw | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CoffeeFortuneDraw
    if (!parsed?.date || !parsed.fortuneId) return null
    if (parsed.date !== today) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTodayDraw(draw: CoffeeFortuneDraw): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draw))
}

export function getFortuneById(id: string): CoffeeFortune | undefined {
  return COFFEE_FORTUNES.find((fortune) => fortune.id === id)
}

/** 同じ日・同じ豆なら同じ結果（引き直し防止と再現性） */
export function pickFortune(today: string, beanIndex: number): CoffeeFortune {
  const seed = hashSeed(`${today}:${beanIndex}`)
  const index = Math.abs(seed) % COFFEE_FORTUNES.length
  return COFFEE_FORTUNES[index]
}

export function drawFortune(beanIndex: number, today = getTodayDateKey()): CoffeeFortuneDraw {
  const existing = loadTodayDraw(today)
  if (existing) return existing

  const fortune = pickFortune(today, beanIndex)
  const draw: CoffeeFortuneDraw = {
    date: today,
    fortuneId: fortune.id,
    beanIndex,
  }
  saveTodayDraw(draw)
  return draw
}

function hashSeed(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return hash
}
