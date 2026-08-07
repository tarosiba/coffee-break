コーヒーproject 3引き継ぎ

# Coffee Break 引き継ぎメッセージ（2026年8月7日時点）

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
2. docs/conversation-session-2026-08-07.md（直近セッション）
3. docs/conversation-session-2026-08-01.md（8月セッション開始）
4. docs/conversation-session-2026-07-31.md（7月セッション）
5. docs/conversation-summary.md（全体履歴）
5. src/components/Games.tsx / src/components/Creative.tsx
6. 変更対象の src/lib/*.ts と src/components/games/*.tsx または creative/*.tsx

## 直近セッション（2026年7月23日〜29日）でマージ済み

- **PR #62** ロボット君冷却ゲーム・夏物語編短編『猛暑の午後、五分だけ』
- **PR #63** GitHub Pages デプロイ修正（RobotCoolingGame の GamePhase 型エラー）
- **PR #64, #65, #66** AIニュース（7/24 2本・7/25 2本・7/29 3本）
- **PR #67** クリエイティブ「明るいAI」コーナー（初回4記事）
- **PR #68** 会話まとめ conversation-session-2026-07-29
- **PR #69** 引き継ぎメッセージ更新

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
- **クリエイティブ** … **明るいAI**（暮らしのちょい技）、お絵描き、写真スケッチ、**間取りデザイナー**、**カーソル君の絵**、**カーソル君の小説**（全6作）、**ハズレ予想イラスト**
- **AIニュース** … カーソル君編集、目安1日2〜3件。データは `src/lib/aiNews.ts`。最新は8/7
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
- クリエイティブ系: Creative.tsx でモード切替（bright-ai / drawing / photo-sketch / home-designer / cursor-gallery / cursor-stories / car-predictions）

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
- Paragon Pioneers 2 にハマりやすい。Unity 製・iPad 対応。Islet 島で Townsmen 行き詰まり（パン0%・贅沢品8%）
- 『ブラウザで動かす LLM実装入門』（Colab）を検討中・未購入
- Cursor Cloud Agents Builds アップグレード案内（`tarosiba/coffee-break` 環境、8/17 自動アップグレード）
- 将来構想：コーヒーブレイク劇場（3年後に短編映画を別枠で）
- **Godot 島開発** `anno_proto/`（創世紀1602風フェーズ1）。大戦略プロト（別リポ）と同じ HANDOFF 運用
- Unity vs Godot：1602風は両方可。Agent任せは Godot、自分で学ぶは Unity

## Godot 島開発プロト（anno_proto）

- **場所:** `anno_proto/`（本リポジトリ内、PWA とは独立）
- **起動:** Godot 4.3+ → Import `anno_proto/project.godot`
- **引き継ぎ:** `anno_proto/HANDOFF.md`
- **グラフィック:** `public/images/godot-mapchips/` および `anno_proto/assets/sprites/mapchips/`
- **フェーズ2:** 小麦→小麦粉→パンの生産チェーン、風車・パン屋チップ ✅
- **次:** 人口・ニーズ表示、2島目・貿易

## 次にやりそうな候補（優先度はおじさんの一言で決める）

- **明るいAI** の記事追加（おじさんの一言から）
- **AIニュース** 8月分の追加（最新 8/7。8/8以降）
- **今日の3つメモ**（カレンダー横ミニToDo）【候補B】
- **コーヒー豆占い**（毎日1回）【候補C】
- マンガ第3話・別シーンのイラスト
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

*最終更新: 2026年8月7日（8/7セッションまとめ・anno_proto 反映）*
