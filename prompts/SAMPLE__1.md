---
conversation_id: "sample-conversation"
step: 1
co_authors: ["OpenAI GPT-4.1", "Anthropic Claude 3.5 Sonnet"]
priority: "medium"
timebox: "60m"
allowed_paths:
  - ".agent"
  - "scripts"
  - "prompts"
  - "reports"
  - "README.md"
constraints:
  - "PR は作成しない。ローカル CI が成功した場合のみ main に直 push すること。"
  - "外部依存は避け、標準 Python のみで完結（pip 不要）。"
  - "冪等性を確保（既存ファイルはマージ/追記・上書き前に検知）。"
expected_outputs:
  - "サンプルスクリプトの追加"
  - "ドキュメントの更新"
success_report_path_template: "reports/{conversation_id}__{step}__{status}.md"
---

# サンプルタスク: 新機能の実装

## 役割

あなたはローカル開発環境で動作する Cursor エージェントです。
本プロンプトは、AgentHQ と Cursor の連携テンプレートを使用した実装タスクのサンプルです。

## 目的

このプロンプトは、AgentHQ から Cursor に送られる指示の雛形として機能します。
実際のプロジェクトでは、具体的な機能実装や修正内容をここに記述します。

## タスク

1. **新機能の設計**
   - 要件を確認し、実装方針を決定
   - 必要なファイルの洗い出し

2. **実装**
   - 新規ファイルの作成
   - 既存ファイルの修正
   - テストの追加（該当する場合）

3. **ドキュメント更新**
   - README.md に使用方法を追記
   - 必要に応じてコメントを追加

4. **動作確認**
   - ローカル CI を実行
   - 手動でも動作確認

## 受入条件 (Acceptance Criteria)

- [ ] 要件を満たす実装が完了している
- [ ] ローカル CI（build/test/format）が通過する
- [ ] ドキュメントが更新されている
- [ ] コミットメッセージが適切に記述されている
- [ ] main ブランチに push される
- [ ] success レポートが生成される

## 注意事項

- **allow_paths 外への変更は行わない**: 指定されたパスのみ編集すること
- **Python 標準ライブラリのみ**: 外部依存を追加しない
- **冪等性**: 何度実行しても安全な実装にする
- **クロスプラットフォーム**: Windows/macOS/Linux で動作すること

## 参考情報

- プロジェクト設定: `.agent/project.json`
- プロンプト仕様: `prompts/_SCHEMA.md`
- レポート仕様: `reports/_SCHEMA.md`

---

**このファイルはサンプルです。実際のタスクでは具体的な内容に置き換えてください。**

