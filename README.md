# Coffee Break ☕

仕事の合間にひと息つける、ゲーム＆雑談アプリです。iPad のホーム画面に追加して、アイコンからすぐ遊べます。

## 公開 URL

**https://tarosiba.github.io/coffee-break/**

（`main` ブランチへの push 後、GitHub Actions が自動デプロイします）

## 機能

- **PWA 対応** — ホーム画面に追加してアプリのように起動
- **ホーム** — カーソル君の今日の予定リマインド、各タブへの導線
- **カレンダー** — 日付ごとの予定を localStorage に保存（端末内のみ、外部送信なし）
- **コーヒーブレイク時計** — アナログ時計で今の時刻を確認
- **コーヒーブレイクメモ** — テキストメモと音声メモ（localStorage に保存）
- **ミニゲーム**
  - 🧱 3D迷路（Win95スクリーンセーバー風・ゴールを目指す）
  - 🚀 スターシューター
  - 🂠 神経衰弱（トランプ）
  - ⚫ 五目並べ
  - 🎲 人生ゲーム（ボードゲーム風）
  - ✊ じゃんけん
  - 🔢 数当て
  - ⭕ 三目並べ
  - ♟️ 将棋（初級・中級、持ち駒・成りあり）
  - ⚪ オセロ（初級・中級）
  - 🔴 チェッカー（初級・中級、斜めに駒取り）
  - ⚽ ピクセルサッカー（4対4、初級・中級）
  - 🏒 エアホッケー（初級・中級、5点先取）
- **クリエイティブ** — お絵描き、写真スケッチ、**間取りデザイナー**（平面図→3D）、**カーソル君の絵**（ペンローズの階段・しば犬など）
- **カーソル君とコーヒータイム** — カーソル君と気軽に雑談（ローカル定型応答、外部 AI なし）

## iPad でホーム画面に追加する方法

1. Safari で **https://tarosiba.github.io/coffee-break/** を開く
2. 共有ボタン（□に↑）をタップ
3.「ホーム画面に追加」を選択
4. ホーム画面の Coffee Break アイコンから起動

## GitHub Pages の初回設定（リポジトリ管理者向け）

1. GitHub のリポジトリページを開く
2. **Settings** → **Pages**
3. **Build and deployment** → **Source** で **GitHub Actions** を選択
4. `main` ブランチにマージすると、自動的にデプロイが始まります

## 技術スタック

- React 19 + TypeScript
- Vite + vite-plugin-pwa
- Tailwind CSS 4
- GitHub Pages + GitHub Actions

## ローカル開発

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

GitHub Pages と同じパスで確認する場合:

```bash
npm run preview:pages
```

→ http://localhost:4173/coffee-break/

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run preview:pages` | GitHub Pages 向けビルドのプレビュー |
| `npm run lint` | ESLint 実行 |

## ライセンス

MIT
