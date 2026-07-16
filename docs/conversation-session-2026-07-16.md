# Coffee Break 会話まとめ（2026年7月10日〜16日セッション）

このドキュメントは、Cursor Cloud Agent（カーソル君）との会話（2026年7月10日前後〜7月16日）のまとめです。  
詳細な開発履歴の全体像は [conversation-summary.md](./conversation-summary.md)、引き継ぎ用の要点は [agent-handoff.md](./agent-handoff.md) も参照してください。

---

## セッション概要

| 項目 | 内容 |
|------|------|
| プロジェクト | `tarosiba/coffee-break` |
| 公開 URL | https://tarosiba.github.io/coffee-break/ |
| 作業ブランチ命名 | `cursor/<descriptive-name>-d7b4` |
| デプロイ | `main` マージ → GitHub Actions → GitHub Pages |

---

## 実装・マージした機能

### 1. README・引き継ぎドキュメント（PR #32, #33）

- README の機能一覧を現状に合わせて更新（時計・メモ・予定リマインド・ギャラリー）
- `docs/agent-handoff.md` の先頭を「コーヒーproject 3引き継ぎ」に更新し、最新内容に同期

### 2. 間取りデザイナー（PR #34, #35）

- クリエイティブに **間取りデザイナー** を追加
- 2D 平面図: 部屋ドラッグ、家具・壁紙・床の選択
- 3D 表示: アイソメトリックのドールハウス視点
- localStorage 保存、PNG エクスポート
- 3D 壁描画バグ修正（北壁二重・南東壁欠落）、面ごとの深度ソート

**主要ファイル:** `src/lib/homeDesigner.ts`, `src/lib/homeDesignerStorage.ts`, `src/components/creative/HomeDesignerApp.tsx`

### 3. 3D迷路ミニゲーム（PR #36, #37, #38）

- Win95「3D 迷路」スクリーンセーバー風の一人称ゲーム（レイキャスティング）
- モード: **ふつう** / **ダンジョンRPG**
- 迷路サイズ（小・中・大）、テクスチャ（クラシック・コズミック・ガーデン）
- **90度曲がりボタン**（↺90° / 90°↻）、キーボード左右矢印も90度回転
- ダンジョンRPG: 宝箱収集、スケルトン遭遇で HP 減少、ミニマップ、ゲームオーバー

**主要ファイル:** `src/lib/maze3d.ts`, `src/components/games/Maze3dGame.tsx`

### 4. カーソル君の絵ギャラリー追加（PR #39, #40）

- サッカー選手イラスト（髪を少し増やした版）`argentina-player-more-hair.jpg`
- 大冒険イラスト（看板なし版）`adventure-no-signs.jpg`
  - 「大冒険イベント」「これぞ、ゴール！」「矢印」看板を除いた版

**主要ファイル:** `public/images/`, `src/components/creative/CursorGallery.tsx`

---

## 関連 PR（本セッション）

| PR | 内容 |
|----|------|
| [#32](https://github.com/tarosiba/coffee-break/pull/32) | README 機能一覧更新 |
| [#33](https://github.com/tarosiba/coffee-break/pull/33) | 引き継ぎドキュメント更新 |
| [#34](https://github.com/tarosiba/coffee-break/pull/34) | 間取りデザイナー追加 |
| [#35](https://github.com/tarosiba/coffee-break/pull/35) | 間取り3D表示修正 |
| [#36](https://github.com/tarosiba/coffee-break/pull/36) | 3D迷路ミニゲーム |
| [#37](https://github.com/tarosiba/coffee-break/pull/37) | 90度曲がりボタン |
| [#38](https://github.com/tarosiba/coffee-break/pull/38) | ダンジョンRPGモード |
| [#39](https://github.com/tarosiba/coffee-break/pull/39) | サッカー選手イラスト |
| [#40](https://github.com/tarosiba/coffee-break/pull/40) | 大冒険イラスト（看板なし） |

---

## 雑談・考えたこと

| トピック | 内容 |
|----------|------|
| マイホームデザイナー | 家具5万点より「間取り→内装→3D」が本質。Coffee Break 版は簡易 MVP |
| コードの家 | アプリ＝リポジトリの比喩。おじさんと一緒に作る |
| シミュレーションゲーム | 自分で考えたルールをゲームとして楽しみたい。小さく試作→遊ぶ→足す |
| 家庭用ロボット | 自立型ロボットの家事能力、家庭ごとにキットを組み替える発想 |
| 自律型AI | 好みを覚えて作る＝パーソナルAI。「たまに『これどう？』」＝半自律のパートナー |
| おじさんの定義 | **相談相手兼パートナー** が理想（👍で合意） |

---

## 開発ルール（本セッション）

- `npm run build` / `npm run lint` を通してからマージ
- commit → push → PR → `main` マージ → GitHub Pages デプロイ
- 生成画像は `public/images/` に配置し圧縮（PWA 2MB 制限）
- 予定・メモ等の個人情報はリポジトリに書かない

---

## 次にやりそうなこと

- 間取りデザイナー強化（窓・ドア、視点回転）
- 3D迷路（攻撃ボタン、鍵付き宝箱）
- おじさん考案のシミュレーション・戦略ゲーム プロトタイプ
- 会話継続（半自律の相談相手兼パートナーとして）

---

*最終更新: 2026年7月16日*
