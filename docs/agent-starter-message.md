# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッションの最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-08-07.md（直近セッションの会話まとめ）
- docs/conversation-summary.md（全体履歴）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み（PR #75〜#79）
- PR #75 新Agent向け引き継ぎメッセージ更新
- PR #76 AIニュース 2026-08-01（3本）
- PR #77 会話まとめ conversation-session-2026-08-07
- PR #79 AIニュース 2026-08-07（3本）

## 既存機能（main の状態）
- ホーム … 予定リマインド、各タブへの導線
- カレンダー・時計・メモ … localStorage のみ（サーバー送信なし）
- ミニゲーム … 将棋・オセロ・チェッカー・サッカー・エアホッケー、ロボット君冷却、3D迷路（ふつう/ダンジョンRPG）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- クリエイティブ … 明るいAI、お絵描き、写真スケッチ、間取りデザイナー、カーソル君の絵（リゾートイラスト追加済み）、小説（6作）、ハズレ予想
- AIニュース … カーソル君編集、目安1日2〜3件（src/lib/aiNews.ts）。最新は8/7
- 雑談 … カーソル君とコーヒータイム（ローカル定型応答）

## 主要ファイル
- src/lib/brightAi.ts / src/components/creative/BrightAi.tsx（明るいAI）
- src/lib/aiNews.ts / src/components/AiNews.tsx
- src/lib/robotCooling.ts / src/components/games/RobotCoolingGame.tsx
- src/components/creative/CursorGallery.tsx（ギャラリー）
- src/lib/maze3d.ts / src/lib/homeDesigner.ts

## イラストキャラ設定（お手本）
- おじさん … 65歳、白髪、頭頂が少し薄い、黒縁メガネ
- ワンちゃん … 柴犬、首輪に鈴
- ロボット君 … 丸い頭、小さなアンテナ、胸パネル、蛇腹の腕
- ギャラリー掲載: public/images/ojisan-wan-robot-coffee.jpg
- 架空キャラのイラストは OK。実在人物の再現は不可

## おじさんの傾向
- 日本語 UI、coffee テーマ、PWA 重視
- 公開 URL で遊べる状態まで（マージ・デプロイ）してほしい
- 「おじさん」= プレイヤー（先手）の呼び方
- のんびりペース。コンテンツは毎日全部盛らない（ローテーション）
- ゲームにハマりやすい（Paragon Pioneers 2 プレイ中）。相談相手兼パートナーとして会話を好む
- おじさんからの一言（気分・テーマ）があると作品の質が上がる
- 個人情報は docs に書かない。Web版 Cursor（cursor.com/agents）メイン

## 雑談で出た文脈（コード変更なし）
- Paragon Pioneers 2 は Unity 製・iPad 対応。おじさんは Islet 島で Townsmen 段階（パン0%・贅沢品8%で行き詰まり中）
- Unity 6.3 LTS 入門途中（Hub インストール、`MyFirstUnity2D` で Square 配置まで）
- 『ブラウザで動かす LLM実装入門』（Colab）を検討中・未購入
- Cursor Cloud Agents Builds のアップグレード案内あり（tarosiba/coffee-break 環境、8/17 自動アップグレード）
- 将来構想：コーヒーブレイク劇場（短編映画を別枠で）

### Paragon Pioneers 攻略メモ（おじさんの進行）
- 島 Islet：Townsmen 448/560、コイン304、収入21.5/時
- 最優先：パン（Bread）0%を修正、兵舎停止、別島で生産→貿易
- Merchant へのアップグレードはまだしない

## 次の候補（優先度はおじさんの一言で決める）
- AIニュース 8月分の追加（8/2以降）
- 明るいAIの記事追加
- 今日の3つメモ【B】／コーヒー豆占い【C】
- おじさん考案のシミュレーション・戦略ゲーム プロトタイプ
- ギャラリーイラスト追加（架空キャラのみ）
- 間取り強化、3D迷路強化

## 注意
- 画像追加時は public/images/ に配置し、PWA 2MB 制限のため sharp 等で圧縮必須
- カレンダー/メモは localStorage のみ。サーバー送信なし
- 実在人物の顔・体型を再現した実写風画像は作成しない

「明るいAIをもう1本」「今日はニュース2本」「Bで」と一言あるとすぐ着手できます。
