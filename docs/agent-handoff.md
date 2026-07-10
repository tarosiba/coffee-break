コーヒーproject 3引き継ぎ

# Coffee Break 引き継ぎメッセージ（2026年7月10日時点）

## プロジェクト

- **リポジトリ:** tarosiba/coffee-break
- **公開 URL:** https://tarosiba.github.io/coffee-break/
- **種別:** PWA 対応 Web アプリ（React 19 + TypeScript + Vite + Tailwind CSS 4）
- **デプロイ:** main へマージ → GitHub Actions（.github/workflows/deploy.yml）→ GitHub Pages 自動反映

## 開発ルール（Cloud Agent）

- 作業ブランチ: `cursor/<descriptive-name>-3aab`
- 変更後は commit → push → PR 作成 → main へマージ
- `npm run build` と `npm run lint` を通す
- 可能なら GitHub の main までマージ・デプロイまでお願いします

## まず読むファイル

1. docs/agent-handoff.md
2. docs/conversation-session-2026-07-10.md（直近セッション）
3. docs/conversation-session-2026-06-27.md
4. docs/conversation-summary.md（全体履歴）
5. src/components/Games.tsx
6. 変更対象の src/lib/*.ts と src/components/games/*.tsx

## 直近セッション（2026年7月4日〜10日）でマージ済み

- **PR #26** ホーム画面にカーソル君の今日の予定リマインド（TodayReminder）
- **PR #27–28** ペンローズの階段イラスト・ギャラリー（画像2.3MB→270KB圧縮でPWAビルド修正）
- **PR #30** しば犬イラストを「カーソル君の絵」ギャラリーに追加
- **PR #31** 会話まとめ docs（conversation-session-2026-07-10.md）
- **PR #32** README の機能一覧更新（時計・メモ・予定リマインド・ギャラリー追記）

## 既存機能（main の状態）

- **ホーム** … 予定リマインド（カーソル君）、各タブへの導線
- **カレンダー** … localStorage に予定保存
- **時計・メモ** … コーヒーブレイク時計、メモ（音声メモあり）
- **ミニゲーム** … 将棋・オセロ・チェッカー・サッカー・エアホッケー（いずれも初級/中級）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- **クリエイティブ** … お絵描き、写真スケッチ、**カーソル君の絵**（ペンローズの階段・しば犬）
- **雑談** … カーソル君とコーヒータイム（ローカル定型応答、外部 AI なし）

## ゲーム実装の共通パターン

- ボード/スポーツ系は初級・中級の2モード
- CPU ロジックは src/lib/*.ts、UI は src/components/games/*.tsx
- Canvas 系: エアホッケー（airHockey.ts）、スターシューター、ピクセルサッカー（soccer.ts）

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

## プライバシー（重要）

- カレンダー/メモのデータは端末の localStorage のみ。サーバー送信なし
- ユーザーがチャットで送った予定スクショ等は会話内のみ使用。リポジトリに含めない

## おじさんの個人的な文脈（雑談で出た話）

- お母さんは認知症。認知症・健康長寿に関心あり
- 国立長寿医療研究センター「すこやかな高齢期をめざして」を読んでいる
- ワールドカップ 2026 を観戦（カーボベルデ、アルゼンチン、ノルウェー・ブラジル、日本代表の守備の話など）
- Cursor for iOS を Pro で利用。Cloud Agents セットアップ済み
- Windows ↔ iOS のファイル転送（LocalSend 等）に興味あり
- iOS で PC-98（RetroArch + NP2 Kai）、Windows（UTM SE）の話あり

## 次にやりそうな候補（未着手・要望ベース）

- ピクセルサッカーの調整（ボール物理・CPU）
- 尾瀬ドライブ風ポスター / イラスト（別ブランチ cursor/oze-illustrated-map-d61a に過去案あり）
- カーソル君のギャラリーに絵を追加（生成画像は public/images + CursorGallery.tsx）
- その他ミニゲーム追加

## ローカル確認

```bash
npm install
npm run dev              # http://localhost:5173
npm run preview:pages    # GitHub Pages 同等パス
npm run build && npm run lint
```

---

*最終更新: 2026年7月10日*
