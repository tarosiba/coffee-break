# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッション（New Chat）の最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-08-22.md（直近セッションの会話まとめ）
- docs/conversation-summary.md（全体履歴）
- anno_proto/HANDOFF.md（Godot 島開発プロトを触る場合）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み（PR #86〜#95）
- PR #86 anno_proto フェーズ2（小麦→パン・風車・パン屋）
- PR #87 Godot 4.6 型推論エラー修正
- PR #88 anno_proto シンプル平地・森チップ（48px）
- PR #89 小説第7作『十二個のパン』（なごみ物語）
- PR #90 AIニュース 2026-08-11（3本）
- PR #93 AIニュース 2026-08-18（2本）・明るいAI 1本
- PR #94 コーヒー豆占い（ホーム・1日1回）
- PR #95 AIニュース Particle6（Tilly Norwood）

## Godot 島開発 anno_proto（同リポ内・PWAとは別）
- 起動: Godot 4.3+ → Import `anno_proto/project.godot` → F5
- フェーズ2: 小麦→パン、風車・パン屋、左下森・中央平地（48pxチップ）
- 引き継ぎ: anno_proto/HANDOFF.md
- おじさん手元で畑3・風車1・パン屋1・パン増加を確認済み
- 次候補: ズーム（先でOK）、人口・ニーズ、2島目・貿易

## 既存機能（Coffee Break PWA・main の状態）
- ホーム … 予定リマインド、各タブへの導線
- カレンダー・時計・メモ … localStorage のみ（サーバー送信なし）
- ミニゲーム … 将棋・オセロ・チェッカー・サッカー・エアホッケー、ロボット君冷却、3D迷路（ふつう/ダンジョンRPG）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- クリエイティブ … 明るいAI、お絵描き、写真スケッチ、間取りデザイナー、カーソル君の絵、小説（7作）、ハズレ予想
- AIニュース … カーソル君編集、目安1日2〜3件（src/lib/aiNews.ts）
- コーヒー豆占い … ホーム、1日1回（src/lib/coffeeFortune.ts）
- 雑談 … カーソル君とコーヒータイム（ローカル定型応答）

## 主要ファイル
- src/lib/brightAi.ts / src/components/creative/BrightAi.tsx（明るいAI）
- src/lib/aiNews.ts / src/components/AiNews.tsx
- src/components/creative/CursorStories.tsx（小説）
- anno_proto/scripts/main.gd（Godot 島プロト）

## イラストキャラ設定
- おじさん … 65歳、白髪、頭頂が少し薄い、黒縁メガネ
- ワンちゃん … 柴犬、首輪に鈴
- ロボット君 … 丸い頭、小さなアンテナ、胸パネル、蛇腹の腕
- お手本: public/images/ojisan-wan-robot-coffee.jpg

## おじさんの傾向
- 日本語 UI、coffee テーマ、PWA 重視。マージ・デプロイまでお願い
- 「おじさん」= プレイヤー（先手）の呼び方
- のんびりペース。コンテンツは毎日全部盛らない（ローテーション）
- **iPad 利用時**は返信量が分かりにくい → **最初に要点1行**を書く
- Web版 Cursor（cursor.com/agents）メイン。相談相手兼パートナーとして会話を好む
- 「できる CURSOR」的な本は未発売。引き継ぎ＋カーソル君で継続
- 個人情報は docs に書かない

## 雑談で出た文脈（コード変更なし）
- Paragon Pioneers 2 … 2026年8月中旬に**一時ストップ**（住民要望のやらされ感）。無理に再開しない
- 創世紀1602 … Windows版はCD要。No-CD改変は案内不可。anno_proto が1602風の代替プロト
- iOS レトロゲーム … DOS は iDOS 3、Windows は UTM SE（遅い）か PC から配信が現実的
- できる Claude & Cowork … 参考になるが Cursor メインなら急がなくてよい
- **Summer Engine** … Windows PC で試用予定。MCP 無料。PowerShell で npx が実行ポリシーエラー → **次回は cmd から再開**
- おじさん PC … Windows、Node.js v24.19.0 確認済み

## 次の候補（一言で優先度決定）
- Summer Engine 再開（「Summer 続き」— **cmd で npx**）
- anno_proto ズーム（「ズームして」— 先でOK）
- 人口・ニーズ表示（「人口で」）
- 明るいAIを1本
- AIニュース追加
- 今日の3つメモ【B】

「Summer 続き」「ズームして」「明るいAIを1本」「ニュース2本」「Bで」と一言あるとすぐ着手できます。
