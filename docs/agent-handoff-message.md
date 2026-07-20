コーヒーproject 3引き継ぎ

# 新しい Agent への引き継ぎメッセージ（2026年7月20日時点）

> 下の「---」から下を、新しい Cloud Agent セッションの最初のメッセージとしてそのまま貼り付けてください。

---

コーヒープロジェクト談笑タイム　　　　　　　　　　　　　　　　　　　　　　　　　　　コーヒーproject 3引き継ぎ

Coffee Break（tarosiba/coffee-break）の続きをお願いします。

公開 URL: https://tarosiba.github.io/coffee-break/

まず以下を読んでから作業してください:

1. docs/agent-handoff.md（最新の引き継ぎドキュメント）
2. docs/conversation-session-2026-07-20.md（直近セッションの会話まとめ）
3. docs/conversation-summary.md（全体履歴）

## プロジェクト概要

- React 19 + TypeScript + Vite + Tailwind CSS 4 の PWA
- main マージ → GitHub Actions → GitHub Pages 自動デプロイ
- 作業ブランチ: `cursor/<descriptive-name>-af79`（環境に合わせた suffix でも可）
- 変更後は commit → push → PR → main マージまでお願いします
- `npm run build` と `npm run lint` を通すこと

## 直近でマージ済み（PR #43〜#54）

- **PR #43** 3D迷路ダンジョンRPG強化（⚔️攻撃・🗝️鍵・🔒宝箱）
- **PR #45〜49, #53** カーソル君の小説（全5作）
- **PR #48, #52** AIニュースコーナー（7/19・7/20 各3本）
- **PR #50, #51** ハズレ予想イラスト（カローラセダン／Apple Glasses）
- **PR #54** 会話まとめ・引き継ぎドキュメント更新

## 既存機能（main の状態）

- **ホーム** … 予定リマインド、各タブへの導線
- **カレンダー・時計・メモ** … localStorage のみ（サーバー送信なし）
- **ミニゲーム** … 将棋・オセロ・チェッカー・サッカー・エアホッケー（初級/中級）、**3D迷路**（ふつう/ダンジョンRPG）、スターシューター、神経衰弱、五目並べ、人生ゲーム、じゃんけん、数当て、三目並べ
- **クリエイティブ** … お絵描き、写真スケッチ、**間取りデザイナー**、**カーソル君の絵**、**カーソル君の小説**（5作）、**ハズレ予想イラスト**
- **AIニュース** … カーソル君編集、目安1日3件（`src/lib/aiNews.ts`）
- **雑談** … カーソル君とコーヒータイム（ローカル定型応答）

## 主要ファイル

```
src/lib/maze3d.ts / src/components/games/Maze3dGame.tsx
src/lib/homeDesigner.ts / src/components/creative/HomeDesignerApp.tsx
src/components/creative/CursorStories.tsx   # 小説
src/components/creative/CarPredictions.tsx  # ハズレ予想
src/lib/aiNews.ts / src/components/AiNews.tsx
src/components/Creative.tsx / src/components/Games.tsx
```

## おじさん（ユーザー）の傾向

- 日本語 UI、coffee テーマ、PWA 重視
- 公開 URL で遊べる状態まで（マージ・デプロイ）してほしい
- 「おじさん」= プレイヤー（先手）の呼び方
- カーソル君と親しみやすく会話。**相談相手兼パートナー**として、たまに「これどう？」と提案する半自律関係を好む
- **コンテンツは毎日全部盛らない**（小説・ニュース・予想をローテーション）
- おじさんからの一言（気分・テーマ）があると作品の質が上がる
- 個人情報（予定・カレンダー等）は docs や README に書かない

## 雑談で出た文脈（コード変更なし）

- Unity 6.3 LTS 入門途中（`MyFirstUnity2D`、Square 配置まで。おじさん個人PC側）
- お母さん（92歳・認知症）の健康に関心。背中の赤い点は早め受診を推奨済み
- 将来構想：**コーヒーブレイク劇場**（3年後に短編映画を別枠で）

## 次にやりそうな候補

1. **軽自動車のハズレ予想イラスト**（小説第5作で予告済み・最優先）
2. AIニュース（その日の分を3本）
3. 間取りデザイナー強化（窓・ドア、視点回転）
4. 3D迷路さらなる強化（スケルトン移動AI、回復ポーション）
5. おじさん考案のシミュレーション・戦略ゲーム プロトタイプ
6. Unity 続き（おじさん個人PC側。モジュール確認、四角を動かす）

## 注意

- 画像追加時は `public/images/` に配置し、PWA 2MB 制限のため sharp 等で圧縮必須
- カレンダー/メモは localStorage のみ。サーバー送信なし
- GitHub main ブランチ保護は未設定（おじさんのタイミングで後日）

---

*このファイル: docs/agent-handoff-message.md（貼り付け用）*
