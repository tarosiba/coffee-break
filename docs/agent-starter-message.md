# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッションの最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-07-29.md（直近セッションの会話まとめ）
- docs/conversation-summary.md（全体履歴）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-3d7c（環境に合わせた suffix でも可）
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み（PR #62〜#68）
- PR #62 ロボット君冷却ゲーム・夏物語編短編『猛暑の午後、五分だけ』
- PR #63 デプロイ失敗修正（RobotCoolingGame 型エラー）
- PR #64〜66 AIニュース（7/24 2本・7/25 2本・7/29 3本）
- PR #67 クリエイティブ「明るいAI」コーナー（初回4記事）
- PR #68 会話まとめ・引き継ぎドキュメント更新

## 既存機能（main の状態）
- ホーム … 予定リマインド、各タブへの導線
- カレンダー・時計・メモ … localStorage のみ（サーバー送信なし）
- ミニゲーム … 将棋・オセロ・チェッカー・サッカー・エアホッケー、ロボット君冷却、3D迷路（ふつう/ダンジョンRPG）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- クリエイティブ … 明るいAI、お絵描き、写真スケッチ、間取りデザイナー、カーソル君の絵、カーソル君の小説（6作）、ハズレ予想イラスト
- AIニュース … カーソル君編集、目安1日2〜3件（src/lib/aiNews.ts）
- 雑談 … カーソル君とコーヒータイム（ローカル定型応答）

## 主要ファイル
- src/lib/brightAi.ts / src/components/creative/BrightAi.tsx（明るいAI）
- src/lib/robotCooling.ts / src/components/games/RobotCoolingGame.tsx
- src/lib/aiNews.ts / src/components/AiNews.tsx
- src/lib/maze3d.ts / src/components/games/Maze3dGame.tsx
- src/lib/homeDesigner.ts / src/components/creative/HomeDesignerApp.tsx
- src/components/creative/CursorStories.tsx / CursorGallery.tsx / CarPredictions.tsx

## イラストキャラ設定（お手本）
- おじさん … 65歳、白髪、頭頂が少し薄い、黒縁メガネ
- ワンちゃん … 柴犬、首輪に鈴
- ロボット君 … 丸い頭、小さなアンテナ、胸パネル、蛇腹の腕
- ギャラリー掲載: public/images/ojisan-wan-robot-coffee.jpg

## おじさんの傾向
- 日本語 UI、coffee テーマ、PWA 重視
- 公開 URL で遊べる状態まで（マージ・デプロイ）してほしい
- 「おじさん」= プレイヤー（先手）の呼び方
- カーソル君と親しみやすく会話。相談相手兼パートナーとして、たまに「これどう？」と提案する半自律関係を好む
- コンテンツは毎日全部盛らない（小説・ニュース・明るいAI・ゲームをローテーション）
- おじさんからの一言（気分・テーマ）があると作品の質が上がる
- 個人情報（予定・カレンダー・健康データ等）は docs や README に書かない
- 普段は Web版 Cursor（cursor.com/agents）を利用

## 雑談で出た文脈（コード変更なし）
- 猛暑の一週間をのんびり乗り切った。体を暑さに慣らしながらのペースを好む
- 熊本地震・イオン熊本店のガス爆発など、気が滅入る出来事が続いている → 明るいAIコーナー設置のきっかけ
- 3Dセキュアでエアコン修理のカード決済エラー
- キャンピングカー中古市場は活況
- モノクロマンガAIアプリ（PixAI、Comistitch 等）に興味
- Unity 6.3 LTS 入門途中
- 将来構想：コーヒーブレイク劇場（短編映画を別枠で）

## 次にやりそうな候補（優先度はおじさんの一言で決める）
- 明るいAIの記事追加（おじさんの一言から）
- 今日の3つメモ（カレンダー横ミニToDo）【候補B】
- コーヒー豆占い（毎日1回）【候補C】
- マンガ第3話・別シーンのイラスト
- 間取りデザイナー強化（窓・ドア、視点回転）
- 3D迷路さらなる強化（スケルトン移動AI、回復ポーション）

## 注意
- 画像追加時は public/images/ に配置し、PWA 2MB 制限のため sharp 等で圧縮必須
- カレンダー/メモは localStorage のみ。サーバー送信なし

次のセッションで「明るいAIをもう1本」「Bで」「今日はニュース2本」と一言添えると、すぐ着手しやすいです。
