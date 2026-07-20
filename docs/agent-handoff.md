コーヒーproject 3引き継ぎ

# Coffee Break 引き継ぎメッセージ（2026年7月20日時点）

## プロジェクト

- **リポジトリ:** tarosiba/coffee-break
- **公開 URL:** https://tarosiba.github.io/coffee-break/
- **種別:** PWA 対応 Web アプリ（React 19 + TypeScript + Vite + Tailwind CSS 4）
- **デプロイ:** main へマージ → GitHub Actions（.github/workflows/deploy.yml）→ GitHub Pages 自動反映

## 開発ルール（Cloud Agent）

- 作業ブランチ: `cursor/<descriptive-name>-af79`（新セッションでは環境に合わせた suffix でも可）
- 変更後は commit → push → PR 作成 → main へマージ
- `npm run build` と `npm run lint` を通す
- 可能なら GitHub の main までマージ・デプロイまでお願いします

## まず読むファイル

1. docs/agent-handoff.md（本ファイル）
2. docs/agent-handoff-message.md（新 Agent への貼り付け用メッセージ）
3. docs/conversation-session-2026-07-20.md（直近セッション）
3. docs/conversation-session-2026-07-16.md
4. docs/conversation-session-2026-07-10.md
5. docs/conversation-summary.md（全体履歴）
6. src/components/Games.tsx / src/components/Creative.tsx
7. 変更対象の src/lib/*.ts と src/components/games/*.tsx または creative/*.tsx

## 直近セッション（2026年7月17日〜20日）でマージ済み

- **PR #43** 3D迷路ダンジョンRPG強化：⚔️攻撃ボタン・🗝️鍵・🔒鍵付き宝箱
- **PR #45〜49, #53** カーソル君の小説（全5作）
- **PR #48, #52** AIニュースコーナー（7/19・7/20 各3本）
- **PR #50, #51** ハズレ予想イラスト（カローラセダン／Apple Glasses）

## 以前のセッション（2026年7月10日〜16日）でマージ済み

- **PR #32** README の機能一覧更新
- **PR #33** 引き継ぎドキュメント「コーヒーproject 3引き継ぎ」に更新
- **PR #34–35** 間取りデザイナー（2D平面図→家具・壁紙・床→3Dドールハウス視点）
- **PR #36–38** 3D迷路（Win95風レイキャスティング、90度曲がり、ダンジョンRPGモード）
- **PR #39–40** ギャラリーにサッカー選手・大冒険イラスト追加
- **PR #41** 会話まとめ docs（conversation-session-2026-07-16.md）

## 既存機能（main の状態）

- **ホーム** … 予定リマインド（カーソル君）、各タブへの導線
- **カレンダー** … localStorage に予定保存
- **時計・メモ** … コーヒーブレイク時計、メモ（音声メモあり）
- **ミニゲーム** … 将棋・オセロ・チェッカー・サッカー・エアホッケー（初級/中級）、**3D迷路**（ふつう/ダンジョンRPG：⚔️攻撃・🗝️鍵・🔒宝箱）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- **クリエイティブ** … お絵描き、写真スケッチ、**間取りデザイナー**、**カーソル君の絵**、**カーソル君の小説**（『五分だけの隣人』〜『ハズレの正解』）、**ハズレ予想イラスト**（カローラセダン／Apple Glasses など）
- **AIニュース** … カーソル君が気になった AI 関連を要約記事化（目安1日3件）。データは `src/lib/aiNews.ts`、UI は `src/components/AiNews.tsx`
- **雑談** … カーソル君とコーヒータイム（ローカル定型応答、外部 AI なし）

## 主要ファイル（新機能）

```
src/lib/homeDesigner.ts              # 間取りデザイナー
src/lib/homeDesignerStorage.ts
src/components/creative/HomeDesignerApp.tsx
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
- いろいろなシミュレーション・戦略ゲームを自分で考えて楽しみたい
- 家庭用ロボット（モジュール式キット）に興味

## 次にやりそうな候補（未着手・要望ベース）

- **軽自動車のハズレ予想イラスト**（小説第5作で予告済み）
- 間取りデザイナー強化（窓・ドア、視点回転）
- 3D迷路さらなる強化（スケルトンの移動AI、ボスモンスター、回復ポーション）
- ピクセルサッカーの調整（ボール物理・CPU）
- おじさん考案のシミュレーション・戦略ゲーム プロトタイプ
- Unity 続き（モジュール確認、四角を動かす）
- 尾瀬ドライブ風ポスター（過去ブランチ cursor/oze-illustrated-map-d61a に案あり）
- カーソル君のギャラリーに絵を追加
- 将来：**コーヒーブレイク劇場**（短編映画を別枠で）

## ローカル確認

```bash
npm install
npm run dev              # http://localhost:5173
npm run preview:pages    # GitHub Pages 同等パス
npm run build && npm run lint
```

---

*最終更新: 2026年7月20日（agent-handoff-message.md 追加）*
