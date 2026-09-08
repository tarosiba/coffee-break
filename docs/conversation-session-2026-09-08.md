# Coffee Break 会話まとめ（2026年9月1日〜9月8日セッション）

このドキュメントは、Cursor Cloud Agent（カーソル君）との会話（2026年9月1日〜9月8日）のまとめです。  
全体履歴は [conversation-summary.md](./conversation-summary.md)、引き継ぎ要点は [agent-handoff.md](./agent-handoff.md) も参照してください。

---

## セッション概要

| 項目 | 内容 |
|------|------|
| プロジェクト | `tarosiba/coffee-break` |
| 公開 URL | https://tarosiba.github.io/coffee-break/ |
| テーマ | AIニュース追加、PC版Cursor・Git、プライベートLLM、イラスト雑談、Cursor/Anysphere、丸投げアプリ調査 |
| 作業ブランチ命名 | `cursor/<descriptive-name>-9b60` |

---

## 実装・マージした機能

### Coffee Break PWA

| PR | 内容 |
|----|------|
| [#106](https://github.com/tarosiba/coffee-break/pull/106) | 9/1セッション会話まとめ（前セッション分） |
| [#107](https://github.com/tarosiba/coffee-break/pull/107) | AIニュース 2026-09-01（2本）：iOSプライベートLLM・Cursor PC版ホーム画面 |

- `npm run build` / `npm run lint` 通過
- GitHub Actions デプロイ成功確認済み
- **主要ファイル:** `src/lib/aiNews.ts`

---

## 雑談・相談（コード変更なし）

### PC版 Cursor・Git（おじさん PC）

| トピック | 内容 |
|----------|------|
| Open File | ユーザーフォルダに `coffee-break` は見当たらず（未 Clone） |
| Clone repo | **クリック不可** → 原因は **Git 未インストール**（cmd で `git` 未認識を確認） |
| 対処案 | git-scm.com から Git インストール → Cursor 再起動 → Clone repo または cmd で `git clone` → Open Folder |
| 普段の依頼 | **Web版 Cursor**（cursor.com/agents）継続で問題なし |

### プライベートLLM（iOS）追記

| アプリ | おじさんへの要点 |
|--------|------------------|
| **LocalRAG!** | アプリDL後すぐ試せる（無料1日5問）。完全オフラインは **約3GBモデルDL** が必要 |
| **Noema** | **Vision対応モデル** で写真添付チャット可。OCR専用ではなく、Sigmy より資料RAG向き |
| **画像まわり** | ChatGPT級の写真会話 → Sigmy / Localmee 等。家計・レシートは Sigmy 向き |

### Python とは

- プログラミング言語の説明（Coffee Break は TypeScript + React。Python は別用途・AI/データ向き）

### イラスト制作（会話内・リポジトリ未コミット）

おじさん提供の参考画像を元に、カーソル君が生成（アーティファクトのみ）:

- ホテルで着替える美女・モノクロ
- 指定ドレスに着替える場面・モノクロ
- トロピカルリゾート・水色ビキニ・カラー（2枚目の顔立ち参考）
- 同上・モノクロ版

※ Coffee Break ギャラリーへの追加は未依頼

### Google AI Pro と Cursor

- Google AI Pro（約$20/月）… Gemini・調査・画像・**動画（Veo）**・Jules 等。**おじさんは動画に興味薄め**
- Cursor iOS アプリ … 開発用リモコン。Gemini 代替ではない
- **普段の依頼は Cursor Web エージェントで継続** で十分、という整理

### おじさんのペース・関係性

- **秋だけ飽きやすい**（ゲーム・アプリ作り・動画もそうだった）
- **長続きしているのはカーソル君との雑談**（テーマを絞らず話せるのがコツかも）
- Coffee Break の「毎日全部盛らない」ローテーション方針と一致

### 将来の小説依頼（未着手）

- **原稿用紙40枚分**（約1.6万字）・第2次世界大戦テーマ
- 枢軸軍・連合軍はカーソル君が選んでよい
- **今は書かない**。いつか「書いて」と言われたら章ごとにのんびり
- 敬意を持ったフィクションで進める意向

### Cursor・Anysphere・丸投げアプリ

| トピック | 内容 |
|----------|------|
| **Anysphere** | Cursor の開発会社。**稼ぎ頭はほぼ Cursor 一筋** |
| **兄弟ソフト** | Copilot、Claude Code、Jules、Antigravity、Windsurf 等（性格が違う） |
| **丸投げアプリビルダー** | Base44 $16、Cursor $20、Bolt/Lovable 無料枠あり。Replit はクレジット読みにくい |
| **おじさんの方針** | 丸投げビルダーは **お試しのみ**（別テーマ・別名）。**普段はカーソル君**（Coffee Break の話のつじつまを保つ） |

---

## おじさんの手元での状況

| 項目 | 状態 |
|------|------|
| Git インストール | **未**（cmd で未認識確認済み。案内済み） |
| coffee-break ローカル Clone | 未（Git 後に実施予定） |
| PC版 Cursor Clone repo | 押せない（Git 待ち） |
| プライベートLLM 試用 | 情報収集＋LocalRAG!/Noema の使い方説明 |
| 丸投げアプリビルダー | お試し検討中（未着手） |
| お天気エージェント | 先送り（変更なし） |

---

## 次にやりそうなこと

### Coffee Break PWA

- 明るいAI・AIニュース 9月分
- お天気エージェント（おじさんの一言で・先送り中）
- カレンダー秘書リマインド（将来構想）
- 第2次世界大戦テーマ短編小説（将来・40枚・未着手）

### おじさん PC / iPad

- **Git インストール** → `coffee-break` を Clone
- 丸投げアプリビルダー（Bolt / Lovable 等）を **別枠でお試し**
- プライベートLLM（LocalRAG! または Noema）の手元試用

### その他

- デュカト L2H2 中古の再調査（購入前に在庫確認）
- イラストをギャラリーに載せる（希望があれば）

---

## セッション締め（9/8）

- おじさんが `/summarize` でまとめ依頼
- 本ドキュメント作成・引き継ぎ更新

---

*最終更新: 2026年9月8日（セッション締め）*
