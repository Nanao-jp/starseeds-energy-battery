# Agent HQ ↔ Cursor ブリッジ 運用ガイド

> **このドキュメントについて**: 既存プロジェクトに Agent HQ ↔ Cursor ブリッジを導入した場合の運用ガイドです。  
> プロジェクト全体のREADMEは `README.md` を参照してください。

## 🎯 目的

このブリッジは、Agent HQ（複数AIの討論・合意形成）と Cursor（実装）を連携させ、**最小手動・ローカル完結**のAI協働開発を実現します。

**フロー:**
```
Agent HQ討論 → prompts/ → Cursor実装 → pre-push CI → main push → reports/ → Agent HQ確認
```

---

## 🚀 初期セットアップ

### 前提条件

- **Python 3.7+** がインストール済み
- **pipは不要**（標準ライブラリのみ使用）
- **Git** がインストール済み

### 1. Git hooks をインストール

```bash
python scripts/install_hooks.py
```

成功すると `.git/hooks/pre-push` が作成されます。

### 2. プロジェクト設定の確認・編集

`.agent/project.json` を開いて、プロジェクトに合わせて設定を確認してください：

```json
{
  "name": "your-project-name",
  "ci": {
    "build": "npm run build",  // ビルドコマンド
    "test": "npm test",         // テストコマンド
    "format": "npm run format"  // フォーマットコマンド
  },
  "allow_paths": [
    ".agent",
    "scripts",
    "prompts",
    "reports",
    "src",      // プロジェクト固有のディレクトリを追加
    "docs"
  ],
  "auto_trigger": false,
  "push_main_when_ci_passed": true,
  "report_template": "reports/_TEMPLATE__report.md"
}
```

**編集ポイント:**
- `name`: プロジェクト名
- `ci`: 実際のビルド・テスト・フォーマットコマンド
  - 空文字 `""` の場合はスキップされます
- `allow_paths`: Cursorが編集可能なディレクトリ

### 3. 動作確認

```bash
# CIが正常に動作するか確認
python scripts/ci_local.py

# レポート生成が動作するか確認
python scripts/make_report.py --conversation-id test --step 1 --status success

# テストレポートを削除
rm reports/test__1__success.md
```

---

## 📝 日常の運用フロー

### 1. プロンプトの受信

Agent HQが討論結果を `prompts/<conversation_id>__<step>.md` として配置します。

**最短手順（コピペ運用）:**
1. Agent HQからプロンプト内容を受け取る
2. `prompts/` ディレクトリに手動で配置（またはコピペ）
3. ファイルを確認して内容を理解

**監視自動化（将来拡張）:**
```bash
# 新規プロンプトを1回チェック
python scripts/hq_watcher.py --once

# 詳細は docs/WATCHER.md を参照
```

### 2. Cursorで実装

1. プロンプトの内容を確認
2. Cursorで実装・テスト
3. コミット準備

### 3. ローカルCI（自動）

```bash
git add .
git commit -m "feat: implement feature-auth"
git push origin main
```

**pre-pushフックが自動で実行:**
- ✅ ビルド（`ci.build`）
- ✅ テスト（`ci.test`）
- ✅ フォーマット（`ci.format`）

**CIが成功** → pushが継続される  
**CIが失敗** → pushが中断され、エラーが表示される

### 4. レポート生成

```bash
python scripts/make_report.py \
  --conversation-id feature-auth \
  --step 1 \
  --status success \
  --duration 300
```

**オプション:**
- `--conversation-id`: プロンプトのconversation_id
- `--step`: ステップ番号
- `--status`: success / failed
- `--duration`: 実行時間（秒）
- `--base-ref`, `--head-ref`: commit範囲指定（省略可）

**レポートをpush:**
```bash
git add reports/
git commit -m "chore: add success report for step 1"
git push origin main
```

### 5. Agent HQが確認

Agent HQが `reports/` のレポートを確認し、次のアクションを決定します。

---

## 🔧 よくある操作

### 手動でCIを実行

```bash
python scripts/ci_local.py
```

### commit範囲を指定してレポート生成

```bash
# origin/mainからの差分を含める
python scripts/make_report.py \
  --conversation-id feature-auth \
  --step 1 \
  --base-ref origin/main \
  --head-ref HEAD
```

### CIログを確認

```bash
# 最新のCIログ
cat reports/.ci_logs/latest.log

# または
less reports/.ci_logs/latest.log
```

### 問い合わせ（QUESTION）を作成

実装中に判断が必要な場合は、QUESTIONを作成してAgent HQに問い合わせます：

```bash
# テンプレートをコピー
cp reports/QUESTION_TEMPLATE.md reports/QUESTION_20251031_1234_FeatureAuth_FOR_GPT.md

# エディタで編集して内容を記入
# コミット・push
git add reports/QUESTION_*.md
git commit -m "chore: add question about feature-auth"
git push origin main
```

---

## 🛡️ 安全策

### PRなし・ローカルCI方式

- pre-pushフックでローカルCIが自動実行
- CI通過後のみmainに直接push
- **PRは作成しない**（軽量ローカル運用の既定）

### 破壊的変更の場合

以下の場合は、フル運用（PR+レビュー）を検討してください：

- APIの変更、データベーススキーマ変更
- 複数人レビューが必要なセキュリティ関連
- 10ファイル以上の広範囲変更
- 本番環境への影響が大きい変更

詳細は `AI_COLLABORATION_PROTOCOL_Software.md` の「運用モード選択の指針」を参照してください。

---

## 📚 関連ドキュメント

### 運用・導入

- **[docs/ADOPTION.md](./docs/ADOPTION.md)**: 詳細な導入ガイド
  - 新規プロジェクト
  - 既存プロジェクトへの導入
  - テンプレート更新の取り込み
  - FAQ

- **[docs/WATCHER.md](./docs/WATCHER.md)**: prompts/ の自動監視
  - OS別の軽量トリガ例
  - 将来の自動化ポイント

### プロトコル・仕様

- **[prompts/_SCHEMA.md](./prompts/_SCHEMA.md)**: プロンプト仕様
- **[reports/_SCHEMA.md](./reports/_SCHEMA.md)**: レポート仕様
- **[AI_COLLABORATION_PROTOCOL_Software.md](./AI_COLLABORATION_PROTOCOL_Software.md)**: フル運用プロトコル（参考）

### サンプル

- **[prompts/SAMPLE__1.md](./prompts/SAMPLE__1.md)**: プロンプトのサンプル
- **[reports/SAMPLE__1__success.md](./reports/SAMPLE__1__success.md)**: レポートのサンプル
- **[reports/QUESTION_TEMPLATE.md](./reports/QUESTION_TEMPLATE.md)**: 問い合わせテンプレート

---

## 🔍 トラブルシューティング

### pre-pushフックが動かない

```bash
# hooksを再インストール
python scripts/install_hooks.py

# 実行権限を確認（macOS/Linux）
chmod +x .git/hooks/pre-push
```

### CIが失敗する

```bash
# 手動でCI実行して詳細を確認
python scripts/ci_local.py

# ログを確認
cat reports/.ci_logs/latest.log

# .agent/project.json のコマンドを修正
```

### レポート生成がエラーになる

```bash
# Gitリポジトリ内で実行しているか確認
git status

# commit_shaが取得できない場合は最低1回commitが必要
git commit --allow-empty -m "chore: initial commit"
```

### Windowsで文字化けする

```bash
# PowerShellで実行する場合は環境変数を設定
$env:PYTHONIOENCODING="utf-8"
python scripts/ci_local.py
```

---

## 💡 Tips

### エイリアス設定（任意）

よく使うコマンドはエイリアスに登録すると便利です：

**Bash/Zsh (~/.bashrc or ~/.zshrc):**
```bash
alias hq-ci='python scripts/ci_local.py'
alias hq-report='python scripts/make_report.py'
alias hq-watch='python scripts/hq_watcher.py --once'
```

**PowerShell (Microsoft.PowerShell_profile.ps1):**
```powershell
function Invoke-HQCI { python scripts\ci_local.py }
function Invoke-HQReport { python scripts\make_report.py @args }
function Invoke-HQWatch { python scripts\hq_watcher.py --once }

Set-Alias hq-ci Invoke-HQCI
Set-Alias hq-report Invoke-HQReport
Set-Alias hq-watch Invoke-HQWatch
```

### プロンプトの命名規則

プロンプトファイルは以下の命名規則を推奨：

```
prompts/<conversation_id>__<step>.md
```

例:
- `prompts/feature-auth__1.md`
- `prompts/refactor-api__2.md`
- `prompts/bugfix-login__1.md`

---

## 📊 運用状況の可視化（将来拡張）

現時点では手動ですが、将来的には以下の可視化が可能です：

- **プロンプト処理数**: `prompts/` のファイル数
- **成功率**: `reports/*__success.md` vs `reports/*__failed.md`
- **平均処理時間**: レポートの `duration` を集計
- **CI通過率**: `.ci_logs/` を解析

---

## ⚙️ 設定ファイル

### .agent/project.json

プロジェクト固有の設定を管理：

- `name`: プロジェクト名
- `ci`: CIコマンド（build/test/format）
- `allow_paths`: 編集可能なディレクトリ
- `auto_trigger`: prompts/ の自動監視（未実装）
- `push_main_when_ci_passed`: CI通過時の自動push（既定: true）

### .cursorrules

Cursor開発時のルール：

- 編集対象ディレクトリ
- 開発原則（依存ゼロ、冪等性、クロスプラットフォーム）
- 運用モード（軽量ローカル運用が既定）

---

## 🤝 サポート

問題が解決しない場合は、以下を確認してください：

1. **本ドキュメント（README.bridge.md）**
2. **[docs/ADOPTION.md](./docs/ADOPTION.md)**: FAQ・トラブルシューティング
3. **[README.md](./README.md)**: プロジェクト全体のREADME
4. **GitHub Issues**: https://github.com/Nanao-jp/hq-cursor-bridge-template/issues

---

**最終更新**: 2025-10-31

