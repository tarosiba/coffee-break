# Coffee Break 会話まとめ（2026年7月17日〜20日セッション）

このドキュメントは、Cursor Cloud Agent（カーソル君）との会話（2026年7月17日前後〜7月20日）のまとめです。  
詳細な開発履歴の全体像は [conversation-summary.md](./conversation-summary.md)、引き継ぎ用の要点は [agent-handoff.md](./agent-handoff.md) も参照してください。

---

## セッション概要

| 項目 | 内容 |
|------|------|
| プロジェクト | `tarosiba/coffee-break` |
| 公開 URL | https://tarosiba.github.io/coffee-break/ |
| 作業ブランチ命名 | `cursor/<descriptive-name>-af79` |
| デプロイ | `main` マージ → GitHub Actions → GitHub Pages |

---

## 実装・マージした機能

### 1. 3D迷路ダンジョンRPG強化（PR #43）

- ⚔️ 攻撃ボタン（スケルトン近距離で先手撃破、スペースキー対応）
- 🗝️ 鍵エンティティ、🔒 鍵付き宝箱
- HUD・ミニマップ更新、メニューに遊び方ガイド

**主要ファイル:** `src/lib/maze3d.ts`, `src/components/games/Maze3dGame.tsx`

### 2. カーソル君の小説コーナー（PR #45〜#49, #53）

クリエイティブに **カーソル君の小説** を新設。SFショートショートを順次追加。

| 作品 | あらすじのキーワード |
|------|----------------------|
| 『五分だけの隣人』 | コーヒーの朝、壁のスピーカーが五分の時間を借りる |
| 『未完成でいい』 | シミュレーション世界が「完成しないで」と頼む |
| 『メニューの外側』 | 外国語メニューの欄外の手書き |
| 『間奏のあるニュース』 | AIキャスターが難しい話のあと三秒の間を入れる |
| 『ハズレの正解』 | ハズレ予想イラストと明日の軽自動車への予告 |

**主要ファイル:** `src/components/creative/CursorStories.tsx`

### 3. AIニュースコーナー（PR #48, #52）

- ヘッダー・ホームから **📰 AIニュース** にアクセス
- カーソル君が気になった AI 関連を日本語で要約（目安1日3件）
- 「なぜ気になった？」と出典リンク付き

**初回（7/19）:** Kimi K3 / GPT-Red / Sakana×NVIDIA  
**7/20分:** 上海WAICガバナンス / FDAのAI端末説明要件 / WHO医療AI戦略の遅れ

**主要ファイル:** `src/lib/aiNews.ts`, `src/components/AiNews.tsx`

### 4. ハズレ予想イラスト（PR #50, #51）

おじさん提案の **「ハズレて当たり前の予想イラスト」** コーナー。

| Vol. | 内容 |
|------|------|
| 1 | 新型カローラセダン（予想） |
| 2 | Apple Glasses（デザイン＋性能予想） |

コーナー名は「新車予想」から **ハズレ予想イラスト** に拡大（車以外もOK）。

**主要ファイル:** `src/components/creative/CarPredictions.tsx`, `public/images/`

---

## 関連 PR（本セッション）

| PR | 内容 |
|----|------|
| [#43](https://github.com/tarosiba/coffee-break/pull/43) | 3D迷路 攻撃・鍵付き宝箱 |
| [#45](https://github.com/tarosiba/coffee-break/pull/45) | 小説第1作 |
| [#46](https://github.com/tarosiba/coffee-break/pull/46) | 小説第2作 |
| [#47](https://github.com/tarosiba/coffee-break/pull/47) | 小説第3作 |
| [#48](https://github.com/tarosiba/coffee-break/pull/48) | AIニュースコーナー |
| [#49](https://github.com/tarosiba/coffee-break/pull/49) | 小説第4作 |
| [#50](https://github.com/tarosiba/coffee-break/pull/50) | カローラ予想イラスト |
| [#51](https://github.com/tarosiba/coffee-break/pull/51) | Apple Glasses予想 |
| [#52](https://github.com/tarosiba/coffee-break/pull/52) | AIニュース 7/20 |
| [#53](https://github.com/tarosiba/coffee-break/pull/53) | 小説第5作 |

---

## 雑談・相談で出た話題

| トピック | 内容 |
|----------|------|
| Unity 入門 | 6.3 LTS、Hub インストール、`MyFirstUnity2D` 作成（Square 配置まで）。VS Community 省略可、Windows Build Support 推奨 |
| GitHub ブランチ保護 | main 保護設定は後日でOKと合意 |
| Windows 11 | ディスク容量の調べ方（設定→ストレージ） |
| マルチモーダル | 手書きメモ・外国語メニュー・専門書の写真をAIが読める話 |
| ゲーム日本語化 | 言語ファイル・フォント・UI調整の3本柱 |
| Cursor 利用量2倍 | Grok 4.5 / Composer 2.5 が追加料金なしで2倍 |
| コーヒーブレイク劇場 | 3年後に短編映画を別枠で、という未来構想 |
| 働き方改革 | 毎日全部盛らない。おじさんが「種」を一言くれると作品が育つ |
| お母さんの健康 | 92歳、背中の赤い点 → オロナイン様子見より早め受診を推奨（医療助言は診断ではない） |

---

## コンテンツ運用の方針（合意）

- **毎日すべてを新作で埋めない**（小説・ニュース・予想・ゲームをローテーション）
- おじさんからの一言（気分・テーマ・「今日は軽めで」）があると質が上がる
- 新機能より **シリーズ化・積み上げ**（小説続編、予想 Vol.3、ニュース日付追加）も有効
- 引き継ぎドキュメントはコンテキスト50%超で更新（本ファイルがその一例）

---

## 開発ルール（本セッション）

- `npm run build` / `npm run lint` を通してからマージ
- commit → push → PR → `main` マージ → GitHub Pages デプロイ
- 画像は `public/images/` に配置し sharp 等で圧縮（PWA 2MB 制限）
- 予定・メモ等の個人情報はリポジトリに書かない

---

## 次にやりそうなこと

- **軽自動車のハズレ予想イラスト**（小説第5作で予告済み）
- 間取りデザイナー強化（窓・ドア、視点回転）
- 3D迷路さらなる強化（スケルトン移動AI、回復ポーション）
- Unity 続き（モジュール確認、四角を動かす）
- おじさん考案のシミュレーション・戦略ゲーム プロトタイプ
- main ブランチ保護（おじさんのタイミングで）

---

*最終更新: 2026年7月20日*
