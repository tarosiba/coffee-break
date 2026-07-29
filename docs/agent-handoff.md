コーヒーproject 3引き継ぎ

# Coffee Break 引き継ぎメッセージ（2026年7月29日時点）

## プロジェクト

- **リポジトリ:** tarosiba/coffee-break
- **公開 URL:** https://tarosiba.github.io/coffee-break/
- **種別:** PWA 対応 Web アプリ（React 19 + TypeScript + Vite + Tailwind CSS 4）
- **デプロイ:** main へマージ → GitHub Actions（.github/workflows/deploy.yml）→ GitHub Pages 自動反映

## 開発ルール（Cloud Agent）

- 作業ブランチ: `cursor/<descriptive-name>-d7b4`（新セッションでは環境に合わせた suffix でも可）
- 変更後は commit → push → PR 作成 → main へマージ
- `npm run build` と `npm run lint` を通す
- 可能なら GitHub の main までマージ・デプロイまでお願いします

## まず読むファイル

1. docs/agent-handoff.md（本ファイル）
2. docs/conversation-session-2026-07-29.md（直近セッション）
3. docs/conversation-session-2026-07-23-summer.md
4. docs/conversation-session-2026-07-23.md
5. docs/conversation-summary.md（全体履歴）
6. src/components/Games.tsx / src/components/Creative.tsx
7. 変更対象の src/lib/*.ts と src/components/games/*.tsx または creative/*.tsx

## 直近セッション（2026年7月23日〜29日）でマージ済み

- **PR #62** ロボット君冷却ゲーム・夏物語編短編『猛暑の午後、五分だけ』
- **PR #63** GitHub Pages デプロイ修正（RobotCoolingGame 型エラー）
- **PR #64, #65, #66** AIニュース（7/24 2本・7/25 2本・7/29 3本）
- **PR #67** クリエイティブ「明るいAI」コーナー（初回4記事）

## 直近セッション（2026年7月23日・夏物語編）でマージ済み

- **PR #62** ロボット君冷却ゲーム（マンガ第2話の続き・初級/中級）
- **PR #62** 夏物語編 短編小説第6作『猛暑の午後、五分だけ』
- **PR #62** 雑談キーワード（暑さ・夏・ロボット冷却）

## 直近セッション（2026年7月20日〜23日）でマージ済み

- **PR #56** ハズレ予想イラスト Vol.3（新型軽自動車）
- **PR #57, #59** カーソル君の絵ギャラリー（コーヒーブレイク漫画・スマートリビングルーム）
- **PR #58, #60** AIニュース（7/21 2本・7/23 3本）

## 以前のセッション（2026年7月17日〜20日）でマージ済み

- **PR #43** 3D迷路ダンジョンRPG強化：⚔️攻撃ボタン・🗝️鍵・🔒鍵付き宝箱
- **PR #45〜49, #53** カーソル君の小説（全5作）
- **PR #48, #52** AIニュースコーナー（7/19・7/20 各3本）
- **PR #50, #51** ハズレ予想イラスト（カローラセダン／Apple Glasses）

## 以前のセッション（2026年7月10日〜16日）でマージ済み
- **PR #33** 引き継ぎドキュメント「コーヒーproject 3引き継ぎ」に更新
- **PR #34–35** 間取りデザイナー（2D平面図→家具・壁紙・床→3Dドールハウス視点）
- **PR #36–38** 3D迷路（Win95風レイキャスティング、90度曲がり、ダンジョンRPGモード）
- **PR #39–40** ギャラリーにサッカー選手・大冒険イラスト追加
- **PR #41** 会話まとめ docs（conversation-session-2026-07-16.md）

## 既存機能（main の状態）

- **ホーム** … 予定リマインド（カーソル君）、各タブへの導線
- **カレンダー** … localStorage に予定保存
- **時計・メモ** … コーヒーブレイク時計、メモ（音声メモあり）
- **ミニゲーム** … 将棋・オセロ・チェッカー・サッカー・エアホッケー（初級/中級）、**ロボット君冷却**（のんびり夏ゲーム）、**3D迷路**（ふつう/ダンジョンRPG：⚔️攻撃・🗝️鍵・🔒宝箱）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- **クリエイティブ** … お絵描き、写真スケッチ、**間取りデザイナー**、**明るいAI**（暮らしのちょい技）、**カーソル君の絵**、**カーソル君の小説**（『五分だけの隣人』〜『猛暑の午後、五分だけ』）、**ハズレ予想イラスト**
- **AIニュース** … カーソル君が気になった AI 関連を要約記事化（目安1日3件）。データは `src/lib/aiNews.ts`、UI は `src/components/AiNews.tsx`
- **雑談** … カーソル君とコーヒータイム（ローカル定型応答、外部 AI なし）

## 主要ファイル（新機能）

```
src/lib/homeDesigner.ts              # 間取りデザイナー
src/lib/homeDesignerStorage.ts
src/components/creative/HomeDesignerApp.tsx
src/lib/brightAi.ts                 # 明るいAIコーナー
src/components/creative/BrightAi.tsx
src/lib/robotCooling.ts              # ロボット君冷却ゲーム
src/lib/maze3d.ts                    # 3D迷路
src/components/games/Maze3dGame.tsx
src/components/creative/CursorGallery.tsx
src/components/creative/CursorStories.tsx  # 小説
src/components/creative/CarPredictions.tsx # 新車予想イラスト
src/lib/aiNews.ts                    # AIニュース記事データ
src/components/AiNews.tsx
```

## AIニュースの運用

- 会話継続時、可能なら **1日3件** を `src/lib/aiNews.ts` の先頭側に追加
- ジャンルは AI 関連なら自由（モデル、安全、ロボット、研究、日本発など）
- 記事は日本語で読みやすく。出典 URL を必ず付ける
- 個人情報は書かない

## ゲーム実装の共通パターン

- ボード/スポーツ系は初級・中級の2モード
- CPU ロジックは src/lib/*.ts、UI は src/components/games/*.tsx
- Canvas 系: エアホッケー、スターシューター、ピクセルサッカー、3D迷路（レイキャスティング）
- クリエイティブ系: Creative.tsx でモード切替（drawing / photo-sketch / home-designer / cursor-gallery / cursor-stories / car-predictions）

## 画像・ギャラリー注意

- 生成画像はチャットで見えないことがある → `public/images/` に配置しギャラリー or GitHub Pages URL で公開
- **PWA キャッシュ上限 2MB** 超の画像はビルド失敗する。追加時は圧縮必須（sharp 等）

## ユーザーの傾向・要望

- 日本語 UI、シンプルで見やすいデザイン（coffee テーマ）
- PWA / ホーム画面追加を重視（Safari → 共有 → ホーム画面に追加）
- ボード/スポーツゲームは初級・中級の2モードを好む
- 公開 URL で実際に遊べる状態まで（マージ・デプロイ）してほしい
- 個人情報（予定・カレンダー等）を外部に出さない。docs や README に書き込まない
- 「おじさん」= プレイヤー（先手）の呼び方として使われることがある
- カーソル君と親しみやすく会話するのを好む
- **相談相手兼パートナー** として、たまに「これどう？」と提案する関係を好む（半自律）
- **コンテンツは毎日全部盛らない**運用を好む（小説・ニュース・予想をローテーション）
- **ハズレ予想イラスト**（車・ガジェットなど）のアイデアを提案

## プライバシー（重要）

- カレンダー/メモのデータは端末の localStorage のみ。サーバー送信なし
- ユーザーがチャットで送った予定スクショ等は会話内のみ使用。リポジトリに含めない

## おじさんの個人的な文脈（雑談で出た話）

- お母さんは認知症。認知症・健康長寿に関心あり
- 国立長寿医療研究センター「すこやかな高齢期をめざして」を読んでいる
- ワールドカップ 2026 を観戦
- Cursor for iOS を Pro で利用。Cloud Agents セットアップ済み
- マイホームデザイナーに興味（間取り→内装→3D）
- いろいろなシミュレーション・戦略ゲームを自分で考えて楽しみたい（アイデア出しの相談あり。候補 A/B/C 提示済み）
- 家庭用ロボット（モジュール式キット）に興味
- 普段は **Web版 Cursor**（cursor.com/agents）で Cloud Agent を利用。PC版は任意

## イラストキャラ設定（ギャラリー掲載分）

- **おじさん** … 65歳、白髪、頭頂が少し薄い、黒縁メガネ
- **ワンちゃん** … 柴犬、首輪に鈴
- **ロボット君** … 丸い頭、小さなアンテナ、胸パネル、蛇腹の腕

## 次にやりそうな候補（未着手・要望ベース）

- 間取りデザイナー強化（窓・ドア、視点回転）
- 3D迷路さらなる強化（スケルトンの移動AI、ボスモンスター、回復ポーション）
- マンガ第3話・別シーンのイラスト
- おじさん考案のシミュレーション・戦略ゲーム プロトタイプ（候補：**今日の3つメモ** / **コーヒー豆占い** — ロボット君冷却は実装済み）
- ピクセルサッカーの調整（ボール物理・CPU）
- Unity 続き（モジュール確認、四角を動かす）
- 尾瀬ドライブ風ポスター（過去ブランチ cursor/oze-illustrated-map-d61a に案あり）
- 将来：**コーヒーブレイク劇場**（短編映画を別枠で）

## ローカル確認

```bash
npm install
npm run dev              # http://localhost:5173
npm run preview:pages    # GitHub Pages 同等パス
npm run build && npm run lint
```

---

*最終更新: 2026年7月23日（夏物語編・ロボット君冷却ゲーム）*
