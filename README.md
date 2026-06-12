# Coffee Break ☕

仕事の合間にひと息つける、ゲーム＆雑談アプリです。iPad のホーム画面に追加して、アイコンからすぐ遊べます。

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

1. Safari でアプリの URL を開く
2. 共有ボタン（□に↑）をタップ
3.「ホーム画面に追加」を選択
4. ホーム画面の Coffee Break アイコンから起動

## 技術スタック

- React 19 + TypeScript
- Vite + vite-plugin-pwa
- Tailwind CSS 4

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド（PWA アイコン自動生成含む） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | ESLint 実行 |

## ライセンス

MIT
