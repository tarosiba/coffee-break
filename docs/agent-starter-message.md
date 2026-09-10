# 新しい Agent への引き継ぎメッセージ（コピペ用）

以下をそのまま新しい Cloud Agent セッション（New Chat）の最初のメッセージに貼り付けてください。

---

コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。
公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:
- docs/agent-handoff.md（最新の引き継ぎドキュメント）
- docs/conversation-session-2026-09-10.md（直近セッションの会話まとめ）
- docs/conversation-session-2026-09-08.md（9月上旬セッション）
- docs/conversation-session-2026-09-01.md（9月初旬セッション）
- docs/conversation-summary.md（全体履歴）
- anno_proto/HANDOFF.md（Godot 島開発プロトを触る場合）
- swift-playgrounds/MiniIsland/README.md（Swift 超ミニ島を触る場合）

## プロジェクト概要
- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: cursor/<descriptive-name>-9b60
- 変更後は commit → push → PR → main マージまでお願いします
- npm run build と npm run lint を通すこと
- マージ後は GitHub Actions のデプロイ成功を確認すること

## 直近でマージ済み
- PR #108 9/8セッション会話まとめ
- PR #109 引き継ぎメッセージ更新（9/8）
- PR #110 AIニュース 2026-09-09（2本）

## 直近セッション（9/9〜9/10）
- AIニュース：WeatherNext 3・ウェザーニュースAIアプリ（雨の季節向け）
- Noema（iPad）… Qwen 0.8B セットアップ済み。**会話品質・ランタイムエラーでいったん中断**
- iPad専用チャットボット調査・Noema初回設定手順を案内
- 9/10 急に秋の陽気
- 会話まとめ: docs/conversation-session-2026-09-10.md

## Godot 島開発 anno_proto（同リポ内・PWAとは別）
- 起動: Godot 4.3+ → Import `anno_proto/project.godot` → F5
- フェーズ2・2.5 完了（小麦→パン、人口・パン供給率）
- 次候補: ズーム（先でOK）、2島目・貿易

## おじさんの傾向
- のんびりペース。マージ・デプロイまでお願い
- iPad 利用時は最初に要点1行
- 普段は Web版 Cursor（cursor.com/agents）。PC版は Git 後に coffee-break を Clone
- 秋だけ飽きやすい。ゲーム・アプリ作りより雑談が長続き
- 丸投げアプリビルダー（Bolt/Lovable等）は別枠お試し。本番はカーソル君
- プライベートLLM：Noema は中断中。雑談・開発はカーソル君
- デュカト L2H2 中古（600万以下→ドンガラ510〜520万）、お天気エージェントは先送り
- 個人情報（予定・健康・家計）はリポジトリに含めない

## 次の候補（一言で）
- 「明るいAIを1本」
- 「ニュース2本」
- 「お天気で」… お天気エージェント（先送り中）
- 「秘書で」… カレンダー予定リマインド（将来構想）
- 「ズームして」… anno_proto カメラ拡大（先でOK）
- 「風車で」… Swift 超ミニ島に風車追加
- 「Bで」… 今日の3つメモ

---

常設ファイル: `docs/agent-starter-message.md`（GitHub 上でもコピーできます）
