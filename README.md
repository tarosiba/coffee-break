# Coffee Break ☕

仕事の合間にひと息つける、ゲーム＆雑談アプリです。iPad のホーム画面に追加して、アイコンからすぐ遊べます。

## 公開 URL

**https://tarosiba.github.io/coffee-break/**

（`main` ブランチへの push 後、GitHub Actions が自動デプロイします）

## 機能

- **PWA 対応** — ホーム画面に追加してアプリのように起動
- **ミニゲーム**
  - 🂠 神経衰弱（トランプ）
  - ⚫ 五目並べ
  - 🎲 人生ゲーム（ボードゲーム風）
  - ✊ じゃんけん
  - 🔢 数当て
  - ⭕ 三目並べ
- **雑談ルーム** — ニックネームを設定して気軽にチャット

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
