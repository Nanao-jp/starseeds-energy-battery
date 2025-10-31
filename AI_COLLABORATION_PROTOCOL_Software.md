# AI協働プロトコル：Agent HQ × Cursor × 人間（Software開発版）

## 目的
**Agent HQ**（GPT + Claude 討論オーケストレータ）を中核に据え、複数のAIエージェントと人間が機械可読な合意形成→実装→レビューのサイクルを回す標準プロトコルを定義します。

**対象**: Agent HQ（GPT+Claude）、Cursor、人間開発者  
**用途**: 討論→合意→実装→レポート→レビューの標準フロー定義  
**成果物**: `_DEBATE.json`（合意）、`_REPORT.md`（実行結果）、`_QUESTION.md`（質問）

本プロトコルは**Agent HQ統合後の実運用標準**であり、全AIエージェントが従うべき規約です。

---

## なぜ刷新が必要か

### 従来の課題（GPT ↔ Cursor 手動ブリッジ）
- ❌ GPTの設計書が曖昧で、Cursorが解釈に迷う
- ❌ 合意形成プロセスが不透明（人間の頭の中で判断）
- ❌ 実装結果の検証基準が不明確
- ❌ レビュー可能な監査証跡が不足

### Agent HQ導入後の解決
- ✅ **GPT + Claude が討論**し、合意を`_DEBATE.json`に機械可読形式で出力
- ✅ **スキーマ検証**により、曖昧さを排除（what/where/dod必須）
- ✅ **Cursorは合意に従うだけ**で迷わず実装
- ✅ **完了条件（DoD）明示**により、実装完了の判断が客観的
- ✅ **全履歴を`reports/`に記録**し、監査可能

---

## 🚀 軽量ローカル運用モード（PRなし・ローカルCI）

本テンプレート（`hq-cursor-bridge-template`）は、**Agent HQフル運用プロトコル**と併用可能な**軽量ローカル運用モード**を提供します。

### 運用モード比較

| 項目 | 軽量ローカル（本テンプレ既定） | フル運用（本プロトコル） |
|---|---|---|
| **仕様伝達** | `prompts/*.md`（YAML frontmatter+本文） | `reports/*_DEBATE.json`（JSON Schema） |
| **合意形成** | Agent HQ討論結果をMarkdown化 | Agent HQ討論結果をJSON出力 |
| **実行環境** | ローカルCursor | ブランチ+PR前提 |
| **CI実行** | pre-pushフック（ローカル） | GitHub Actions（中央） |
| **マージ** | main直push（CI通過時） | PR承認→マージ |
| **レポート** | `reports/<id>__<step>__<status>.md` | `reports/*_REPORT.md` |
| **問い合わせ** | `reports/QUESTION_*`（任意） | `reports/*_QUESTION.md`（必須） |
| **スキーマ検証** | YAMLフォーマット（人間可読優先） | JSON Schema（機械検証優先） |

### 用語マッピング

| フル運用プロトコル | 軽量ローカル（本テンプレ） | 対応関係 |
|---|---|---|
| `_DEBATE.json` | `prompts/<conversation_id>__<step>.md` | 討論結果の伝達形式 |
| `cursor_task` | `allowed_paths` + `expected_outputs` | 実装範囲の指定 |
| `dod`（Definition of Done） | `constraints` + 受入条件 | 完了条件の明示 |
| `_REPORT.md` | `reports/<conversation_id>__<step>__<status>.md` | 実装結果の報告 |
| `_QUESTION.md` | `reports/QUESTION_*`（拡張予定） | 不明点の問い合わせ |
| PRベースレビュー | pre-pushローカルCI | 品質保証の仕組み |

### 運用モード選択の指針

#### 軽量ローカルを選ぶべき場合
- ✅ **小規模変更**: 1-3ファイル程度の修正
- ✅ **単独開発**: レビュアー不在、または即時反映が重要
- ✅ **ローカル完結重視**: ネットワーク不安定、CI時間を削減したい
- ✅ **プロトタイピング**: 高速イテレーションが必要
- ✅ **ドキュメント更新**: README、設定ファイルの軽微な修正

#### フル運用を選ぶべき場合
- ⚠️ **破壊的変更**: APIの変更、データベーススキーマ変更
- ⚠️ **複数者レビュー**: セキュリティ、パフォーマンスの慎重な検証が必要
- ⚠️ **広範囲変更**: 10ファイル以上、複数モジュール横断
- ⚠️ **本番反映前**: ステージング環境でのE2Eテストが必須
- ⚠️ **監査要件**: 変更履歴の詳細な追跡が規制で求められる

### 軽量ローカル運用フロー

```
1. Agent HQ討論
   ↓
2. prompts/<conversation_id>__<step>.md 作成
   （frontmatter: conversation_id, step, allowed_paths, expected_outputs, constraints）
   ↓
3. Cursorがローカルで実装
   ↓
4. git commit → pre-pushフック起動
   ↓
5. ローカルCI実行（.agent/project.json の ci.build/test/format）
   ↓
6. CI成功 → main直push / CI失敗 → 修正後再試行
   ↓
7. scripts/make_report.py でレポート生成
   ↓
8. reports/<conversation_id>__<step>__<status>.md をpush
   ↓
9. Agent HQがレポート確認 → 次ステップへ
```

### 併用戦略

両運用モードは**排他的ではなく補完的**です：

- **日常の小変更**: 軽量ローカル（速度重視）
- **リリース前の大変更**: フル運用（品質重視）
- **緊急ホットフィックス**: 軽量ローカル（迅速対応）
- **アーキテクチャ変更**: フル運用（討論+検証）

プロジェクトの成熟度、チーム規模、変更の性質に応じて、適切なモードを選択してください。

---

## 🎭 役割と責務（RACI）

| 役割 | エージェント | Responsible | Accountable | Consulted | Informed |
|------|-------------|------------|-------------|-----------|----------|
| **意思決定** | Human（Owner） | 最終承認 | 全体責任 | - | 全フェーズ |
| **討論・合意形成** | **Agent HQ** | JSON生成 | 合意品質 | Human | Cursor |
| **戦略設計** | GPT（Planner） | アーキテクチャ設計 | 技術選択 | Claude | Human |
| **実装助言** | Claude（Advisor） | 品質・エッジケース指摘 | コード品質 | GPT | Human |
| **実装実行** | Cursor（Executor） | コード生成・テスト | DoD達成 | - | Agent HQ |
| **CI/CD** | GitHub Actions | 自動検証 | ビルド・テスト | - | Human |

### 各役割の詳細

#### Human（Owner/Reviewer）
- **責務**: 最終意思決定、PR承認、緊急判断
- **権限**: 全プロセスの停止・方向転換
- **関与タイミング**: PR

 レビュー、破壊的変更の承認、QUESTION回答

#### Agent HQ（Orchestrator）
- **責務**: GPT+Claude の討論を統括し、合意を `_DEBATE.json` に出力
- **成果物**: `reports/YYYYMMDD_HHMM_<Topic>_DEBATE.json`
- **検証**: `schemas/debate.schema.json` に準拠

#### GPT（Strategic Planner）
- **責務**: アーキテクチャ設計、技術選択、セキュリティレビュー
- **討論での役割**: 戦略的観点からの提案
- **判断基準**: スケーラビリティ、保守性、ベストプラクティス

#### Claude（Implementation Advisor）
- **責務**: コード品質評価、エッジケース指摘、テスト戦略
- **討論での役割**: 実装詳細からの助言
- **判断基準**: 堅牢性、エラーハンドリング、可読性

#### Cursor（Executor）
- **責務**: 合意された実装の忠実な実行、テスト、DoD検証、レポート作成
- **成果物**: コード変更、`_REPORT.md`
- **判断範囲**: 技術的詳細（変数名、関数分割等）のみ

---

## 📦 成果物と唯一の通信路

すべてのAI間通信は `reports/` ディレクトリを経由します。

### 1. Debate JSON（合意の正）
**ファイル名**: `reports/YYYYMMDD_HHMM_<Topic>_DEBATE.json`

**必須フィールド**:
```json
{
  "timestamp": "2025-10-31T00:00:00Z",
  "topic": "健全性チェックエンドポイントの改善",
  "summary": "1-2行の合意要約（500文字以内）",
  "cursor_task": {
    "what": "実装内容（1行、200文字以内）",
    "where": "対象ファイル/ディレクトリ（相対パス、400文字以内）",
    "dod": [
      "完了条件1",
      "完了条件2",
      "完了条件3（最低1つ必須）"
    ]
  },
  "issues": [
    {
      "point": "討論された論点",
      "gpt": "GPTの見解",
      "claude": "Claudeの見解"
    }
  ],
  "context": {
    "related_files": ["file1.py", "file2.ts"],
    "dependencies": ["package1", "package2"],
    "breaking_changes": false
  }
}
```

**検証**: `schemas/debate.schema.json` で自動検証（CI）

**命名規約**: `.ai-collab.yml` の `report_naming` に従う

### 2. 実行レポート（実装結果）
**ファイル名**: `reports/YYYYMMDD_HHMM_<Task>_REPORT.md`

**必須セクション**:
```markdown
# <TaskName> Report

## 概要
[1-2行のサマリ]

## 変更ファイル
- path/to/file1
- path/to/file2

## 主要実装判断
1. 判断A（理由）
2. 判断B（理由）

## テスト / 検証
- lint: pass/fail
- build: pass/fail
- tests: X passed, Y failed

## DoD（完了条件）
- [x] DoD項目1
- [x] DoD項目2

## 懸念点
[あれば記載、なければ「なし」]

## Status
完了 / 要レビュー / 要決裁

---
**Agent HQ Debate**: reports/<DEBATE_FILE>
**Created by**: Cursor Executor
**Timestamp**: <ISO8601>
```

### 3. 質問ファイル（実装停止条件）
**ファイル名**: `reports/QUESTION_YYYYMMDD_HHMM_<Task>_FOR_GPT.md`

**作成条件**（いずれかに該当する場合は実装禁止）:
- `cursor_task.what` が曖昧または欠落
- `cursor_task.where` が存在しないまたは不明確
- 破壊的変更が必要だがcontextで言及なし
- セキュリティ上の懸念がある
- 技術選択が複数あり判断材料不足

**テンプレート**:
```markdown
# QUESTION: <topic>

## 状況
<現在の状況説明>

## 問題
<何が不明確・判断できないか>

## 必要な情報
1. <質問1>
2. <質問2>

## Cursor提案（あれば）
<提案内容>

---
**Created by**: Cursor Executor
**Timestamp**: <ISO8601>
```

**運用**:
- QUESTION作成後、実装を停止しPRに`[QUESTION]`タグを追加
- Agent HQまたはHumanが回答後、新しいDEBATE JSONで再開

---

## 🔄 開発フロー（E2E）

```
┌─────────────────────────────────────────────────────────────┐
│                         Full Cycle                           │
└─────────────────────────────────────────────────────────────┘

[1] 議題受信（Issue / Discussion / User Request）
       ↓
┌──────────────────────────────────────┐
│      Agent HQ（Orchestrator）        │
│  - GPT（戦略）× Claude（実装）討論   │
│  - リスク・トレードオフ評価          │
│  - 合意形成                          │
└──────┬───────────────────────────────┘
       │ 📄 _DEBATE.json 生成
       ↓
[2] JSON出力: reports/YYYYMMDD_HHMM_<Topic>_DEBATE.json
       ↓
[3] CI: validate-debate-json（スキーマ検証）
       ↓
┌──────────────────────────────────────┐
│         Cursor（Executor）           │
│  1. JSON検出（cursor_executor.py）   │
│  2. スキーマ検証                     │
│  3. ブランチ作成                     │
│  4. 実装（what/where/dod に従う）    │
│  5. テスト・ビルド・Lint             │
│  6. DoD検証                          │
│  7. コミット・プッシュ               │
│  8. PR作成                           │
│  9. _REPORT.md 作成                  │
└──────┬───────────────────────────────┘
       │ 📊 _REPORT.md + PR
       ↓
[4] PR Review（Human + CODEOWNERS）
       ↓
[5] 承認 → マージ → main
       ↓
[6] クローズ関連Issue

※ 曖昧な場合:
   Cursor → _QUESTION.md 作成 → Agent HQ/Human 回答 → 新 _DEBATE.json
```

---

## 🌿 ブランチ・PR・コミット運用

### ブランチ命名規則
```
ai/cursor/<YYYYMMDD_HHMM>_<short-task>
```

**例**:
- `ai/cursor/20251031_1500_health-endpoint-db-check`
- `ai/cursor/20251101_0900_add-order-validation`

### コミットメッセージ
```
<type>(<scope>): <subject> -- refs reports/<DEBATE_FILE>

<body>
```

**Types**:
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメント
- `chore`: ビルド・設定

**例**:
```
feat(cursor): Add DB check and version to /health endpoint -- refs reports/20251031_1500_HealthCheck_DEBATE.json

- Added database connection check
- Added version field
- Updated tests
```

### PR作成

**タイトル**:
```
feat(cursor): <short task> -- refs reports/<DEBATE_FILE>
```

**本文（必須項目）**:
```markdown
## 概要
[_DEBATE.json の summary をコピー]

## 変更点
- file1
- file2

## DoD（完了条件）
- [x] DoD項目1
- [x] DoD項目2

## テスト結果
- pytest: X passed
- build: success
- lint: pass

## 参照
- Debate JSON: reports/<DEBATE_FILE>
- Report: reports/<REPORT_FILE>

## 懸念点
[あれば記載]
```

**PR運用ルール**:
- 1 PR = 1 Debate JSON（原則）
- 大きいタスクは連番で分割: `_DEBATE_01.json`, `_DEBATE_02.json`
- 自動マージ禁止（必ずHuman承認）

---

## 🛡️ CI/CD・ガバナンス・安全

### 必須CI（.github/workflows/）

#### 1. validate-ai-collab.yml
**役割**: 中央リポジトリ（`AI-COLLABORATION-PROTOCOL`）の参照到達性検証

**トリガー**: `.ai-collab.yml` 変更時

**Secret**: `AI_COLLAB_SYNC_TOKEN`（中央がPrivateの場合）

#### 2. validate-debate-json.yml
**役割**: `reports/*_DEBATE.json` のスキーマ検証

**トリガー**: `reports/*_DEBATE.json` 変更時

**スキーマ**: `schemas/debate.schema.json`（JSON Schema Draft 2020-12）

#### 3. 言語別CI（Python/TypeScript）
**Python**:
```yaml
- pytest -q
- black --check .
- ruff check .
```

**TypeScript**:
```yaml
- pnpm build
- pnpm lint
- pnpm test
```

### Secrets管理

| Secret Name | 用途 | 必須 |
|-------------|------|------|
| `AI_COLLAB_SYNC_TOKEN` | 中央リポジトリ参照（Private時） | ✅ |
| `ALPACA_API_KEY` | Alpaca API接続 | プロジェクト依存 |

**禁止事項**:
- ❌ `.env`、`secrets.json` のコミット
- ❌ コード中への秘密情報ハードコード
- ❌ PRでの秘密情報露出

### 安全ルール

| 行為 | 制約 |
|------|------|
| **自動マージ** | ❌ 禁止（必ずHuman承認） |
| **破壊的変更** | 🟡 事前にQUESTION作成 → 承認必須 |
| **DB削除・大量データ変更** | 🟡 Human承認必須 |
| **秘密情報コミット** | ❌ 絶対禁止 |
| **既存テストの削除** | 🟡 理由明記必須 |

---

## ❓ QUESTION運用（実装停止条件）

### 作成タイミング（必須）

以下に該当する場合、**実装を停止**してQUESTIONファイルを作成：

1. **`cursor_task.what` が曖昧**
   - 「改善する」「最適化する」等の抽象表現のみ
   - 具体的な実装内容が不明

2. **`cursor_task.where` が不明確**
   - ファイルが存在しない
   - 複数候補があり判断材料不足

3. **`cursor_task.dod` に矛盾**
   - DoD同士が矛盾（例: 「速度向上」と「機能追加で複雑化許容」）
   - 技術的に実現不可能

4. **破壊的変更が必要**
   - `context.breaking_changes: false` なのに破壊的変更が必要
   - 既存機能への影響が大きい

5. **セキュリティ上の懸念**
   - 秘密情報の扱いが不明
   - 認証・認可ロジックの変更

6. **技術選択が複数**
   - 実装方法A/B/Cがあり判断材料不足

### 判断フローチャート

```
_DEBATE.json受信
    ↓
スキーマ検証 → NG → QUESTION: スキーマ違反
    ↓ OK
what/where 明確？ → NO → QUESTION: 仕様不明
    ↓ YES
DoD矛盾なし？ → NO → QUESTION: DoD矛盾
    ↓ YES
破壊的変更必要？ → YES → context確認 → 言及なし → QUESTION
    ↓ NO
実装開始
```

### 軽微な曖昧の扱い

**提案付きQUESTION**で解決を加速：
```markdown
## Cursor提案
実装方法Aを推奨：
- 理由1
- 理由2

もしNGなら実装方法Bも可能（トレードオフ: XXX）
```

---

## 🔗 既存資産との整合

### AGENTS.md
- **位置付け**: 本プロトコルの**プロジェクト固有実装**
- **相互参照**: AGENTS.md → 本プロトコル → AGENTS.md
- **役割分担**: 本プロトコル（汎用規約）、AGENTS.md（プロジェクト固有ルール）

### cursor_executor.py
- **役割**: `_DEBATE.json`検出・スキーマ検証・実装ガイド生成
- **コマンド**:
  - `python cursor_executor.py detect` - 最新JSON検出
  - `python cursor_executor.py parse` - 実装ガイド生成
  - `python cursor_executor.py report` - レポート作成

### reports/*（既存レポート）
- **扱い**: 監査資産として保持（削除禁止）
- **参照**: 過去の判断・実装パターンの参考

### schemas/debate.schema.json
- **役割**: `_DEBATE.json` のJSON Schema定義
- **検証**: CI（validate-debate-json.yml）で自動実行

---

## 📚 付録

### A. Debate JSON最小例

```json
{
  "summary": "ヘルスチェックエンドポイントにDB接続チェックとバージョン情報を追加",
  "cursor_task": {
    "what": "/health エンドポイントにDB接続チェックとバージョン情報を追加",
    "where": "apps/api/app/routers/health.py",
    "dod": [
      "レスポンスに database フィールドが含まれる",
      "レスポンスに version フィールドが含まれる",
      "既存テストがパスする"
    ]
  }
}
```

### B. REPORT.mdテンプレート

```markdown
# <TaskName> Report

## 概要
[summary from DEBATE JSON]

## 変更ファイル
- apps/api/app/routers/health.py

## 主要実装判断
1. DB接続チェックに SELECT 1 を使用（軽量・確実）
2. バージョン情報は環境変数 APP_VERSION で上書き可能

## テスト / 検証
- pytest: 5 passed
- build: success
- lint: pass

## DoD
- [x] database フィールド追加
- [x] version フィールド追加
- [x] 既存テストパス

## 懸念点
なし

## Status
完了

---
**Agent HQ Debate**: reports/20251031_1500_HealthCheck_DEBATE.json
**Created by**: Cursor Executor
**Timestamp**: 2025-10-31T15:30:00+09:00
```

### C. PRテンプレート

```markdown
## 概要
[DEBATE JSON summary]

## 変更点
- file1
- file2

## DoD
- [x] DoD1
- [x] DoD2

## テスト結果
- tests: pass
- build: success

## 参照
- Debate: reports/<DEBATE_FILE>
- Report: reports/<REPORT_FILE>
```

### D. コマンド例

#### Python（Backend）
```bash
# 環境構築
cd apps/api
poetry install

# テスト
poetry run pytest -q

# Lint
poetry run black --check .
poetry run ruff check .
```

#### TypeScript（Frontend）
```bash
# 環境構築
cd apps/web
pnpm install

# ビルド
pnpm build

# Lint
pnpm lint

# テスト
pnpm test
```

---

## 📖 関連ドキュメント

- **[AGENTS.md](AGENTS.md)** - プロジェクト固有のAgent HQ設定
- **[cursor_executor.py](cursor_executor.py)** - Cursor実行スクリプト
- **[schemas/debate.schema.json](schemas/debate.schema.json)** - JSON Schema
- **[prompts/CURSOR_INGEST_AND_EXECUTE_PROMPT.md](prompts/CURSOR_INGEST_AND_EXECUTE_PROMPT.md)** - Cursor標準プロンプト
- **[.ai-collab.yml](.ai-collab.yml)** - 中央参照設定

> **注記**: `cursor_executor.py`、`schemas/*.json`、`.ai-collab.yml` などは **フル運用（PR+JSONベース）** 向けの参考資料です。  
> 本テンプレート（`hq-cursor-bridge-template`）の **軽量ローカル運用モード** では、これらのファイルは同梱されていません。  
> 軽量ローカル運用では、`prompts/*.md`（YAML frontmatter+本文）と `scripts/` の Python スクリプトで運用します。  
> 詳細は本ドキュメントの「軽量ローカル運用モード」セクションを参照してください。
- **[reports/](reports/)** - 実行レポート集

---

**Document Version**: `PROTOCOL_V2_AGENTHQ`  
**Last Updated**: 2025-10-31  
**Status**: Agent HQ統合完了  
**Maintained by**: Human + Agent HQ
