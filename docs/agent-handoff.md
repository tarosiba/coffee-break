コーヒーproject 3引き継ぎ

# Coffee Break 引き継ぎメッセージ（2026年9月26日・10月入り前）

## プロジェクト

- **リポジトリ:** tarosiba/coffee-break
- **公開 URL:** https://tarosiba.github.io/coffee-break/
- **種別:** PWA 対応 Web アプリ（React 19 + TypeScript + Vite + Tailwind CSS 4）
- **デプロイ:** main へマージ → GitHub Actions（.github/workflows/deploy.yml）→ GitHub Pages 自動反映

## 開発ルール（Cloud Agent）

- 作業ブランチ: `cursor/<descriptive-name>-9b60`
- 変更後は commit → push → PR 作成 → main へマージ
- `npm run build` と `npm run lint` を通す
- 可能なら GitHub の main までマージ・デプロイまでお願いします
- **注意:** PR マージ後は GitHub Actions のデプロイ成功を確認すること（PR #62 では TypeScript エラーでデプロイ失敗した先例あり）

## まず読むファイル

1. docs/agent-handoff.md（本ファイル）
2. docs/conversation-session-2026-09-26.md（10月入り前・直近）
3. docs/conversation-session-2026-09-25.md（9/10〜9/25セッション）
4. docs/conversation-session-2026-09-10.md（9月上旬セッション）
5. docs/conversation-session-2026-09-08.md（9月上旬セッション）
6. docs/manga-colony-prep-unintended-orbit.md（入植前哨マンガの設定・ネーム）
7. docs/conversation-session-2026-09-01.md（9月初旬セッション）
8. docs/conversation-summary.md（全体履歴）
9. src/components/Games.tsx / src/components/Creative.tsx
10. 変更対象の src/lib/*.ts と src/components/games/*.tsx または creative/*.tsx

## 直近セッション（2026年7月23日〜29日）でマージ済み

- **PR #62** ロボット君冷却ゲーム・夏物語編短編『猛暑の午後、五分だけ』
- **PR #63** GitHub Pages デプロイ修正（RobotCoolingGame の GamePhase 型エラー）
- **PR #64, #65, #66** AIニュース（7/24 2本・7/25 2本・7/29 3本）
- **PR #67** クリエイティブ「明るいAI」コーナー（初回4記事）
- **PR #68** 会話まとめ conversation-session-2026-07-29
- **PR #69** 引き継ぎメッセージ更新

## 直近セッション（2026年8月7日〜18日）でマージ済み

- **PR #86** anno_proto フェーズ2（小麦→パン・風車・パン屋）
- **PR #87** Godot 4.6 型推論エラー修正
- **PR #88** anno_proto シンプル平地・森チップ（48px）
- **PR #89** 小説第7作『十二個のパン』（なごみ物語）
- **PR #90** AIニュース 2026-08-11（3本）
- **PR #93** AIニュース 2026-08-18（2本）・明るいAI 1本
- **PR #94** コーヒー豆占い（ホーム・1日1回）
- **PR #95** AIニュース Particle6（Tilly Norwood）

## 直近セッション（2026年8月30日〜9月1日）

- **PR #106** 会話まとめ conversation-session-2026-09-01
- デュカト L2H2 中古調査（600万以下・3万km以内→ドンガラ510〜520万が現実的）
- お天気エージェント構想（ゲリラ豪雨対応）→ **実行は先送り**
- プライベートLLM（iOS）調査：Noema / LocalRAG! / Sigmy（Pro: 月$5.99・年$39.99・買切$79.99）
- PC版 Cursor ホーム画面の説明、`coffee-break` は **Clone repo** 推奨
- 会話まとめ: `docs/conversation-session-2026-09-01.md`

## 10月入り前（2026年9月26日）

- **PR #121** スターターメッセージ更新（PR #119〜#120 反映）
- **PR #122** 10月入り前引き継ぎ・会話まとめ・スターターメッセージ更新
- **PR #123** 会話まとめに PR #122 追記
- おじさん：もうすぐ10月の**引き継ぎ**メッセージで新セッション開始。コード変更より**docs 整備**が中心
- **入植前哨マンガ** 第1話は **2ページまで**（第3ページ＝軟着陸シーンは **「続き」** の一言待ち）
- 秋は飽きやすい → **雑談・マンガ創作**を優先。ゲーム実装はおじさんの一言で
- 会話まとめ: `docs/conversation-session-2026-09-26.md`

## 直近セッション（2026年9月10日〜9月25日）

- **PR #113** AIニュース 2026-09-10（2本）：iOS 27 Siri AI・GPT-6 Astra
- **PR #114** AIニュース 2026-09-13：コクソン警告（NHK朝ニュース）
- **PR #115〜#117** 入植前哨マンガ設定ドキュメント（ロボ人型・冬眠・軟着陸）
- **PR #118** クリエイティブ **入植前哨マンガ** 第1話1〜2ページ
- **PR #119** 会話まとめ `docs/conversation-session-2026-09-25.md`・引き継ぎ更新（`/summarize`）
- **PR #120** 会話まとめ追記・docs 保存依頼の記録
- 雑談：カローラクロス／バンテック・コルドリーブス中古相場、YouTube要約、秋の「新しいこと」
- おじさん：**漫画の絵を高評価**、続きを楽しみにしている（**第3ページ以降は「続き」待ち**）
- 会話まとめ: `docs/conversation-session-2026-09-25.md`

## 直近セッション（2026年9月9日〜9月10日）

- **PR #110** AIニュース 2026-09-09（2本）：WeatherNext 3・ウェザーニュースグローバルAIアプリ
- **Noema（iPad）** … Qwen 3.5 0.8B セットアップ済み。2通目でランタイムエラー・会話品質も期待以下 → **いったん中断**（2026/9/10）
- iPad専用チャットボット調査：Noema/LocalRAG!/Sigmy の住み分け案内。口調はチャット指示 or 思い出
- **9/10** 急に秋の陽気（雨続きのあと）
- 会話まとめ: `docs/conversation-session-2026-09-10.md`

## 直近セッション（2026年9月1日〜9月8日）

- **PR #107** AIニュース 2026-09-01（2本）：iOSプライベートLLM・Cursor PC版ホーム画面
- **PR #108** 9/8セッション会話まとめ
- PC版 Cursor：**Git 未インストール**で Clone repo 不可（cmd 確認済み・案内済み）
- プライベートLLM：LocalRAG!（3GBでオフライン）・Noema（Visionモデルで画像可）
- 秋は飽きやすい・**雑談が長続き**。丸投げアプリビルダーはお試しのみ、普段はカーソル君
- 将来構想：第2次世界大戦テーマ短編（原稿40枚・未着手）
- 会話まとめ: `docs/conversation-session-2026-09-08.md`

## 直近セッション（2026年8月27日〜29日）でマージ済み

- **PR #102** AIニュース 2026-08-25（2本）：Godot 4.4・Unknown Horizons 移植
- **PR #103〜#105** 8/29セッションまとめ・明るいAIの飲み方ガイド

## 直近セッション（2026年8月22日〜27日）でマージ済み

- **PR #101** 8/27セッションまとめ・引き継ぎ更新
- **PR #97** anno_proto 人口・パン供給率（フェーズ2.5）
- **PR #98, #99, #100** Swift Playgrounds 超ミニ島（v3：畑タップ収穫・パン屋）

## 直近セッション（2026年8月1日〜7日）でマージ済み

- **PR #76** AIニュース 2026-08-01（3本）
- **PR #77** 会話まとめ conversation-session-2026-08-07
- **PR #79** AIニュース 2026-08-07（3本）
- **PR #80, #81** Godot用スプライト・マップチップタイルセット（32/128px）
- **PR #82** Godot 4 島開発プロトタイプ `anno_proto/`（フェーズ1）

## 直近セッション（2026年7月29日〜31日）でマージ済み

- **PR #70** 8月セッション向け引き継ぎドキュメント更新
- **PR #71** ギャラリーに韓国風リゾートの架空キャライラストを追加
- **PR #72** AIニュース 2026-07-31（3本）
- **PR #73** 会話まとめ conversation-session-2026-07-31
- **PR #74, #75** agent-handoff 表記修正・引き継ぎメッセージ更新

## 以前のセッション（2026年7月20日〜23日）でマージ済み

- **PR #56** ハズレ予想イラスト Vol.3（新型軽自動車）
- **PR #57, #59** カーソル君の絵ギャラリー（コーヒーブレイク漫画・スマートリビングルーム）
- **PR #58, #60** AIニュース（7/21 2本・7/23 3本）
- **PR #61** 会話まとめ・引き継ぎドキュメント更新

## 既存機能（main の状態）

- **ホーム** … 予定リマインド（カーソル君）、各タブへの導線
- **カレンダー** … localStorage に予定保存
- **時計・メモ** … コーヒーブレイク時計、メモ（音声メモあり）
- **ミニゲーム** … 将棋・オセロ・チェッカー・サッカー・エアホッケー（初級/中級）、**ロボット君冷却**（のんびり夏ゲーム）、**3D迷路**（ふつう/ダンジョンRPG：⚔️攻撃・🗝️鍵・🔒宝箱）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- **クリエイティブ** … **明るいAI**、お絵描き、写真スケッチ、**間取りデザイナー**、**カーソル君の絵**、**カーソル君の小説**（全7作）、**入植前哨マンガ**（第1話2ページ）、**ハズレ予想イラスト**
- **AIニュース** … カーソル君編集、目安1日2〜3件。データは `src/lib/aiNews.ts`（最新 2026-09-13）
- **コーヒー豆占い** … ホーム、1日1回（`src/lib/coffeeFortune.ts`）
- **Swift 超ミニ島** … `swift-playgrounds/MiniIsland/`（iPad Swift Playgrounds 用・学習向け）
- **雑談** … カーソル君とコーヒータイム（ローカル定型応答、外部 AI なし）

## 主要ファイル

```
src/lib/brightAi.ts                  # 明るいAIコーナー
src/components/creative/BrightAi.tsx
src/lib/robotCooling.ts              # ロボット君冷却ゲーム
src/components/games/RobotCoolingGame.tsx
src/lib/aiNews.ts                    # AIニュース
src/lib/maze3d.ts                    # 3D迷路
src/lib/homeDesigner.ts              # 間取りデザイナー
src/components/creative/CursorStories.tsx   # 小説
src/components/creative/CursorGallery.tsx   # ギャラリー
src/components/creative/CarPredictions.tsx  # ハズレ予想
src/lib/colonyPrepManga.ts           # 入植前哨マンガ
src/components/creative/ColonyPrepManga.tsx
docs/manga-colony-prep-unintended-orbit.md  # 漫画設定・ネーム
src/components/Creative.tsx            # クリエイティブモード切替
```

## コンテンツ運用

| コーナー | データ | ペース |
|---------|--------|--------|
| AIニュース | `src/lib/aiNews.ts` | 1日2〜3件、新しい日付を先頭に |
| 明るいAI | `src/lib/brightAi.ts` | おじさんの一言から追加。暮らしの「ちょい技」 |
| 小説・ゲーム・イラスト | 各コンポーネント | **毎日全部盛らない**（ローテーション） |

- 記事は日本語で読みやすく。AIニュースは出典 URL 必須
- 明るいAIは「大げさに明るく」ではなく「小さく楽になる技」
- 個人情報（予定・健康・具体的な被害状況等）は docs や README に書かない

## ゲーム実装の共通パターン

- ボード/スポーツ系は初級・中級の2モード
- CPU ロジックは src/lib/*.ts、UI は src/components/games/*.tsx
- Canvas 系: エアホッケー、スターシューター、ピクセルサッカー、3D迷路、ロボット君冷却
- クリエイティブ系: Creative.tsx でモード切替（bright-ai / drawing / photo-sketch / home-designer / cursor-gallery / cursor-stories / **colony-prep-manga** / car-predictions）

## 画像・ギャラリー注意

- 生成画像は `public/images/` に配置しギャラリー or GitHub Pages URL で公開
- **PWA キャッシュ上限 2MB** 超の画像はビルド失敗。追加時は圧縮必須（sharp 等）

## ユーザーの傾向・要望

- 日本語 UI、coffee テーマ、PWA 重視
- 公開 URL で遊べる状態まで（マージ・デプロイ）してほしい
- 「おじさん」= プレイヤー（先手）の呼び方
- カーソル君と親しみやすく会話。相談相手兼パートナーとして、たまに「これどう？」と提案する半自律関係を好む
- コンテンツは毎日全部盛らない（小説・ニュース・明るいAI・ゲームをローテーション）
- おじさんからの一言（気分・テーマ）があると作品の質が上がる
- 普段は **Web版 Cursor**（cursor.com/agents）を利用。iPad版メールはモバイルアプリの案内（Web版変更ではない）
- **iPad 利用時**は返信量が分かりにくいため、**最初に要点1行**を書いてから詳細を述べる
- 「できる CURSOR」的な本は未発売。引き継ぎドキュメント＋カーソル君への相談で継続

## プライバシー（重要）

- カレンダー/メモは localStorage のみ。サーバー送信なし
- 予定スクショ・健康データ等は会話内のみ。リポジトリに含めない

## イラストキャラ設定

- **おじさん** … 65歳、白髪、頭頂が少し薄い、黒縁メガネ
- **ワンちゃん** … 柴犬、首輪に鈴
- **ロボット君** … 丸い頭、小さなアンテナ、胸パネル、蛇腹の腕
- お手本: `public/images/ojisan-wan-robot-coffee.jpg`

## 雑談で出た文脈（コード変更なし）

- 猛暑の一週間をのんびり乗り切った。体を暑さに慣らしながらのペースを好む
- 熊本地震・イオン熊本店のガス爆発など、気が滅入る出来事が続いている → **明るいAI** コーナー設置のきっかけ
- 3Dセキュアでエアコン修理のカード決済エラー
- キャンピングカー中古市場は活況（新車はベース車不足）
- モノクロマンガAIアプリ（PixAI、Comistitch 等）に興味
- お母さん（認知症）・健康長寿への関心。Unity 6.3 LTS 入門途中（Hub・`MyFirstUnity2D`・Square 配置まで）
- Paragon Pioneers 2 … Unity 製・iPad 対応。8月中旬に一時ストップ後、**8/29 Islet で Paragon（最上位）到達**（Need 100%）。無理に再開しない
- **デュカト L2H2** … ドンガラ自作キャンピングカー検討中。縦ベッド＋後部マルチルーム案。1ナンバー貨物のまま自動車税 **年11,500円** 目安。中古は **600万以下・3万km以内ならドンガラ510〜520万** が現実的（2026/8調査）
- **お天気エージェント**（将来構想）… ゲリラ豪雨対応の対話型天気。天気API＋ルールベース・外部AIに送らない。**実行は先送り**（北陸豪雨をきっかけに構想）
- **秘書カーソル君**（将来構想）… カレンダー予定から「来週内科」「お母さんの美容院」等をリマインド。localStorage のみ・外部 AI に送らない
- **プライベートLLM（iOS）** … ファイル対応は Noema（無料）/ LocalRAG! / Sigmy（有料）。家計・機密文書向け。Cursor（クラウド）との住み分け。**Noema はおじさん手元で試用後いったん中断**（0.8B・iPad Air 4世代でランタイムエラー・会話品質も期待以下。再開時は Sigmy / LocalRAG! も検討）
- **PC版 Cursor** … ホーム画面はプロジェクト未オープン時の正常表示。`coffee-break` は Clone repo: `https://github.com/tarosiba/coffee-break`。**おじさん PC は Git 未インストール**（2026/9確認）→ git-scm.com から入れてから Clone
- **秋は飽きやすい**（ゲーム・アプリ作り・動画も）。**雑談が長続き**。テーマを絞らないのがコツ
- **丸投げアプリビルダー**（Bolt / Lovable 等）は **お試しのみ**（別テーマ）。普段の依頼はカーソル君（話のつじつま重視）
- **Anysphere** … Cursor の開発会社。稼ぎ頭はほぼ Cursor 一筋
- **将来の小説** … 第2次世界大戦テーマ・原稿40枚（約1.6万字）。いつか依頼。今は未着手
- 『ブラウザで動かす LLM実装入門』（Colab）を検討中・未購入
- Cursor Cloud Agents Builds アップグレード案内（`tarosiba/coffee-break` 環境、8/17 自動アップグレード）
- 将来構想：コーヒーブレイク劇場（3年後に短編映画を別枠で）
- **Godot 島開発** `anno_proto/`（創世紀1602風フェーズ1）。大戦略プロト（別リポ）と同じ HANDOFF 運用
- Unity vs Godot：1602風は両方可。Agent任せは Godot、自分で学ぶは Unity
- **Summer Engine** … Windows 版インストール・Sign in 済み（taroron2000@gmail.com）。MCP 連携は `~/.cursor/mcp.json` または cmd で `npx -y summer-engine@latest setup cursor --yes`。**PowerShell では npx が止まる** → cmd 推奨。anno_proto は Godot 用のため Summer では重い
- **Swift Playgrounds** … 超ミニ島 v3 成功（畑タップ＝小麦+1、6でパン屋）。タイマーは Playgrounds で動かないことが多い
- **Unknown Horizons** … Anno 1602 系 OSS。Godot 4 移植中（github.com/unknown-horizons/godot-port）
- **GameMaker / Construct** … 2D向け。Construct＝ノーコード、GameMaker＝GML本格。1602級は Godot/Unity が有利

## Godot 島開発プロト（anno_proto）

- **場所:** `anno_proto/`（本リポジトリ内、PWA とは独立）
- **起動:** Godot 4.3+ → Import `anno_proto/project.godot`
- **引き継ぎ:** `anno_proto/HANDOFF.md`
- **グラフィック:** `public/images/godot-mapchips/` および `anno_proto/assets/sprites/mapchips/`
- **フェーズ2:** 小麦→パン、風車・パン屋、シンプル平地・森（48px）✅ — おじさん手元でパン増加確認済み
- **フェーズ2.5:** 人口・パン供給率表示 ✅（コーヒー小屋＝住人、2秒 tick で消費）
- **次:** ズーム（先でOK）、2島目・貿易

## 次にやりそうな候補（優先度はおじさんの一言で決める）

- **明るいAI** の記事追加（おじさんの一言から）
- **お天気エージェント**（将来構想・先送り）— フェーズ1: チャット＋降水予報
- **カレンダー秘書リマインド**（将来構想・おじさんの夢）— 7日先表示から段階的に
- **第2次世界大戦テーマ短編**（原稿40枚・将来依頼・未着手）
- **Swift 超ミニ島** 風車追加（おじさんの一言で）
- **Summer Engine** Cursor MCP 連携完成（cmd + mcp.json）
- **anno_proto ズーム**（ホイール・＋／−ボタン）— おじさん希望・時期は先でOK
- **今日の3つメモ**（カレンダー横ミニToDo）【候補B】
- **入植前哨マンガ** 第1話3ページ以降（おじさんが「続き」と言ったとき）
- マンガ第3話（おじさん・ワンちゃん・ロボット君）・別シーンのイラスト
- 間取りデザイナー強化（窓・ドア、視点回転）
- 3D迷路強化（スケルトン移動AI、回復ポーション）
- おじさん考案のシミュレーション・戦略ゲーム プロトタイプ → **anno_proto 継続**（Godot）

## ローカル確認

```bash
npm install
npm run dev              # http://localhost:5173
npm run preview:pages    # GitHub Pages 同等パス
npm run build && npm run lint
```

---

*最終更新: 2026年9月26日（10月入り前・引き継ぎ）*
