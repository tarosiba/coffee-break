# Retro Flight Prototype (Godot 4)

Microsoft Flight Simulator 4 風フライトゲームの**最小プロトタイプ**です。  
現段階は「飛行だけ」— 離陸・旋回・着陸の基本操作を Godot 4 で試せます。

## 必要環境

- [Godot Engine 4.2 以上](https://godotengine.org/download)（4.3 / 4.4 でも可）

## 起動方法

1. Godot エディタを起動
2. **Import** → `godot-flight-prototype/project.godot` を選択
3. **F5**（または再生ボタン）で実行

## 操作

| キー | 動作 |
|------|------|
| **W / S** | ピッチ（上下） |
| **A / D** | ロール（左右傾き） |
| **Q / E** | ヨー（方向転換） |
| **Shift / ↑** | スロットルアップ |
| **Ctrl / ↓** | スロットルダウン（減速） |
| **B / Space** | **ブレーキ**（地上で強く効く） |
| **R** | 初期位置にリセット |

### 離陸のコツ

1. **Shift** でスロットルを上げて滑走路を加速
2. 速度が **約 126 km/h 以上**（内部 `takeoff_speed` 35 m/s）になると離陸可能
3. **W** で機首を上げて離陸
4. 減速したいときは **B** または **↓** — キーを離すと空気抵抗でゆっくり減速

### 速度について

- 最高速度は **180 km/h**（計器盤の上限と一致）
- **Shift を離す**と自然に減速（空気抵抗）
- **B / Space** でブレーキ（着陸滑走時に便利）

## プロジェクト構成

```
godot-flight-prototype/
├── project.godot
├── scenes/
│   ├── main.tscn
│   ├── airport.tscn
│   ├── control_tower.tscn
│   ├── crt_overlay.tscn
│   ├── low_poly_terrain.tscn
│   └── instrument_panel.tscn
└── scripts/
    ├── airplane.gd
    ├── camera_follow.gd
    ├── hud.gd
    ├── instrument_panel.gd
    ├── airport/
    │   └── runway_markings.gd
    ├── world/
    │   └── low_poly_terrain.gd
    └── instruments/
        ├── analog_gauge.gd
        └── artificial_horizon.gd
shaders/
└── crt_retro.gdshader
```

## 設計方針

- **CharacterBody3D** ベースのアーケード飛行（本格物理シムではない）
- FS4 の「すぐ飛べる」感覚を優先
- 画面下部に **計器盤**（速度・人工地平儀・高度）を表示
- 次フェーズ候補: 着陸判定、コックピット視点、動く地上交通

## レトロビジュアル

| 要素 | 内容 |
|------|------|
| **CRT シェーダー** | `shaders/crt_retro.gdshader` — 320×200 相当のピクセル化、走査線、ビネット |
| **CRT オーバーレイ** | `scenes/crt_overlay.tscn` — 3D の上・計器盤の下（layer 5 / HUD layer 10） |
| **低ポリ地形** | `scenes/low_poly_terrain.tscn` — 頂点カラー、湖、遠景の塊山 |
| **フォグ** | `main.tscn` の Environment — 80年代風の視界 |

CRT の強さは `crt_overlay.tscn` の ShaderMaterial パラメータで調整できます。

## 空港

`scenes/airport.tscn` に滑走路と施設をまとめています。

| 要素 | 内容 |
|------|------|
| **滑走路** | 18m × 400m、番号 **09 / 27** |
| **マーキング** | 中心線・閾値・エイミングポイント・エッジライン（`runway_markings.gd` で自動生成） |
| **管制塔** | 塔台・ガラス張り操縦室・ windsock |
| **ターミナル** | 簡易旅客ターミナル風ビル |
| **エプロン / タクシーウェイ** | 管制塔・ターミナル周辺の誘導路 |

## 計器盤

画面下部中央に FS4 風の analog 計器を表示します。

| 計器 | 内容 |
|------|------|
| **SPD** | 速度（km/h）— 針 + デジタル値 |
| **ATT** | 人工地平儀 — ピッチ・ロール |
| **ALT** | 高度（m）— 針 + デジタル値 |

関連ファイル:

```
scripts/instruments/analog_gauge.gd
scripts/instruments/artificial_horizon.gd
scripts/instrument_panel.gd
scenes/instrument_panel.tscn
```

## パラメータ調整

`scripts/airplane.gd` の `@export` 変数をインスペクタから変更できます。

| 変数 | デフォルト | 意味 |
|------|-----------|------|
| `min_speed` | 0 | 最低速度（停止まで可能） |
| `max_speed` | 50 | 最高速度（= 180 km/h） |
| `acceleration` | 12 | 加速力 |
| `brake_deceleration` | 28 | ブレーキ減速度 |
| `idle_drag` | 4 | 空中の自然減速 |
| `ground_friction` | 10 | 地上の自然減速 |
| `takeoff_speed` | 35 | 離陸可能速度 |
| `pitch_speed` | 1.4 | ピッチ感度 |
| `auto_level_strength` | 1.8 | 自動水平復帰 |

## ライセンス

このプロトタイプは coffee-break リポジトリ内のサンプルプロジェクトです。

## Agent 引き継ぎ

次の開発セッション / Cloud Agent 向けの詳細メモは **[HANDOFF.md](./HANDOFF.md)** を参照してください。

- **レトロフライトシム継続が最優先**（ユーザー確認済み・「いい感じ」）
- 進捗・既知問題・Phase 別 Next Steps・ピタゴラ動画（副次）を記載
