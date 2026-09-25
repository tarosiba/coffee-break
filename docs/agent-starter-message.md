# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッション（New Chat）の最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-09-25.md（直近セッションの会話まとめ）
- docs/conversation-session-2026-09-10.md（9月上旬セッション）
- docs/manga-colony-prep-unintended-orbit.md（入植前哨マンガの設定）
- docs/conversation-summary.md（全体履歴）
- anno_proto/HANDOFF.md（Godot 島開発を触る場合）
- swift-playgrounds/MiniIsland/README.md（Swift 超ミニ島を触る場合）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み
- PR #111 9/10セッション会話まとめ
- PR #112 スターターメッセージ更新（9/10）
- PR #113 AIニュース 2026-09-10（2本）
- PR #114 AIニュース コクソン警告（9/13）
- PR #115〜#117 入植前哨マンガ設定ドキュメント
- PR #118 クリエイティブ「入植前哨マンガ」第1話1〜2ページ
- PR #119 会話まとめ conversation-session-2026-09-25・引き継ぎ更新
- PR #120 会話まとめ追記（docs 保存依頼の記録）

## 直近セッション（9/10〜9/25・締め済み）
- AIニュース：Siri AI・GPT-6 Astra・コクソン／NHK
- **レトロSF漫画「入植前哨ファイル」** 設定完成 → 第1話**2ページ**公開（クリエイティブ）
- 人間3・冬眠2名死亡・悠真＋丸顔ルーチェ／四角顔ピコ・軌道逸脱・軟着陸（設定）
- おじさん：漫画の絵を高評価。**続きは「続き」と言われたとき**
- 雑談：中古車（カローラクロス／コルドリーブス）、YouTube要約、秋の探検気分
- 会話まとめ: docs/conversation-session-2026-09-25.md

## Godot 島開発 anno_proto（同リポ内・PWAとは別）
- 起動: Godot 4.3+ → Import `anno_proto/project.godot` → F5
- フェーズ2・2.5 完了（小麦→パン、人口・パン供給率）
- 次候補: ズーム（先でOK）、2島目・貿易

## おじさんの傾向
- のんびりペース。マージ・デプロイまでお願い
- iPad 利用時は最初に要点1行
- 普段は Web版 Cursor（cursor.com/agents）。PC版は Git 後に coffee-break を Clone
- 秋だけ飽きやすい。ゲームより**雑談・創作（今はマンガ）**が長続きしやすい
- 丸投げアプリビルダーは別枠。本番はカーソル君
- Noema は中断中。雑談・開発はカーソル君
- お天気エージェントは先送り
- 個人情報はリポジトリに含めない

## 次の候補（一言で）
- **「続き」** … 入植前哨マンガ第1話3ページ以降
- 「明るいAIを1本」
- 「ニュース2本」
- 「ズームして」… anno_proto
- 「風車で」… Swift 超ミニ島
- 「Bで」… 今日の3つメモ

---

常設ファイル: `docs/agent-starter-message.md`（GitHub 上でもコピーできます）
