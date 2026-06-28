# Coffee Break 引き継ぎメッセージ

新しい Cursor Agent 向けの引き継ぎドキュメントです。詳細な開発履歴は [conversation-summary.md](./conversation-summary.md) も参照してください。

---

## プロジェクト

- **リポジトリ:** `tarosiba/coffee-break`
- **公開 URL:** https://tarosiba.github.io/coffee-break/
- **種別:** PWA 対応 Web アプリ（React 19 + TypeScript + Vite + Tailwind CSS 4）
- **デプロイ:** `main` へマージ → GitHub Actions（`.github/workflows/deploy.yml`）→ GitHub Pages 自動反映

---

## 開発ルール（Cloud Agent）

- 作業ブランチ: `cursor/<descriptive-name>-c59e`
- 変更後は commit → push → PR 作成 → `main` へマージ
- `npm run build` と `npm run lint` を通す

---

## この会話で追加・改善した機能

1. **カレンダー** — 予定保存（localStorage）、PWA 対応
2. **将棋** — 初級（ランダム寄り）/ 中級（ミニマックス深さ3）、持ち駒・成りあり
3. **オセロ** — 初級 / 中級、8×8、パス対応
4. **エアホッケー** — Canvas、ドラッグ操作、5点先取、打ち合い型物理

---

## 重要な修正履歴

- **将棋:** 先手は **角が左・飛車が右**、後手（CPU）は **飛車が左・角が右**（向かい合った正しい配置）
- **オセロ:** 初級は手加減あり、中級は minimax 探索
- **エアホッケー:** パドル速度がパックに伝わる・CPU が打ち返す（PR #17）

---

## 主要ファイル

```
src/components/Games.tsx      # ミニゲーム一覧
src/components/games/         # 各ゲーム UI
src/lib/shogi.ts              # 将棋エンジン + AI
src/lib/othello.ts            # オセロ + AI
src/lib/airHockey.ts          # エアホッケー物理
src/types.ts                  # GameId など
docs/conversation-summary.md  # 会話まとめ（詳細）
docs/conversation-session-2026-06-27.md  # 2026-06-27 セッションまとめ
docs/agent-handoff.md         # 本ドキュメント
```

---

## 既存ゲーム（参考）

スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ、カレンダー、お絵描き、コーヒータイム など

---

## ユーザーの傾向・要望

- **日本語 UI**、シンプルで見やすいデザイン（coffee テーマ）
- **PWA / ホーム画面追加** を重視（Safari 共有 → ホーム画面に追加）
- ボードゲームは **初級・中級の2モード** を好む（将棋・オセロで実装済み）
- 「おじさん」= プレイヤー（先手）の呼び方として使われたことがある
- 公開 URL で実際に遊べる状態まで（マージ・デプロイ）してほしい

---

## ローカル確認

```bash
npm install
npm run dev              # http://localhost:5173
npm run preview:pages    # GitHub Pages 同等パス
```

---

## 関連 PR（参考）

| PR | 内容 |
|----|------|
| #3 | カレンダー |
| #11–13 | 将棋 |
| #14–15 | オセロ |
| #16–17 | エアホッケー |
| #18 | docs まとめ |

---

## 次にやりそうなこと（未着手）

- README の機能一覧更新（対応済み）
- その他ミニゲーム追加

---

## 最初に読むファイル

1. `docs/conversation-summary.md`
2. `docs/agent-handoff.md`（本ファイル）
3. `src/components/Games.tsx`
4. 変更対象ゲームの `src/lib/*.ts` と `src/components/games/*.tsx`

---

*最終更新: 2026年6月*
