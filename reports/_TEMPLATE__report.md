---
executor: "cursor"
conversation_id: "{CONVERSATION_ID}"
step: {STEP}
status: "{STATUS}"
commit_sha: "{COMMIT_SHA}"
changed_files: []
test_results:
  build: "skipped"
  test: "skipped"
  format: "skipped"
duration: "PT0M0S"
timestamp: "{TIMESTAMP}"
---

# レポート: {CONVERSATION_ID} - Step {STEP}

## ✅ 実行内容の要約

このセクションに実行内容の要約を記述します。

- 何を実装したか
- どのような変更を行ったか
- 主要な意思決定

## 📝 変更内容

### 追加されたファイル

- `file1.py` - 説明
- `file2.md` - 説明

### 変更されたファイル

- `file3.py` - 変更内容の説明

### 削除されたファイル

（なし）

## 🧪 テスト結果

### ビルド

```
{BUILD_RESULT}
```

### テスト

```
{TEST_RESULT}
```

### フォーマット

```
{FORMAT_RESULT}
```

## 📊 統計

- **実行時間**: {DURATION}
- **変更ファイル数**: {FILE_COUNT}
- **追加行数**: +{ADDED_LINES}
- **削除行数**: -{DELETED_LINES}

## 🔍 受入条件の確認

- [x] 受入条件1
- [x] 受入条件2
- [ ] 未完了の条件（あれば記載）

## 💡 次のステップへの推奨事項

HQが次のアクションを決定するための情報を記載：

1. 追加で必要な作業があれば記載
2. 懸念事項や警告があれば記載
3. 改善提案があれば記載

## 📎 関連情報

- Commit: `{COMMIT_SHA}`
- Branch: `main`
- 実行環境: {PLATFORM}

---

**生成日時**: {TIMESTAMP}

