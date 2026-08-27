# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッション（New Chat）の最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-08-27.md（直近セッションの会話まとめ）
- docs/conversation-summary.md（全体履歴）
- anno_proto/HANDOFF.md（Godot 島開発プロトを触る場合）
- swift-playgrounds/MiniIsland/README.md（Swift 超ミニ島を触る場合）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み（PR #86〜#100）
- PR #86 anno_proto フェーズ2（小麦→パン・風車・パン屋）
- PR #87 Godot 4.6 型推論エラー修正
- PR #88 anno_proto シンプル平地・森チップ（48px）
- PR #89 小説第7作『十二個のパン』（なごみ物語）
- PR #90 AIニュース 2026-08-11（3本）
- PR #93 AIニュース 2026-08-18（2本）・明るいAI 1本
- PR #94 コーヒー豆占い（ホーム・1日1回）
- PR #95 AIニュース Particle6
- PR #97 anno_proto 人口・パン供給率（フェーズ2.5）
- PR #98〜#100 Swift Playgrounds 超ミニ島（v3）

## Godot 島開発 anno_proto（同リポ内・PWAとは別）
- 起動: Godot 4.3+ → Import `anno_proto/project.godot` → F5
- フェーズ2: 小麦→パン、風車・パン屋、左下森・中央平地（48pxチップ）
- フェーズ2.5: 人口・パン供給率表示
- 引き継ぎ: anno_proto/HANDOFF.md
- 次候補: ズーム（先でOK）、2島目・貿易

## Swift Playgrounds 超ミニ島（学習用・PWAとは別）
- コード: swift-playgrounds/MiniIsland/ContentView.swift
- v3: タイマーなし。🌾畑タップ＝小麦+1。小麦6で🍞パン屋解放
- おじさん iPad で v3 成功済み

## Summer Engine（おじさん PC・別途）
- Sign in 済み（taroron2000@gmail.com）
- PowerShell の npx エラー → cmd を使う
- MCP: C:\Users\petsi\.cursor\mcp.json または setup cursor
- anno_proto は Godot 用。Summer では Create project 推奨

## 既存機能（Coffee Break PWA・main の状態）
- ホーム … 予定リマインド、コーヒー豆占い、各タブへの導線
- カレンダー・時計・メモ … localStorage のみ（サーバー送信なし）
- ミニゲーム … 将棋・オセロ・チェッカー・サッカー・エアホッケー、ロボット君冷却、3D迷路、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- クリエイティブ … 明るいAI、お絵描き、写真スケッチ、間取りデザイナー、カーソル君の絵、小説（7作）、ハズレ予想
- AIニュース … 最新は8/18（src/lib/aiNews.ts）
- 雑談 … カーソル君とコーヒータイム

## おじさんの傾向
- のんびりペース。マージ・デプロイまでお願い
- **iPad 利用時は最初に要点1行**
- Paragon Pioneers 2 は一時ストップ中（無理に再開しない）
- 「できる CURSOR」は未発売 → 引き継ぎ＋カーソル君で継続
- PC が熱い日は無理しない

## 次の候補（一言で）
- 「ズームして」… anno_proto カメラ拡大（先でOK）
- 「明るいAIを1本」
- 「ニュース2本」
- 「風車で」… Swift 超ミニ島に風車追加
- 「Bで」… 今日の3つメモ
- 「MCPで」… Summer Engine × Cursor 連携の続き

---

常設ファイル: `docs/agent-starter-message.md`（GitHub 上でもコピーできます）
