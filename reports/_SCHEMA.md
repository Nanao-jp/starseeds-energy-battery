# Report Schema (Cursor → HQ)

このファイルは Cursor から AgentHQ に返されるレポートの仕様を定義します。

## フォーマット

YAML frontmatter + Markdown 本文の形式で記述します。

```yaml
---
executor: "cursor"
conversation_id: "unique-conversation-id"
step: 1
status: "success"  # or "failed"
commit_sha: "abc123def456..."
changed_files:
  - "scripts/ci_local.py"
  - ".agent/project.json"
test_results:
  build: "passed"    # "passed" | "failed" | "skipped"
  test: "skipped"
  format: "passed"
duration: "PT0M30S"  # ISO 8601 duration format
timestamp: "2025-10-31T12:34:56Z"
---

## 実行内容の要約

...

## 変更内容

...

## テスト結果

...

## 次のステップへの推奨事項

...
```

## 必須フィールド (frontmatter)

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `executor` | string | 実行者（常に "cursor"） | `"cursor"` |
| `conversation_id` | string | プロンプトの conversation_id | `"hq-cursor-bootstrap"` |
| `step` | number | プロンプトの step 番号 | `1` |
| `status` | string | 実行結果 | `"success"` または `"failed"` |
| `commit_sha` | string | 最終コミットハッシュ | `"abc123def456"` |
| `changed_files` | array | 変更されたファイル一覧 | `["scripts/ci.py"]` |
| `test_results` | object | テスト結果 | 下記参照 |
| `duration` | string | 実行時間（ISO 8601） | `"PT1M30S"` (1分30秒) |

### `test_results` オブジェクト

| フィールド | 型 | 説明 | 値 |
|-----------|-----|------|-----|
| `build` | string | ビルド結果 | `"passed"` / `"failed"` / `"skipped"` |
| `test` | string | テスト結果 | `"passed"` / `"failed"` / `"skipped"` |
| `format` | string | フォーマット結果 | `"passed"` / `"failed"` / `"skipped"` |

## 任意フィールド

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `timestamp` | string | 実行完了時刻（ISO 8601） | `"2025-10-31T12:34:56Z"` |
| `error_message` | string | エラーメッセージ（失敗時） | `"CI failed: test error"` |
| `warnings` | array | 警告メッセージ | `["Deprecated API used"]` |

## 本文セクション推奨構造

1. **実行内容の要約**: 何をしたか
2. **変更内容**: 主な変更点のリスト
3. **テスト結果**: CI実行結果の詳細
4. **次のステップへの推奨事項**: HQへの提案（任意）

## ファイル命名規則

```
reports/<conversation_id>__<step>__<status>.md
```

例:
- `reports/hq-cursor-bootstrap__1__success.md`
- `reports/feature-auth__2__failed.md`

## ISO 8601 Duration フォーマット

| 例 | 意味 |
|----|------|
| `PT0M30S` | 30秒 |
| `PT1M30S` | 1分30秒 |
| `PT2H15M` | 2時間15分 |

フォーマット: `PT<時間>H<分>M<秒>S`

## サンプル

完全なサンプルは `reports/SAMPLE__1__success.md` を参照してください。

## プロトコル用語との対応表

本テンプレートは、`AI_COLLABORATION_PROTOCOL_*.md` で定義されたフル運用プロトコルと併用可能です。以下は用語の対応関係です。

| フル運用プロトコル | 本テンプレート（軽量ローカル） | 説明 |
|---|---|---|
| **`_REPORT.md`** | `reports/<conversation_id>__<step>__<status>.md` | 実装結果の報告形式 |
| **`status`** | `status` (success/failed) | 実行結果のステータス |
| **`commit`** | `commit_sha` | コミットハッシュ |
| **`changed_files`** | `changed_files` | 変更されたファイル一覧 |
| **`dod_verified`** | `test_results` + 本文の「受入条件の確認」 | Definition of Done達成確認 |
| **`summary`** | 本文の「実行内容の要約」 | 実施内容の要約 |
| **`issues_encountered`** | 本文の「次のステップへの推奨事項」（失敗時） | 発生した問題 |
| **`_QUESTION.md`** | `reports/QUESTION_*`（将来拡張予定） | 不明点の問い合わせ |
| **PRレビューコメント** | 本文の「次のステップへの推奨事項」 | 追加作業の提案 |

### 使い分けの指針

- **軽量ローカル（本テンプレ）**: 実装結果を即座に報告、YAML+Markdownで人間可読
- **フル運用（_REPORT.md）**: 機械検証可能、JSON Schema準拠、監査証跡として完全

### レポートの拡張

本テンプレートのレポートは最小限の情報のみを含みます。必要に応じて以下を追加できます：

- **パフォーマンス計測**: Lighthouse スコア、ビルド時間
- **スクリーンショット**: UI変更のビフォー・アフター
- **テストカバレッジ**: カバレッジ率、テスト追加数
- **Profiler結果**: メモリ使用量、FPS（Unityの場合）

詳細は [`AI_COLLABORATION_PROTOCOL_Software.md`](../AI_COLLABORATION_PROTOCOL_Software.md) の「軽量ローカル運用モード」セクションを参照してください。

---

**最終更新**: 2025-10-31

