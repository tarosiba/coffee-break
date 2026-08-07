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
- anno_proto/HANDOFF.md（Godot 島開発プロトを触る場合）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み（PR #75〜#84）
- PR #75 新Agent向け引き継ぎメッセージ更新
- PR #76 AIニュース 2026-08-01（3本）
- PR #77 会話まとめ conversation-session-2026-08-07
- PR #79 AIニュース 2026-08-07（3本）
- PR #80 Godot用アイソメ家・畑スプライト（カーソル君絵風）
- PR #81 マップチップ風タイルセット（住宅16・畑16・地形4、32/128px）
- PR #82 Godot 4 島開発プロトタイプ anno_proto（フェーズ1）
- PR #83, #84 8/7セッションまとめ・引き継ぎドキュメント更新

## Godot 島開発 anno_proto（同リポ内・PWAとは別）
- 起動: Godot 4.3+ → Import `anno_proto/project.godot` → F5
- 創世紀1602風フェーズ1: 島地形・建物配置・木材/小麦/コイン・小麦畑自動生産
- 引き継ぎ: anno_proto/HANDOFF.md
- グラフィック: public/images/godot-mapchips/（PWA precache 除外）
- 大戦略プロト（Godot・別リポ `daisenryaku_proto`）と同じ HANDOFF＋小PR 運用

## 既存機能（Coffee Break PWA・main の状態）
- ホーム … 予定リマインド、各タブへの導線
- カレンダー・時計・メモ … localStorage のみ（サーバー送信なし）
- ミニゲーム … 将棋・オセロ・チェッカー・サッカー・エアホッケー、ロボット君冷却、3D迷路（ふつう/ダンジョンRPG）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- クリエイティブ … 明るいAI、お絵描き、写真スケッチ、間取りデザイナー、カーソル君の絵、小説（6作）、ハズレ予想
- AIニュース … カーソル君編集、目安1日2〜3件（src/lib/aiNews.ts）。最新は8/7
- 雑談 … カーソル君とコーヒータイム（ローカル定型応答）

## 主要ファイル
- src/lib/brightAi.ts / src/components/creative/BrightAi.tsx（明るいAI）
- src/lib/aiNews.ts / src/components/AiNews.tsx
- src/lib/robotCooling.ts / src/components/games/RobotCoolingGame.tsx
- src/components/creative/CursorGallery.tsx（ギャラリー）
- src/lib/maze3d.ts / src/lib/homeDesigner.ts
- anno_proto/scripts/main.gd（Godot 島プロト）

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
- Paragon Pioneers 2 … Unity 製・iPad。Islet 島で Townsmen 行き詰まり（パン0%・贅沢品8%）
- Unity 6.3 LTS 入門途中（Hub、`MyFirstUnity2D` で Square 配置まで）
- 創世紀1602は2Dアイソメ。家・畑の絵は最初こだわらずOK
- Unity vs Godot … Agent任せ＋大戦略の型は Godot、自分で学ぶは Unity
- 大戦略98風 … Godot 4 別リポ（daisenryaku_proto、PR #15 等）
- 『ブラウザで動かす LLM実装入門』（Colab）検討中・未購入
- Cursor Cloud Agents Builds（8/17 自動アップグレード）
- 将来構想：コーヒーブレイク劇場（短編映画を別枠で）

### Paragon Pioneers 攻略メモ
- 島 Islet：Townsmen 448/560、コイン304、収入21.5/時
- 最優先：パン（Bread）0%を修正、兵舎停止、別島で生産→貿易
- Merchant へのアップグレードはまだしない

## 次の候補（優先度はおじさんの一言で決める）
- anno_proto 続き（小麦→パン、風車・パン屋チップ、人口・貿易）
- AIニュース 8月分（8/8以降）
- 明るいAIの記事追加
- 今日の3つメモ【B】／コーヒー豆占い【C】
- ギャラリーイラスト追加（架空キャラのみ）
- 間取り強化、3D迷路強化
- 大戦略 Godot プロト継続（別リポ）

## 注意
- 画像追加時は public/images/ に配置し、PWA 2MB 制限のため sharp 等で圧縮必須
- godot-mapchips は PWA precache 除外済み（vite.config.ts）
- カレンダー/メモは localStorage のみ。サーバー送信なし
- 実在人物の顔・体型を再現した実写風画像は作成しない

「anno_proto でパン屋」「明るいAIを1本」「今日はニュース2本」「Bで」と一言あるとすぐ着手できます。
