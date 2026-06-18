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
| **Shift** | スロットルアップ |
| **Ctrl** | スロットルダウン |
| **R** | 初期位置にリセット |

### 離陸のコツ

1. **Shift** でスロットルを上げて滑走路を加速
2. 速度が **約 35 km/h 以上**（内部 `takeoff_speed`）になると離陸可能
3. **W** で機首を上げて離陸

## プロジェクト構成

```
godot-flight-prototype/
├── project.godot       # プロジェクト設定・入力マップ
├── scenes/
│   ├── main.tscn       # メインシーン（地面・滑走路・機体・カメラ）
│   └── instrument_panel.tscn
└── scripts/
    ├── airplane.gd     # 飛行制御 + 計器データ送信
    ├── camera_follow.gd
    ├── hud.gd          # ヘルプ表示用 CanvasLayer
    ├── instrument_panel.gd
    └── instruments/
        ├── analog_gauge.gd
        └── artificial_horizon.gd
```

## 設計方針

- **CharacterBody3D** ベースのアーケード飛行（本格物理シムではない）
- FS4 の「すぐ飛べる」感覚を優先
- 画面下部に **計器盤**（速度・人工地平儀・高度）を表示
- 次フェーズ候補: レトロシェーダー、低ポリ地形、空港オブジェクト

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
| `min_speed` | 25 | 最低速度 |
| `max_speed` | 90 | 最高速度 |
| `takeoff_speed` | 35 | 離陸可能速度 |
| `pitch_speed` | 1.4 | ピッチ感度 |
| `auto_level_strength` | 1.8 | 自動水平復帰 |

## ライセンス

このプロトタイプは coffee-break リポジトリ内のサンプルプロジェクトです。
