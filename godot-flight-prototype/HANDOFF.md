# Agent Handoff — Godot Retro Flight Prototype

> **最終更新:** 2026-06-13  
> **対象読者:** 次の Cursor Cloud Agent / 開発セッション  
> **ユーザー言語:** 日本語（丁寧・構造化された説明を好む）

---

## 1. このプロジェクトは何か

**Microsoft Flight Simulator 4（1989）風**のレトロフライトゲームを **Godot 4** で作る個人プロトタイプ。

- リポジトリ: `tarosiba/coffee-break`
- 作業ディレクトリ: `godot-flight-prototype/`（メインアプリ `coffee-break` PWA とは別物）
- ブランチ: `cursor/godot-flight-prototype-d61a`
- PR: https://github.com/tarosiba/coffee-break/pull/6 （draft）

### ユーザーのゴール（会話から）

| 優先 | 内容 |
|------|------|
| 高 | FS4 の「1989年ワクワク感」— 低ポリ・単色世界・すぐ飛べる操作 |
| 高 | 買い切りゲーム的なシンプルさ（課金・オンライン不要） |
| 中 | 計器盤・空港など“フライトシムっぽさ” |
| 次 | **レトロ CRT シェーダー**、低ポリ地形 |
| 別スレ | **ピタゴラスイッチ風動画**（Kling AI 等）— コード未実装、下記 §6 参照 |

---

## 2. 現状サマリー（動くもの）

ユーザーは **Godot 4.6.3** で起動・離陸まで確認済み。

| 機能 | 状態 | 主要ファイル |
|------|------|-------------|
| アーケード飛行 | ✅ | `scripts/airplane.gd` |
| 追尾カメラ | ✅ | `scripts/camera_follow.gd` |
| 計器盤（SPD / ATT / ALT） | ✅ | `scripts/instruments/*`, `scenes/instrument_panel.tscn` |
| ブレーキ・自然減速 | ✅ | `scripts/airplane.gd` + `project.godot` input |
| 空港（滑走路・マーキング・管制塔） | ✅ | `scenes/airport.tscn`, `runway_markings.gd` |
| レトロシェーダー / 地形 | ❌ 未着手 | — |

### 起動方法

```
Godot 4.2+ → Import → godot-flight-prototype/project.godot → F5
```

### 操作（ユーザー向け）

| キー | 動作 |
|------|------|
| W/S | ピッチ |
| A/D | ロール（空中のみ） |
| Q/E | ヨー |
| Shift / ↑ | 加速 |
| Ctrl / ↓ | 減速 |
| B / Space | ブレーキ（地上強め） |
| R | リセット |

- 離陸: Shift 加速 → 約 126 km/h（35 m/s）→ W で機首上げ
- 最高速度: 180 km/h（内部 `max_speed = 50` m/s）
- スポーン: 滑走路 09 番端付近 `(0, 1.2, 80)`

---

## 3. アーキテクチャ要点

```
main.tscn
├── Ground（草原 4000×4000）
├── Airport（instance）← 滑走路・マーキング・塔・ターミナル
├── Airplane（CharacterBody3D, group "airplane"）
├── ChaseCamera
└── HUD
    ├── InstrumentPanel（instance）
    └── HelpLabel
```

### 設計判断（変えない unless ユーザー要望）

1. **CharacterBody3D** — RigidBody ではなく arcade 飛行。本格物理シムではない。
2. **シグナル `instruments_updated`** — 計器は `airplane.gd` から毎フレーム受信。
3. **マーキングは `_ready()` で procedural 生成** — `runway_markings.gd`
4. **速度単位** — 内部 m/s、表示 km/h（×3.6）

### 計器データ

```gdscript
instruments_updated.emit(
    speed * 3.6,           # km/h
    altitude_m,
    throttle_pct,
    rad_to_deg(rotation.x),   # pitch
    rad_to_deg(-rotation.z),  # roll（人工地平儀用に符号反転）
)
```

---

## 4. 既知の問題と対策（重要）

### Godot 4.6 の厳格型推論

**`:=` で型推論すると Parser Error になる**ことがある。ループ変数・配列リテラルに注意。

```gdscript
# NG
for mark in [-20, -10, 10, 20]:
    var y := pitch_offset - mark * 1.6

# OK
for mark: float in [-20.0, -10.0, 10.0, 20.0]:
    var y: float = pitch_offset - mark * 1.6
```

**修正済みファイル:**

- `scripts/instruments/artificial_horizon.gd`
- `scripts/instruments/analog_gauge.gd`
- `scripts/airport/runway_markings.gd`

新規 GDScript 追加時は **Godot 4.6 想定で型を明示**すること。

### Mac で Ctrl が効きにくい

→ `B` / `Space` / `↓` をブレーキ・減速に割当済み。

### 速度が落ちない報告（解決済み）

- 旧 `min_speed = 25` は未使用だったが混乱の元
- 現状: ブレーキ + `idle_drag` / `ground_friction` で減速可能

---

## 5. コミット履歴（Godot 関連）

| コミット | 内容 |
|---------|------|
| `67b52f5` | 最小飛行プロトタイプ |
| `eccb7fb` | 計器盤 |
| `76da44e` | 計器の型推論修正 |
| `739b1c2` | ブレーキ・自然減速 |
| `17be457` | 空港・マーキング・管制塔 |
| `d6e8124` | runway_markings 型推論修正 |

---

## 6. 別スレッド — ピタゴラスイッチ風動画（Kling AI）

**リポジトリにはコードなし。** 以前の会話でユーザーが言及した創作アイデア。

### 概要

- NHK「ピタゴラスイッチ」風の **連鎖・仕掛け** の短尺動画
- **Kling AI** 等で映像生成するワークフローを Cursor に設計させたい、という相談があった
- 英語の **meta-prompt** を口頭/チャットで提案したが、**ファイルとしては未保存**

### 次 Agent がやるなら

1. ユーザーに「Godot ゲームの宣伝動画か / 独立した映像作品か」を確認
2. 必要なら `docs/pythagora-switch-kling-prompt.md` としてプロンプトテンプレを保存
3. Godot 側との連携（録画・スクリーンショット素材）は未着手

### ピタゴラスイッチ風の“ゲーム内”要素（将来案）

FS4 プロトタイプとは別軸だが、ユーザーが混同しうる:

- 空港周辺に **仕掛け・連鎖ギミック**（離着陸トリガーで何かが動く）
- レトロ CM 風 **イントロ演出**

→ ユーザー明示要望がない限り、フライトシム本体を優先。

---

## 7. 推奨 Next Steps（優先順）

### A. レトロビジュアル（ユーザーが次に自然）

1. **CRT / スキャンライン PostProcess** — 内部解像度 640×480、4:3 オプション
2. **頂点カラー地形** — テクスチャなしの FS4 風地面
3. **単色ポリゴン建物** — 空港を低ポリ化

### B. ゲームプレイ

1. 着陸判定（滑走路内・速度閾値）
2. 失速の簡易演出
3. コックピット視点カメラ切替

### C. 空港拡張

1. 滑走路灯・PAPI 風ライト
2. 衝突判定（StaticBody3D）— 現状は見た目のみ

### D. ピタゴラ動画（別タスク）

1. プロンプト文書化
2. Kling 用シーンリスト作成

---

## 8. ユーザー文脈（他トピック・参考）

同一会話内で触れたが **本プロジェクト外**:

| トピック | メモ |
|---------|------|
| 静岡 → 尾瀬 | ドライブマップ PR #5 |
| ソルテラ vs トレイルシーカー | EV 比較 |
| Pixel Cup Soccer | iOS 買い切りサッカー |
| MacBook Air M3 中古 | 140k 予算 |
| 柴犬 | 飼育検討 |

Godot 作業時は **FS4 レトロフライト** に集中。

---

## 9. 開発ルール（Cloud Agent）

- ブランチ: `cursor/<name>-d61a`
- 変更後: commit → push → PR 更新
- スコープ最小 — フライトプロトタイプ外の `coffee-break` PWA は触らない
- README と本 HANDOFF を実装後に更新

---

## 10. クイック参照 — 主要パラメータ

`scripts/airplane.gd`:

| 変数 | 値 | 備考 |
|------|-----|------|
| max_speed | 50 m/s | 180 km/h |
| takeoff_speed | 35 m/s | 126 km/h |
| acceleration | 12 | |
| brake_deceleration | 28 | 地上 ×2 |
| idle_drag | 4 | 空中 |
| ground_friction | 10 | 地上 |

---

## 11. 引き継ぎチェックリスト

次 Agent が最初にやること:

- [ ] `cursor/godot-flight-prototype-d61a` を checkout
- [ ] `godot-flight-prototype/project.godot` を Godot 4.6 で開き F5 確認
- [ ] 本ファイル `HANDOFF.md` と `README.md` を読む
- [ ] ユーザーに「次は CRT シェーダー / 地形 / ピタゴラ動画」のどれか確認
- [ ] 新 GDScript は **型明示** で書く

---

*このファイルは Agent 間のコンテキスト引き継ぎ用。ユーザー向け説明は `README.md` を参照。*
