# Coffee Break 会話まとめ（2026年8月22日セッション）

このドキュメントは、Cursor Cloud Agent（カーソル君）との会話（2026年8月21日〜22日）のまとめです。  
全体履歴は [conversation-summary.md](./conversation-summary.md)、引き継ぎ要点は [agent-handoff.md](./agent-handoff.md) も参照してください。

---

## セッション概要

| 項目 | 内容 |
|------|------|
| プロジェクト | `tarosiba/coffee-break` |
| テーマ | ゲームエンジン選び・Summer Engine 試用・MCP 設定・Windows セットアップ |
| コード変更 | **なし**（雑談・手順案内のみ） |
| おじさん PC | **Windows**（Node.js v24.19.0 確認済み） |

---

## 話題の流れ

### 1. ゲームエンジンの料金はどれくらい？

| 選択肢 | 料金 | おじさん向けメモ |
|--------|------|------------------|
| **Godot**（`anno_proto`） | 無料 | いまのまま継続で十分 |
| Unity | 個人無料枠あり | 学習用。急いで乗り換え不要 |
| **Summer Engine** | アプリ＋MCPは無料 | Cursor とエンジンをつなぐ試し用 |
| Summer Pro 以降 | $20〜/月 | AI で3D・画像・音声を大量生成したいとき |

**結論:** コード中心なら **Godot 無料 ＋ Cursor** のまま。Summer は **Free プラン** から MCP 連携を試す。

### 2. MCP（Model Context Protocol）の設定

- Cursor が外部ツール（エンジン・GitHub 等）を操作する仕組み
- Summer Engine 用の一括セットアップ:

```powershell
npx -y summer-engine@latest setup cursor --yes
```

- 手動設定は `~/.cursor/mcp.json`（Windows: `C:\Users\<ユーザー>\.cursor\mcp.json`）
- **iPad の Cloud Agent からは PC 上の Summer Engine には直接つながらない**（PC＋Cursor デスクトップ向け）

### 3. Summer Engine を試す手順（Windows 向けに詳説）

1. Node.js 18+ を確認（`node --version`）
2. `npx -y summer-engine@latest setup cursor --yes`
3. 必要なら `npx -y summer-engine@latest install`（約1GB）
4. `npx -y summer-engine@latest login`
5. `npx -y summer-engine@latest create my-first-summer-game`
6. `npx -y summer-engine@latest run my-first-summer-game`
7. Cursor 再起動 → Settings → MCP で `summer-engine` が緑か確認
8. 困ったら `npx -y summer-engine@latest doctor`

### 4. PowerShell とは？

- DOS 窓に似た **文字入力の黒い画面**（今の Windows 用コマンド画面）
- 開き方: Windows キー →「PowerShell」と検索

### 5. セットアップでつまずき（未解決 → 仕切り直し）

| 状況 | 内容 |
|------|------|
| 成功 | `node --version` → **v24.19.0** |
| 失敗 | PowerShell で `npx -y summer-engine@latest setup cursor --yes` を実行 |
| エラー | `PSSecurityException` / `UnauthorizedAccess` — スクリプト実行ポリシーで `npx.ps1` がブロック |

**次回の対処（おじさん向け・優先順）:**

1. **コマンドプロンプト（cmd）** で同じ `npx` コマンドを実行（設定変更不要・いちばん簡単）
2. または PowerShell で一度だけ:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

その後、再度 `npx -y summer-engine@latest setup cursor --yes`

**セッション締め:** おじさんが「仕切り直して始めたい」とのこと。**Summer Engine セットアップは cmd から再開**が次の一歩。

---

## main の状態（本セッション時点・参考）

8/18 以降にマージ済み（本セッションでは未着手）:

| PR | 内容 |
|----|------|
| #93 | AIニュース 2026-08-18（2本）・明るいAI 1本 |
| #94 | コーヒー豆占い（ホーム・1日1回） |
| #95 | AIニュース Particle6 バーチャル女優 Tilly Norwood |

---

## 雑談・相談で出た話題（コード変更なし）

| トピック | 内容 |
|----------|------|
| エンジン料金 | Godot 無料継続。Summer は MCP 無料、有料は AI アセット生成向け |
| Summer Engine | Godot 4 系ベース。Cursor MCP で 44 ツール。PC 必須 |
| MCP 一般 | Cursor Settings → MCP。エンジン起動中のみ接続 |
| PowerShell | DOS 窓に似たコマンド画面。初見でも問題なし |
| Windows セキュリティ | 実行ポリシーで npx が止まるのはよくある。cmd が回避策 |
| iPad との分け方 | PWA・雑談は Cloud Agent、ゲーム試作は Windows PC |

---

## 次にやりそうなこと

### Summer Engine（おじさん PC・Windows）

- [ ] **cmd** を開いて `npx -y summer-engine@latest setup cursor --yes` を再実行
- [ ] `doctor` で緑になるまで確認
- [ ] 試し用プロジェクト作成 → Cursor で「床を1枚」など動作確認
- [ ] `anno_proto` とは **別フォルダ** で実験（既存 Godot プロトはそのまま）

### Coffee Break PWA（従来どおり）

- anno_proto ズーム（「ズームして」— 先でOK）
- 人口・ニーズ（「人口で」）
- 明るいAI 1本 / AIニュース追加
- 今日の3つメモ【B】（コーヒー豆占い【C】は #94 で実装済み）

---

## セッション締め（8/22）

- おじさんが `/summarize` で仕切り直しを依頼
- Summer Engine は PowerShell の実行ポリシーで停止。**次回は cmd から再開**
- 本ドキュメントと引き継ぎ更新を実施

---

*最終更新: 2026年8月22日（セッション締め）*
