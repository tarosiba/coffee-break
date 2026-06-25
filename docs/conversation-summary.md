# Coffee Break 開発まとめ

このドキュメントは、Cursor Cloud Agent による Coffee Break アプリの開発会話のまとめです。

**公開 URL:** https://tarosiba.github.io/coffee-break/

---

## プロジェクト概要

Coffee Break は、仕事の合間にひと息つける PWA 対応の Web アプリです。

- React 19 + TypeScript + Vite + Tailwind CSS 4
- GitHub Pages + GitHub Actions による自動デプロイ
- ホーム画面に追加してアプリのように利用可能

---

## 追加・改善した機能

### 1. カレンダー機能

- 日付ごとに予定（タイトル・時刻・メモ）を保存
- データはブラウザの localStorage に永続化
- 上部ナビの **カレンダー** タブから利用

**関連 PR:** [#3 カレンダー機能の追加](https://github.com/tarosiba/coffee-break/pull/3)

---

### 2. 将棋（初級・中級）

- **初級:** ランダム寄りの気軽に遊べる CPU
- **中級:** ミニマックス探索（深さ3）で数手先を読む CPU
- 持ち駒・成り対応
- 難易度は対局前に切り替え可能
- 飛車・角の初期配置を修正（先手・後手それぞれ正しい位置に）

**関連 PR:**

- [#11 将棋の中級AIを追加](https://github.com/tarosiba/coffee-break/pull/11)
- [#12 将棋の飛車・角配置修正と初級モード復活](https://github.com/tarosiba/coffee-break/pull/12)
- [#13 将棋のAI側（後手）の飛車・角配置を修正](https://github.com/tarosiba/coffee-break/pull/13)

---

### 3. オセロ（初級・中級）

- 8×8 盤、黒（プレイヤー）が先手
- **初級:** 手加減あり（ランダム寄り + 浅い判断）
- **中級:** 角・形を読むミニマックス探索 CPU
- 置けるマスをハイライト表示、パス対応

**関連 PR:**

- [#14 オセロゲームを追加](https://github.com/tarosiba/coffee-break/pull/14)
- [#15 オセロに初級・中級の難易度選択を追加](https://github.com/tarosiba/coffee-break/pull/15)

---

### 4. エアホッケー

- Canvas ベースのリアルタイムゲーム
- タップ / ドラッグでパドル操作（iPad・スマホ対応）
- CPU 相手、先に **5点** 取った方の勝ち
- パドルの勢いがパックに伝わる物理演算
- CPU がパックを追いかけて打ち返すラリー型プレイ

**関連 PR:**

- [#16 エアホッケーゲームを追加](https://github.com/tarosiba/coffee-break/pull/16)
- [#17 エアホッケーの打ち合いプレイを改善](https://github.com/tarosiba/coffee-break/pull/17)

---

## 既存機能（参考）

| カテゴリ | ゲーム |
|---------|--------|
| ボード | 五目並べ、人生ゲーム、三目並べ |
| トランプ | 神経衰弱 |
| シューティング | スターシューター |
| カジュアル | じゃんけん、数当て |
| その他 | カレンダー、お絵描き、コーヒータイム |

---

## デプロイ方法

1. 機能ブランチで開発
2. `main` ブランチへマージ
3. GitHub Actions（`.github/workflows/deploy.yml`）が自動ビルド・デプロイ
4. 数分後に https://tarosiba.github.io/coffee-break/ へ反映

### ホーム画面への追加（iPad / iPhone）

1. Safari で公開 URL を開く
2. 共有ボタン →「ホーム画面に追加」
3. アイコンからアプリのように起動

---

## ローカル開発

```bash
npm install
npm run dev          # 開発サーバー
npm run build        # 本番ビルド
npm run lint         # ESLint
npm run preview:pages # GitHub Pages 向けプレビュー
```

---

## 変更ファイルの主な構成

```
src/
├── components/
│   ├── games/
│   │   ├── ShogiGame.tsx
│   │   ├── OthelloGame.tsx
│   │   ├── AirHockeyGame.tsx
│   │   └── ...
│   ├── Calendar.tsx
│   └── Games.tsx
├── lib/
│   ├── shogi.ts
│   ├── othello.ts
│   └── airHockey.ts
└── types.ts
```

---

*最終更新: 2026年6月（Cursor Cloud Agent による開発セッション）*
