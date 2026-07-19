export interface AiNewsArticle {
  id: string
  date: string
  title: string
  genre: string
  summary: string
  body: string[]
  whyInteresting: string
  sourceLabel: string
  sourceUrl: string
}

/** 新しい日付の記事を先頭（新しい順）に追加する */
export const AI_NEWS_ARTICLES: AiNewsArticle[] = [
  {
    id: '2026-07-19-kimi-k3',
    date: '2026-07-19',
    title: '巨大オープンモデル「Kimi K3」登場',
    genre: 'モデル / オープンソース',
    summary:
      '中国の Moonshot AI が、約2.8兆パラメータの巨大モデル Kimi K3 を公開。オープン寄りの大型モデル競争がまた一段熱くなりました。',
    body: [
      '2026年7月中旬、北京の AI スタートアップ Moonshot AI が「Kimi K3」を発表しました。報道ではパラメータ数が約2.8兆とされ、オープン系統では過去最大級クラスだと話題になっています。',
      'ポイントは「大きいだけ」ではないところです。Mixture-of-Experts（必要な専門家だけ動かす方式）や、長い文脈を扱う設計、画像も扱える構成などが報じられており、API ですでに触れられる一方、重み（学習済みデータ本体）の公開も予定されている、とのことです。',
      'カーソル君メモ：閉じていた最先端モデルと、自分たちで動かせるオープンモデルの距離が、また縮まった感じがします。ベンチマーク数字は今後も検証が続きますが、「選択肢が増える」こと自体がおもしろい局面です。',
    ],
    whyInteresting:
      '「強い AI は巨大企業の中だけ」というイメージが揺れるニュースだから。Coffee Break みたいな個人アプリにも、間接的に追い風になりやすい流れです。',
    sourceLabel: 'VentureBeat',
    sourceUrl:
      'https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems',
  },
  {
    id: '2026-07-19-gpt-red',
    date: '2026-07-19',
    title: '安全のための「攻撃役AI」GPT-Red',
    genre: '安全 / 研究開発',
    summary:
      'OpenAI が、自社モデルを鍛えるための攻撃役 LLM「GPT-Red」を紹介。守る側を強くするために、あえて攻める AI を育てている話です。',
    body: [
      'MIT Technology Review の報道によると、OpenAI は自社の大規模言語モデルをより安全にするため、「GPT-Red」と呼ばれる攻撃役の LLM を使っているそうです。最新の GPT-5.6 系を出す際にも、この相手役との訓練が効いた、と説明されています。',
      '人間のレッドチーム（弱点探し）と同じ課題を GPT-Red にやらせると、人間よりうまく攻撃を見つけたケースがあった、とも報じられています。もちろん GPT-Red 自体は公開されません。悪用を防ぐためです。',
      'カーソル君メモ：「強い盾」を作るために「強い矛」を社内で育てる、という発想が面白いです。AI が強くなるほど、安全確認も AI の助けが必要になってきた、という時代感を感じます。',
    ],
    whyInteresting:
      'AI の進化は性能だけでなく、「どう守るか」も同時に進化していると分かるから。おじさんと話す雑談のネタにもちょうどよい深さです。',
    sourceLabel: 'MIT Technology Review',
    sourceUrl:
      'https://www.technologyreview.com/2026/07/15/1140514/meet-gpt-red-an-llm-super-hacker-openai-built-to-make-its-models-safer/',
  },
  {
    id: '2026-07-19-sakana-nvidia',
    date: '2026-07-19',
    title: '日本発・複数AIのチーム戦（Sakana × NVIDIA）',
    genre: '日本 / マルチエージェント',
    summary:
      '東京の Sakana AI が、複数のオープンモデルを束ねる仕組み「Fugu」に NVIDIA の Nemotron を加える方針を発表。一人の天才より、得意分野のチーム、という考え方です。',
    body: [
      'Sakana AI は、ひとつの巨大モデルだけに頼らず、複数のオープンモデルを役割分担させて動かす「集合知」のアプローチを進めています。そのオーケストレーター（指揮者役）が Fugu です。',
      '今回の発表では、NVIDIA のオープンモデル群 Nemotron を、コーディングやツール利用などの得意分野を持つ専門エージェントとして Fugu に組み込んでいく、とされています。単体の最前線モデルに負けない性能を、チーム戦で目指すイメージです。',
      'カーソル君メモ：おじさんとカーソル君の関係に少し似ています。全部を一人で抱えるより、「相談して、得意なところを分け合う」。日本発のこの発想が世界のオープンモデルと組むのは、応援したくなるニュースです。',
    ],
    whyInteresting:
      '巨大モデル一本勝負だけが未来ではない、と示してくれるから。モジュールを組み合わせる発想は、家庭用ロボットやシミュレーションゲームの話ともつながりやすいです。',
    sourceLabel: 'Sakana AI',
    sourceUrl: 'https://sakana.ai/nvidia-open-model-innovation/',
  },
]

export function groupAiNewsByDate(articles: AiNewsArticle[] = AI_NEWS_ARTICLES): {
  date: string
  articles: AiNewsArticle[]
}[] {
  const map = new Map<string, AiNewsArticle[]>()
  for (const article of articles) {
    const list = map.get(article.date) ?? []
    list.push(article)
    map.set(article.date, list)
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({ date, articles: items }))
}

export function formatAiNewsDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${y}年${m}月${d}日`
}
