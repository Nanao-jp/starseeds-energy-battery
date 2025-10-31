# テンプレート導入ガイド

このドキュメントは、`hq-cursor-bridge-template` を新規プロジェクトまたは既存プロジェクトに導入する詳細な手順を説明します。

## 目次

- [新規プロジェクトでの使用](#新規プロジェクトでの使用)
- [既存プロジェクトへの導入](#既存プロジェクトへの導入)
- [テンプレート更新の取り込み](#テンプレート更新の取り込み)
- [よくある質問（FAQ）](#よくある質問faq)

---

## 新規プロジェクトでの使用

### 方法A: GitHub Template Repository機能（推奨）

#### 1. テンプレートから新規リポジトリを作成

1. https://github.com/Nanao-jp/hq-cursor-bridge-template にアクセス
2. 右上の **"Use this template"** ボタンをクリック
3. **"Create a new repository"** を選択
4. リポジトリ名を入力（例: `my-awesome-project`）
5. Public/Privateを選択
6. **"Create repository"** をクリック

#### 2. ローカルにクローン

```bash
git clone https://github.com/your-username/my-awesome-project.git
cd my-awesome-project
```

#### 3. プロジェクト設定の初期化

**`.agent/project.json` を編集:**

```json
{
  "name": "my-awesome-project",
  "ci": {
    "build": "npm run build",
    "test": "npm test",
    "format": "npm run format"
  },
  "allow_paths": [
    ".agent",
    "scripts",
    "prompts",
    "reports",
    ".githooks",
    ".cursorrules",
    ".gitignore",
    "README.md",
    "LICENSE",
    "src",      // プロジェクト固有のディレクトリを追加
    "docs"
  ],
  "auto_trigger": false,
  "push_main_when_ci_passed": true,
  "report_template": "reports/_TEMPLATE__report.md"
}
```

**チェックリスト:**
- [ ] `name` をプロジェクト名に変更
- [ ] `ci` コマンドを実際のビルド・テスト・フォーマットコマンドに変更
- [ ] `allow_paths` にプロジェクト固有のディレクトリを追加
- [ ] テストコマンドがない場合は `""` のまま（スキップされる）

#### 4. README.md のカスタマイズ

```bash
# テンプレートのREADMEをバックアップ
cp README.md README_TEMPLATE.md

# プロジェクト固有の内容に書き換え
# （テンプレートの説明部分は削除し、プロジェクトの説明に差し替え）
```

**README.md に残すべき内容:**
- 🚀 初期セットアップ
- 📝 運用方法
- 🔍 プロンプト・レポート仕様
- 🛡️ 安全策
- 🔧 トラブルシューティング

**削除または調整すべき内容:**
- 「AgentHQ ↔ Cursor Bridge Template」→ プロジェクト名に変更
- テンプレートの目的説明 → プロジェクトの説明に置き換え

#### 5. Git hooksのインストール

```bash
python scripts/install_hooks.py
```

成功すると以下のメッセージが表示されます：
```
✅ フックをインストールしました: .git/hooks/pre-push
```

#### 6. 動作確認

```bash
# CIが正常に動作するか確認
python scripts/ci_local.py

# レポート生成が動作するか確認
python scripts/make_report.py --conversation-id test --step 1 --status success

# 生成されたテストレポートを削除
rm reports/test__1__success.md
```

#### 7. 初回コミット

```bash
git add .
git commit -m "chore: initialize project from hq-cursor-bridge-template"
git push origin main
```

---

## 既存プロジェクトへの導入

既存のプロジェクトにテンプレートを導入する場合、既存ファイルとの競合に注意が必要です。

### 1. テンプレートをリモートとして追加

```bash
cd your-existing-project
git remote add template https://github.com/Nanao-jp/hq-cursor-bridge-template.git
git fetch template
```

### 2. 導入計画の作成

まず、既存ファイルとの競合を確認します：

```bash
# テンプレートのファイル一覧を確認
git ls-tree -r --name-only template/main

# 競合する可能性のあるファイルをチェック
# - .gitignore
# - README.md
# - LICENSE
# - .cursorrules（存在する場合）
```

**競合チェックリスト:**
- [ ] `.gitignore` が存在するか？ → マージが必要
- [ ] `README.md` が存在するか？ → 手動統合が必要
- [ ] `LICENSE` が存在するか？ → 既存を優先
- [ ] `scripts/` ディレクトリが存在するか？ → 名前衝突に注意

### 3. テンプレートファイルの選択的取り込み

#### オプションA: 全ファイルを一括取り込み（小規模プロジェクト）

```bash
git checkout template/main -- .agent scripts prompts reports .githooks .cursorrules
```

#### オプションB: 個別に取り込み（推奨・安全）

```bash
# 必須ファイル
git checkout template/main -- .agent
git checkout template/main -- scripts
git checkout template/main -- prompts
git checkout template/main -- reports
git checkout template/main -- .githooks

# 任意ファイル（既存ファイルがある場合は手動マージ）
# git checkout template/main -- .cursorrules
# git checkout template/main -- .gitignore
```

### 4. 既存ファイルとのマージ

#### `.gitignore` のマージ

```bash
# テンプレートの .gitignore を一時ファイルとして取得
git show template/main:.gitignore > .gitignore_template

# 既存の .gitignore に追記
cat .gitignore_template >> .gitignore

# 重複を削除（手動またはツール使用）
# awk '!seen[$0]++' .gitignore > .gitignore_merged
# mv .gitignore_merged .gitignore

# 一時ファイルを削除
rm .gitignore_template
```

#### `README.md` の統合

README.mdは**上書きせず手動統合**してください：

```bash
# テンプレートのREADMEを別名で保存
git show template/main:README.md > README_TEMPLATE.md
```

以下のセクションを既存のREADMEに追加：
- 🚀 初期セットアップ（Git hooks インストール）
- 📝 運用方法（prompts → Cursor → reports フロー）
- 🔍 プロンプト・レポート仕様
- 🔧 トラブルシューティング

### 5. プロジェクト設定の調整

**`.agent/project.json` を編集:**

```json
{
  "name": "your-existing-project",
  "ci": {
    "build": "make build",        // 既存のビルドコマンド
    "test": "make test",           // 既存のテストコマンド
    "format": "make format"        // 既存のフォーマットコマンド
  },
  "allow_paths": [
    ".agent",
    "scripts",
    "prompts",
    "reports",
    ".githooks",
    ".cursorrules",
    ".gitignore",
    "README.md",
    "LICENSE",
    "src",           // 既存のソースディレクトリ
    "lib",
    "config",
    "docs"
  ],
  "auto_trigger": false,
  "push_main_when_ci_passed": true,
  "report_template": "reports/_TEMPLATE__report.md"
}
```

### 6. Git hooksのインストール

```bash
python scripts/install_hooks.py
```

既存のpre-pushフックがある場合は、上書き確認プロンプトが表示されます。

### 7. 動作確認

```bash
# CIが既存のビルド・テストコマンドを正しく実行するか確認
python scripts/ci_local.py

# エラーが出た場合は .agent/project.json のコマンドを修正
```

### 8. コミット・push

```bash
git add .
git commit -m "chore: integrate hq-cursor-bridge-template"
git push origin main
```

---

## テンプレート更新の取り込み

テンプレートが更新された場合、最新の変更を取り込む方法を説明します。

### 方法A: 手動で再チェックアウト（推奨・簡易）

特定のファイルのみを更新したい場合に最適です。

```bash
# テンプレートの最新版を取得
git fetch template

# 更新されたファイルを確認
git diff template/main HEAD -- scripts/

# 問題なければチェックアウト
git checkout template/main -- scripts/ci_local.py
git checkout template/main -- scripts/make_report.py

# コミット
git add scripts/
git commit -m "chore: update scripts from template"
git push origin main
```

**メリット:**
- シンプルで理解しやすい
- 必要なファイルのみ更新可能
- 競合が少ない

**デメリット:**
- 手動操作が必要
- 更新内容の追跡が難しい

### 方法B: git subtree（継続的同期）

テンプレートの更新を継続的に取り込みたい場合に使用します。

#### 初回: サブツリーとして追加

```bash
# テンプレートをサブディレクトリ bridge/ として追加
git subtree add --prefix bridge template main --squash -m "Add hq-cursor-bridge-template as subtree"

# ディレクトリ構造:
# your-project/
# ├── bridge/              # テンプレート（読み取り専用）
# │   ├── .agent/
# │   ├── scripts/
# │   └── ...
# ├── src/                 # プロジェクト固有コード
# └── ...
```

#### 更新: テンプレートの変更をpull

```bash
# テンプレートの最新版を取得
git fetch template

# subtreeを更新
git subtree pull --prefix bridge template main --squash -m "Update template from upstream"

# 必要に応じて bridge/ から本体にコピー
cp bridge/scripts/ci_local.py scripts/
git add scripts/ci_local.py
git commit -m "chore: sync ci_local.py from template"
```

**メリット:**
- 更新履歴が追跡可能
- テンプレートの変更を自動でマージ
- 複数プロジェクトで同じテンプレートを使う場合に便利

**デメリット:**
- 学習コストがやや高い
- ディレクトリ構造が複雑化
- merge競合の可能性

### 方法C: git submodule（参考・非推奨）

**非推奨理由:**
- submoduleは別リポジトリとして扱われ、編集が複雑
- ファイルの個別取り込みが難しい
- チーム全体でsubmoduleの理解が必要

```bash
# 参考: submoduleとして追加
git submodule add https://github.com/Nanao-jp/hq-cursor-bridge-template.git bridge
git submodule update --init --recursive
```

---

## よくある質問（FAQ）

### Q1: Cursorへの投入はコピペで良い？

**A:** はい、最短運用ではコピペで構いません。

- Agent HQが討論結果をMarkdownでまとめる
- その内容を `prompts/` に手動で配置（またはコピペ）
- Cursorが読んで実装
- 記録はgit commit/pushで残る

自動化が必要になったら `scripts/hq_watcher.py` を拡張してください。

### Q2: PRが必要なケースは？

**A:** 以下のような場合はフル運用（PR+レビュー）を推奨します：

- 破壊的変更（API変更、データベーススキーマ変更）
- 複数人レビューが必要（セキュリティ、パフォーマンス）
- 広範囲変更（10ファイル以上、複数モジュール横断）
- 本番反映前（ステージング環境でのE2Eテスト必須）
- 監査要件（変更履歴の詳細な追跡が規制で求められる）

詳細は [`AI_COLLABORATION_PROTOCOL_Software.md`](../AI_COLLABORATION_PROTOCOL_Software.md) の「運用モード選択の指針」を参照してください。

### Q3: 既存のCIツール（GitHub Actions等）と併用できる？

**A:** はい、併用可能です。

- ローカル: pre-pushフックでローカルCI（高速フィードバック）
- リモート: GitHub Actionsで追加の検証（E2E、セキュリティスキャン等）

`.agent/project.json` のCIコマンドは、リモートCIと同じコマンドを設定することを推奨します。

### Q4: Python以外の言語でも使える？

**A:** はい、使えます。

- `scripts/` のPythonスクリプトはCI実行とレポート生成のみ
- 実際のアプリケーションコードは任意の言語でOK
- `.agent/project.json` の `ci` コマンドで言語固有のツールを指定
  - Node.js: `"build": "npm run build"`
  - Go: `"build": "go build ./..."`
  - Rust: `"build": "cargo build"`

### Q5: テンプレートの更新は必須？

**A:** 必須ではありませんが、推奨します。

- バグ修正やセキュリティパッチが含まれる場合あり
- 新機能（改良されたレポート生成等）を利用できる
- 更新頻度は月1回程度を想定

更新方法は本ドキュメントの「テンプレート更新の取り込み」を参照してください。

### Q6: プライベートリポジトリでも使える？

**A:** はい、使えます。

- Template Repository機能はPrivateリポジトリでも利用可能
- ライセンスはMITなので商用利用も問題なし
- テンプレート自体もPrivate化可能（fork後に設定変更）

### Q7: チーム開発でも使える？

**A:** はい、使えますが工夫が必要です。

**推奨構成:**
- **ローカル軽量運用**: 各開発者の個人作業・小変更
- **フル運用（PR）**: チームレビューが必要な変更

**運用例:**
- メンバーAがローカルで実装 → pre-push CI → main push
- メンバーBがpullして確認
- 大きな変更の場合のみPR作成してレビュー

### Q8: `allow_paths` の範囲外を編集したらどうなる？

**A:** 現状は警告のみで、実際の制限は未実装です。

- `.agent/project.json` の `allow_paths` は**ガイドライン**
- 将来的にはpre-pushフックで検証予定
- 現時点では開発者の裁量で判断

### Q9: `prompts/` と `reports/` はどこに保存すべき？

**A:** リポジトリに含めることを推奨します。

**メリット:**
- 履歴として残る（監査可能）
- チームメンバーが過去の指示を参照できる
- Agent HQが過去のレポートを参照可能

**懸念がある場合:**
- `.gitignore` に `prompts/*.md` を追加（テンプレートは残す）
- ただし、記録が残らないため非推奨

### Q10: Windows環境での注意点は？

**A:** 以下に注意してください：

- Python3のコマンドが `python` の場合あり（`python3` ではない）
- pre-pushフックはGit Bash、PowerShell、WSLで動作確認済み
- パス区切りは `/` を使用（`os.path.join()` で自動変換）
- 改行コードはLF推奨だがCRLFでも動作

---

## トラブルシューティング

### pre-pushフックが動かない

```bash
# hooksを再インストール
python scripts/install_hooks.py

# 権限を確認（macOS/Linux）
chmod +x .git/hooks/pre-push

# Windowsの場合はGit Bashを使用
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

---

## 既存READMEの衝突回避とREADME.bridge.mdの利用

既存プロジェクトに本テンプレートを導入する際、最も悩ましいのが **README.mdの衝突** です。

### 基本方針

- ✅ **既存のREADME.mdは上書きしない**
- ✅ テンプレートの要点は **README.bridge.md** として別ファイルで提供
- ✅ 既存READMEには最小限の導線のみ追記

### 推奨手順

#### 1. テンプレートのREADMEを参考用に保存

```bash
# テンプレートのREADMEを別名で保存
git show template/main:README.md > README_TEMPLATE.md
```

このファイルは参考用です。必要な部分を既存READMEに統合するか、README.bridge.mdとして併存させます。

#### 2. README.bridge.md を作成

テンプレートから **README.bridge.md** をチェックアウト：

```bash
git checkout template/main -- README.bridge.md
```

このファイルには、HQ↔Cursor ブリッジの使い方が簡潔にまとまっています。

#### 3. 既存README.mdに導線を追記

既存のREADME.mdに以下のような導線を追記してください：

```markdown
## AI協働開発

本リポジトリでは、Agent HQとCursorを連携させたAI協働開発を実施しています。

**運用方法の詳細**: [README.bridge.md](./README.bridge.md)

- プロンプトの受信: `prompts/`
- レポートの出力: `reports/`
- ローカルCI: pre-push フック
```

または、セクションとして統合：

```markdown
## 開発環境のセットアップ

### 基本セットアップ

1. 依存関係のインストール
   ```bash
   npm install
   ```

2. AI協働ブリッジのセットアップ
   ```bash
   python scripts/install_hooks.py
   ```
   
   詳細は [README.bridge.md](./README.bridge.md) を参照してください。
```

### README.bridge.md の役割

README.bridge.mdは以下に特化します：

- ✅ Git hooksのインストール
- ✅ `.agent/project.json` の設定
- ✅ prompts → Cursor → reports の運用フロー
- ✅ レポート生成コマンド
- ✅ トラブルシューティング（AI協働関連のみ）

既存READMEは、プロジェクト全体のドキュメントとして維持します。

### コマンド例

#### オプションA: 全面的に統合（小規模プロジェクト）

既存READMEが短い場合は、テンプレートの内容を統合：

```bash
# テンプレートREADMEをローカルに取得
git show template/main:README.md > README_TEMPLATE.md

# 既存READMEと手動でマージ
# - 「初期セットアップ」セクションを追加
# - 「運用方法」セクションを追加
# - 「トラブルシューティング」セクションを追加

# マージ後、README_TEMPLATE.mdを削除
rm README_TEMPLATE.md
```

#### オプションB: README.bridge.mdで併存（推奨）

既存READMEが充実している場合は、README.bridge.mdで併存：

```bash
# README.bridge.mdを取得
git checkout template/main -- README.bridge.md

# 既存READMEに導線を追記（上記の例を参照）
# エディタで既存README.mdを編集
```

#### オプションC: セクション単位で抽出

テンプレートREADMEから必要な部分のみを抽出：

```bash
# テンプレートREADMEを表示
git show template/main:README.md

# 必要なセクションをコピー＆ペースト
# - 「Git hooks をインストール」
# - 「レポート生成」
# - 「トラブルシューティング」
```

### 既存READMEに追加すべき最小限の内容

既存READMEが非常に充実している場合でも、以下は追記を推奨します：

```markdown
## AI協働開発の運用

本プロジェクトでは Agent HQ × Cursor による AI協働開発を実施しています。

### セットアップ

```bash
# Git hooks をインストール
python scripts/install_hooks.py
```

### 運用フロー

1. `prompts/` に Agent HQ からの指示が配置される
2. Cursor で実装・コミット
3. `git push` で pre-push CI が自動実行
4. CI成功後に main へ push
5. `python scripts/make_report.py` でレポート生成

詳細は [README.bridge.md](./README.bridge.md) を参照してください。
```

### 参考資料

- **README.bridge.md**: ブリッジ運用の詳細ガイド
- **docs/ADOPTION.md**: 導入手順の詳細
- **docs/WATCHER.md**: prompts/ の自動監視

---

## サポート

問題が解決しない場合は、以下の方法でサポートを受けられます：

- **GitHub Issues**: https://github.com/Nanao-jp/hq-cursor-bridge-template/issues
- **Discussions**: https://github.com/Nanao-jp/hq-cursor-bridge-template/discussions
- **README**: プロジェクトルートの `README.md` を参照

## 📚 関連ドキュメント

- **[README.md](../README.md)**: テンプレートのメインドキュメント
- **[README.bridge.md](../README.bridge.md)**: 既存リポジトリへの橋渡しガイド
- **[docs/WATCHER.md](./WATCHER.md)**: prompts/ 自動監視ガイド
- **[prompts/_SCHEMA.md](../prompts/_SCHEMA.md)**: プロンプト仕様
- **[reports/_SCHEMA.md](../reports/_SCHEMA.md)**: レポート仕様
- **[reports/QUESTION_TEMPLATE.md](../reports/QUESTION_TEMPLATE.md)**: 問い合わせテンプレート

---

**最終更新**: 2025-10-31

