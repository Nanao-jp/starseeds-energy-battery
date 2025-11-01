# Prompt Schema (HQ → Cursor)

このファイルは AgentHQ から Cursor に送られるプロンプトの仕様を定義します。

## フォーマット

YAML frontmatter + Markdown 本文の形式で記述します。

```yaml
---
conversation_id: "unique-conversation-id"
step: 1
co_authors: ["OpenAI GPT-4.1", "Anthropic Claude 3.5 Sonnet"]
priority: "high|medium|low"
timebox: "90m"
allowed_paths: [".agent", "scripts", "src"]
constraints:
  - "PR は作成しない。ローカル CI が成功した場合のみ main に直 push すること。"
  - "外部依存は避け、標準 Python のみで完結（pip 不要）。"
expected_outputs:
  - "ファイル一覧"
  - "テスト結果"
success_report_path_template: "reports/{conversation_id}__{step}__{status}.md"
---

ここに詳細な指示内容を記述します。

## タスク

1. ...
2. ...

## 受入条件

- [ ] 条件1
- [ ] 条件2
```

## 必須フィールド (frontmatter)

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `conversation_id` | string | 会話の一意識別子 | `"hq-cursor-bootstrap"` |
| `step` | number | ステップ番号 | `1` |
| `allowed_paths` | array | Cursor が編集可能なパス | `[".agent", "scripts"]` |
| `expected_outputs` | array | 期待される成果物 | `["ファイル一覧"]` |
| `constraints` | array | 制約条件 | `["PRなし"]` |

## 任意フィールド

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `co_authors` | array | 共同執筆者（AIモデル） | `["GPT-4.1", "Claude 3.5"]` |
| `priority` | string | 優先度 | `"high"`, `"medium"`, `"low"` |
| `timebox` | string | 推定所要時間 | `"90m"`, `"2h"` |
| `success_report_path_template` | string | レポートパステンプレート | `"reports/YYYYMMDD_HHMM_{id}__{step}__{status}.md"` |

## 本文セクション推奨構造

1. **役割**: Cursor の役割を明示
2. **目的**: タスクの目的
3. **タスク**: 具体的な作業内容（番号付きリスト）
4. **受入条件 (Acceptance Criteria)**: 完了の定義
5. **注意**: 特記事項

## プロンプト作成時の原則

Cursor の能力を最大限引き出すため、以下の原則に従ってプロンプトを作成してください：

- ✅ **What（何を）を明確に**、**How（どのように）は Cursor に任せる**
  - 良い例: 「KPI セクションにカウントアップアニメーションを追加」
  - 悪い例: 「useState と useEffect を使ってカウントアップを実装」

- ✅ **細かいコード指示は避ける**
  - 良い例: 「適切な命名でカスタムフックを作成」
  - 悪い例: 「useCountUp という名前で、start, end, duration を引数に取るフックを作成」

- ✅ **コマンド列挙は最小限**
  - 良い例: 「必要な依存パッケージをインストール」
  - 悪い例: 「npm install package-a && npm install package-b && ...」

- ✅ **目的と制約を伝え、実装の詳細は Cursor の判断を尊重**
  - 良い例: 「パフォーマンスを考慮してアニメーションを実装」
  - 悪い例: 「requestAnimationFrame を使い、easeOutExpo 関数で...」

### Cursor への指示

プロンプトには以下を明記しないでください（Cursor が自動判断）：
- レポート生成の指示（ユーザーが別途指示）
- プッシュの指示（ユーザーが別途指示）
- 詳細な報告の要求（簡潔な箇条書きで十分）

## ファイル命名規則

```
prompts/<conversation_id>__<step>.md
```

例:
- `prompts/hq-cursor-bootstrap__1.md`
- `prompts/feature-auth__2.md`

## サンプル

完全なサンプルは `prompts/SAMPLE__1.md` を参照してください。

## プロトコル用語との対応表

本テンプレートは、`AI_COLLABORATION_PROTOCOL_*.md` で定義されたフル運用プロトコルと併用可能です。以下は用語の対応関係です。

| フル運用プロトコル | 本テンプレート（軽量ローカル） | 説明 |
|---|---|---|
| **`_DEBATE.json`** | `prompts/<conversation_id>__<step>.md` | Agent HQの討論結果の伝達形式 |
| **`topic`** | `conversation_id` + 本文のタイトル | 討論トピックの識別子 |
| **`summary`** | frontmatter + 本文冒頭 | 合意内容の要約 |
| **`cursor_task.what`** | `expected_outputs` + 本文の「タスク」 | 実装内容の指定 |
| **`cursor_task.where`** | `allowed_paths` | 編集対象ファイル・ディレクトリ |
| **`cursor_task.dod`** | `constraints` + 受入条件 | Definition of Done（完了条件） |
| **`issues`** | 本文の「タスク」「注意事項」 | 討論された論点・判断 |
| **PRベースレビュー** | pre-pushローカルCI | 品質保証の仕組み |

### 使い分けの指針

- **軽量ローカル（本テンプレ）**: 小変更、単独開発、高速イテレーション
- **フル運用（_DEBATE.json）**: 破壊的変更、複数者レビュー、監査要件

詳細は [`AI_COLLABORATION_PROTOCOL_Software.md`](../AI_COLLABORATION_PROTOCOL_Software.md) の「軽量ローカル運用モード」セクションを参照してください。

---

**最終更新**: 2025-10-31

