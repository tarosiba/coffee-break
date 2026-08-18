# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッションの最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-08-18.md（直近セッションの会話まとめ）
- docs/conversation-summary.md（全体履歴）
- anno_proto/HANDOFF.md（Godot 島開発プロトを触る場合）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み（PR #86〜#90）
- PR #86 anno_proto フェーズ2（小麦→パン・風車・パン屋）
- PR #87 Godot 4.6 型推論エラー修正
- PR #88 anno_proto シンプル平地・森チップ（48px）
- PR #89 小説第7作『十二個のパン』（なごみ物語）
- PR #90 AIニュース 2026-08-11（3本）

## Godot 島開発 anno_proto（同リポ内・PWAとは別）
- 起動: Godot 4.3+ → Import `anno_proto/project.godot` → F5
- フェーズ2: 小麦→パン、風車・パン屋、左下森・中央平地（48pxチップ）
- 引き継ぎ: anno_proto/HANDOFF.md
- おじさん手元で畑3・風車1・パン屋1の動作確認済み

## 既存機能（Coffee Break PWA・main の状態）
- ホーム … 予定リマインド、各タブへの導線
- カレンダー・時計・メモ … localStorage のみ（サーバー送信なし）
- ミニゲーム … 将棋・オセロ・チェッカー・サッカー・エアホッケー、ロボット君冷却、3D迷路、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- クリエイティブ … 明るいAI、お絵描き、写真スケッチ、間取りデザイナー、カーソル君の絵、小説（7作）、ハズレ予想
- AIニュース … 最新は8/11（src/lib/aiNews.ts）
- 雑談 … カーソル君とコーヒータイム

## おじさんの傾向（追記）
- iPad 利用時は返信が長いと量が分からない → **最初に要点1行**
- 「できる CURSOR」的な本は未発売。引き継ぎ＋カーソル君で継続
- Paragon Pioneers 2 は2026年8月中旬に一時ストップ（やらされ感）。無理に再開しない

## 次の候補（一言で優先度決定）
- anno_proto ズーム（「ズームして」— 先でOK）
- 人口・ニーズ表示（「人口で」）
- 明るいAIを1本
- AIニュース 8月中旬以降
- 今日の3つメモ【B】／コーヒー豆占い【C】

常設のコピペ用ファイル: docs/agent-starter-message.md（本内容）
