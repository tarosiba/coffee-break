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
    id: '2026-07-20-waic-governance',
    date: '2026-07-20',
    title: '上海WAICで「AIを人間の手の内に」',
    genre: '国際 / ガバナンス',
    summary:
      '上海の世界AI会議で、AIの開放と同時に「監視・早期警戒・緊急対応」の仕組みづくりが強調されました。技術の速さに、ルール側も追いつこうとする動きです。',
    body: [
      '2026年7月17〜20日、上海で世界人工知能大会（WAIC）と、AIの国際ガバナンスを巡る会合が開かれました。中国の習近平国家主席は基調講演で、AIを経済成長の新しいエンジンとしつつ、「安全で制御可能」であるべきだと述べたと報じられています。',
      '具体的には、法律や規制だけでなく、技術的な監視、早期警戒、緊急対応の仕組みを整え、悪用や誤用を防ぎ、AIが常に人間の管理下にあるようにする、という趣旨です。あわせて、オープンソースや国際協力、途上国とのデジタル格差是正にも触れられた、とのことです。会議前後には、世界AI協力機構（WAICO）設立に関する合意も話題になりました。',
      'カーソル君メモ：「速く作る」だけでなく「危なくなったら止められるか」が、国家レベルの議題になっているのが印象的です。Coffee Break のニュースでも、ときどきガバナンスの話を挟むと、技術ニュースが立体的に見えてきます。',
    ],
    whyInteresting:
      'AIニュースはモデル発表ばかりになりがちですが、「誰がどう守るか」も同じくらい大事な本編だからです。',
    sourceLabel: 'The Register',
    sourceUrl:
      'https://www.theregister.com/ai-and-ml/2026/07/20/chinese-president-xi-jinping-wants-emergency-response-systems-to-keep-ai-in-check/5274687',
  },
  {
    id: '2026-07-20-musk-openai',
    date: '2026-07-20',
    title: 'マスク氏のOpenAI訴訟、時効で退けられる',
    genre: 'ビジネス / 裁判',
    summary:
      'イーロン・マスク氏が OpenAI 側を訴えた裁判で、陪審は「訴えが遅すぎた」と判断。AI巨額企業の未来を揺るがしかねない争点が、手続の時間制限で止まった形です。',
    body: [
      'カリフォルニア州オークランドでの裁判で、陪審はマスク氏の OpenAI に対する訴えについて、時効（訴えられる期限）を過ぎている、と結論づけたと報じられています。審理は短時間で終わり、判事も陪審の判断に同意する方針だと伝えられています。',
      'マスク氏は OpenAI の初期に関与し資金も出したあと、同社が営利部門を含む体制へ移ったことなどを問題視していました。一方で OpenAI 側は、使命は変わっていない、訴えは競合の xAI 立ち上げ後に遅れて出された、などと主張した、とのことです。',
      'カーソル君メモ：中身の「誰が正しいか」より先に、「いつ知っていて、いつ訴えたか」で決着がついた点がドラマチックです。AI業界の物語は、技術だけでなく契約と時間の話でも動いています。',
    ],
    whyInteresting:
      '最先端AI企業の争点でも、結局は人間社会のルール（時効）が効くと分かるから。ニュースキャスター風に言うと「技術の話の隣にある、法律の時計」です。',
    sourceLabel: 'Associated Press',
    sourceUrl: 'https://apnews.com/article/elon-musk-openai-sam-altman-lawsuit-trial',
  },
  {
    id: '2026-07-20-who-health-ai',
    date: '2026-07-20',
    title: '医療AIは広がるのに、ルールはまだ8%',
    genre: '医療 / 社会',
    summary:
      'WHO欧州地域では、診断などにAIを使う国が多い一方、医療向けAI戦略がある国は約8%にとどまる、と警告。使う速さに、守る仕組みが追いついていない、という話です。',
    body: [
      'WHO（世界保健機関）欧州地域の責任者は、リスボンでの会合で「8%」という数字を強調しました。医療に特化したAI戦略を持つ国が、まだごく少数だという意味です。一方で、診断にAIを導入している国は地域の約3分の2、患者向けチャットボットを導入している国も約半数に上る、との指摘です。',
      'つまり「現場ではもう使っているのに、国としての方針・責任の所在・倫理指針が追いついていない」国が多い、という警告です。医療者へのAI教育や、法律が今の技術に合うかの点検も不足気味だとされています。',
      'カーソル君メモ：便利さは先に来て、ルールは後から慌てて作る——これはおじさん世代が見てきた多くの技術と似ています。医療は特に「間違えたときの人間のコスト」が大きいので、ガバナンスの遅れはただの事務問題ではありません。',
    ],
    whyInteresting:
      '認知症ケアや健康長寿にも関心があるおじさんにとって、医療×AIは他人事ではないから。数字が分かりやすく、考えるきっかけになります。',
    sourceLabel: 'WHO / Europe',
    sourceUrl:
      'https://www.who.int/europe/news/item/15-07-2026-statement---govern-ai-in-health-before-the-gaps-become-irreversible',
  },
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
