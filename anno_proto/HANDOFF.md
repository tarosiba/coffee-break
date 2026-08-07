# Coffee Break Island Proto — 引き継ぎ

創世紀1602風の島開発ゲーム（Godot 4）プロトタイプ。

## プロジェクト

- **場所:** `anno_proto/`（coffee-break リポジトリ内）
- **エンジン:** Godot 4.3+（GL Compatibility）
- **グラフィック:** `assets/sprites/mapchips/`（32×32 マップチップ、PR #81）
- **作業ブランチ:** `cursor/<descriptive-name>-9b60`

## 起動方法

1. Godot Hub で Godot 4.3 以上をインストール
2. **Import** → `anno_proto/project.godot` を選択
3. 初回はスプライトの `.import` が自動生成される（数十秒）
4. **F5** または Play で `scenes/main.tscn` を実行

## 現状（フェーズ1）

| 機能 | 状態 |
|------|------|
| 島地形（草地＋海） | ✅ |
| 建物配置（クリック） | ✅ |
| コーヒー小屋・小麦畑・耕起畑 | ✅ |
| 撤去 | ✅ |
| 資源（木材・小麦・コイン） | ✅ |
| 小麦畑の自動生産（2秒） | ✅ |
| 生産チェーン（小麦→パン） | ❌ 次フェーズ |
| 人口・ニーズ | ❌ 未実装 |
| 複数島・貿易 | ❌ 未実装 |

## 操作

- **左クリック:** 選択モードでタイルに配置 / 撤去モードで削除
- UI ボタンでモード切替（コーヒー小屋・小麦畑・耕起畑・撤去）

## コスト

| 建物 | 木材 | コイン |
|------|------|--------|
| コーヒー小屋 | 5 | 10 |
| 小麦畑 | 2 | 5 |
| 耕起畑 | 1 | 2 |

小麦畑は 2 秒ごとに小麦 +1、コイン +1。

## 主要ファイル

```
anno_proto/
  project.godot
  scenes/main.tscn
  scripts/main.gd
  assets/sprites/mapchips/   # 36枚のマップチップ
```

## 関連 PR（coffee-break）

- PR #80 Godot用アイソメ家・畑（高解像度版）
- PR #81 参考マップチップ風タイルセット（32/128px）

## 次の候補（優先はおじさんの一言）

1. **小麦→パン** の2段階生産チェーン
2. **風車・パン屋** マップチップ追加
3. **TileMap** への移行（現在は Sprite2D 配置）
4. **セーブ/ロード**（JSON）
5. **2島目** と船の貿易（PP2 / 1602 本丸）

## 大戦略プロトとの関係

- 大戦略98風は別リポジトリ（Godot、`daisenryaku_proto/HANDOFF.md`）
- 本プロトは **島開発・生産シミュ** 専用
- 同じ Godot 4 + HANDOFF + 小PR の運用で継続可能

## 注意

- スプライト元は `public/images/godot-mapchips/tiles-32/` と同期推奨
- Coffee Break PWA 本体とは独立（ビルドに影響なし）

---

*最終更新: 2026年8月7日 — フェーズ1 初回プロトタイプ*
