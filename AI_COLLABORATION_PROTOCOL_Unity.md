# AI協働プロトコル：Agent HQ × Cursor × 人間（Unity開発版）

> **Note**: このドキュメントは**参考資料**です。現在のプロジェクト（SwingPilot-AI）はUnityプロジェクトではありませんが、将来のUnity統合や他プロジェクトでの活用を想定して維持しています。

## 目的
**Agent HQ**（GPT + Claude 討論オーケストレータ）を中核に据え、Unity開発（UI/Gameplay/エディタ拡張）において、機械可読な合意形成→実装→レビューのサイクルを回す標準プロトコルを定義します。

**対象**: Agent HQ（GPT+Claude）、Cursor、人間開発者  
**技術スタック**: Unity 2022+、C#、UI Toolkit、Addressables  
**成果物**: `_DEBATE.json`（合意）、`_REPORT.md`（実行結果）、`_QUESTION.md`（質問）

本プロトコルはUnity開発の特性（Editor/Runtime、Prefab/Scene、アセット管理）を考慮した**Agent HQ統合標準**です。

---

## なぜ刷新が必要か（Unity開発の特性）

### 従来の課題
- ❌ Prefab変更とScript変更の依存関係が曖昧
- ❌ Editor拡張の設計判断が不明確
- ❌ アセット参照の破損リスクが高い
- ❌ パフォーマンス要件（FPS、メモリ）が後付け

### Agent HQ導入後の解決
- ✅ **Prefab/Scriptの変更範囲を事前に合意**（DoDで明示）
- ✅ **Editor拡張の責務をGPT+Claudeで事前討論**
- ✅ **アセット参照チェックをDoD必須化**
- ✅ **パフォーマンス目標を定量的に設定**（60FPS、メモリ<500MB等）

---

## 🚀 軽量ローカル運用モード（PRなし・ローカルCI）

本テンプレート（`hq-cursor-bridge-template`）は、**Agent HQフル運用プロトコル**と併用可能な**軽量ローカル運用モード**を提供します。

### 運用モード比較（Unity開発特化）

| 項目 | 軽量ローカル（本テンプレ既定） | フル運用（本プロトコル） |
|---|---|---|
| **仕様伝達** | `prompts/*.md`（YAML frontmatter+本文） | `reports/*_DEBATE.json`（JSON Schema） |
| **Scene/Prefab要件** | プロンプト本文にMarkdownで記述 | `cursor_task.where`で明示 |
| **実行環境** | ローカルCursor + UnityEditor | ブランチ+PR+Unity Cloud Build |
| **CI実行** | pre-pushフック（ローカル） | GitHub Actions + Unity Cloud Build |
| **マージ** | main直push（CI通過時） | PR承認→マージ |
| **レポート** | `reports/<id>__<step>__<status>.md` | `reports/*_REPORT.md` |
| **プレイモードテスト** | ローカルEditor（手動） | CI必須（PlayMode Tests） |
| **パフォーマンス検証** | Profiler手動確認 | 自動計測（FPS、メモリ） |

### 用語マッピング（Unity開発）

| フル運用プロトコル | 軽量ローカル（本テンプレ） | Unity開発での特記事項 |
|---|---|---|
| `_DEBATE.json` | `prompts/<conversation_id>__<step>.md` | Scene構成、Prefab階層を本文に記述 |
| `cursor_task.where` | `allowed_paths` | `Assets/Scripts/`, `Assets/Prefabs/`等を明示 |
| `dod`（パフォーマンス要件） | `constraints` + 受入条件 | FPS60、メモリ<500MB等を明記 |
| `_REPORT.md` | `reports/YYYYMMDD_HHMM_<conversation_id>__<step>__<status>.md` | Profilerスクリーンショットを含める |
| PRプレビュービルド | ローカルビルド | Windowsビルドで動作確認 |

### 運用モード選択の指針（Unity開発）

#### 軽量ローカルを選ぶべき場合
- ✅ **Script修正**: 単独スクリプトのロジック修正
- ✅ **Prefab調整**: 既存Prefabのパラメータ調整
- ✅ **Editor拡張**: EditorWindowの追加・修正
- ✅ **プロトタイピング**: ゲームプレイの試行錯誤

#### フル運用を選ぶべき場合
- ⚠️ **Scene構造変更**: Scene階層の大規模リファクタリング
- ⚠️ **Addressables変更**: アセット参照の変更（破損リスク高）
- ⚠️ **Shader・Material**: レンダリングパイプライン変更
- ⚠️ **物理・衝突**: Physics設定の変更（挙動検証必須）
- ⚠️ **マルチプラットフォーム**: iOS/Android固有の変更

### 軽量ローカル運用フロー（Unity開発）

```
1. Agent HQ討論（ゲームプレイ設計+実装方針）
   ↓
2. prompts/<conversation_id>__<step>.md 作成
   （Scene/Prefab構成、パフォーマンス目標を明記）
   ↓
3. Cursorでローカル実装
   ├─ UnityEditorでPlayModeテスト
   ├─ Profilerで性能確認
   └─ 複数プラットフォームで動作確認（必要時）
   ↓
4. git commit → pre-pushフック起動
   ↓
5. ローカルCI（Unityコンパイル確認 + 任意のEditMode Tests）
   ↓
6. CI成功 → main直push / CI失敗 → 修正後再試行
   ↓
7. scripts/make_report.py でレポート生成
   （Profilerスクリーンショット、FPS実測値を添付推奨）
   ↓
8. reports/YYYYMMDD_HHMM_<conversation_id>__<step>__<status>.md をpush
   ↓
9. Agent HQがレポート確認 → 次ステップへ
```

### Unity開発での注意点

- **Metaファイル**: .metaファイルも必ずcommit（参照破損防止）
- **Prefabモード**: Prefab編集はPrefabModeで実施
- **Profiler必須**: パフォーマンス変更時は必ずProfiler確認
- **PlayModeテスト**: 手動でも良いのでPlayModeで動作確認必須
- **Unity Cloud Build**: フル運用時はCloud Buildで全プラットフォームビルド検証

---

## 🎭 役割と責務（RACI） - Unity開発特化

| 役割 | エージェント | Responsible | Unity開発での特記事項 |
|------|-------------|------------|----------------------|
| **意思決定** | Human（Owner） | 最終承認 | ゲームデザイン・UX判断 |
| **討論・合意形成** | **Agent HQ** | JSON生成 | Editor/Runtime分離の判断 |
| **アーキテクチャ** | GPT（Planner） | Scene構成・状態管理 | Scriptable Object設計 |
| **実装助言** | Claude（Advisor） | パフォーマンス・メモリ | プロファイラ活用 |
| **実装実行** | Cursor（Executor） | C#コード・Prefab編集 | Unity APIベストプラクティス |
| **CI/CD** | GitHub Actions | ビルド・テスト | Unity Cloud Build連携 |

### Unity開発での特記事項

#### GPT（Game Architecture Planner）
- **追加責務**: Scene構成、GameObject階層設計、Scriptable Object活用
- **判断基準**: 保守性、拡張性、Unity規約準拠

#### Claude（Unity Implementation Advisor）
- **追加責務**: メモリ管理、GC最適化、プロファイラ分析
- **判断基準**: FPS 60維持、メモリリーク回避、Batch処理最適化

#### Cursor（Unity Executor）
- **技術スタック**:
  - Unity 2022 LTS+
  - C# (.NET Standard 2.1)
  - UI Toolkit（旧UIElements）
  - Addressables
  - Input System（新）

- **実装時の原則**:
  - ✅ **What（何を）を明確に**、**How（どのように）は Cursor に任せる**
  - ✅ **細かいコード指示は避ける**（例: 「MonoBehaviour を継承」ではなく「Unity コンポーネントとして実装」）
  - ✅ **Unity特有の手順は最小限**（Cursor は Prefab 編集、Asset参照を自動推論できる）
  - ✅ **目的と制約を伝え、実装の詳細は Cursor の判断を尊重**

- **報告とコミットの原則**:
  - ✅ **チャット報告は簡潔に**（実装内容の箇条書きのみ）
  - ✅ **プッシュ禁止**：ユーザー指示まで `git push` しない
  - ✅ **レポート生成禁止**：ユーザー指示までレポート生成しない
  - ✅ **コミットまで**：実装完了後は `git commit` で停止

---

## 📦 成果物 - Unity開発固有フィールド

### Debate JSON - Unity固有

```json
{
  "summary": "HUDにヘルスバーコンポーネントを追加",
  "cursor_task": {
    "what": "UI Toolkit を使用したヘルスバーコンポーネントを追加",
    "where": "Assets/UI/Prefabs/HUD/HealthBar.prefab",
    "dod": [
      "Prefab階層が正しい（Canvas > HealthBar > Fill）",
      "UI Toolkit USS スタイル適用",
      "Editor再生モードで動作確認",
      "60FPS維持（Profiler確認）",
      "Console エラー 0、警告 0"
    ]
  },
  "context": {
    "unity_version": "2022.3 LTS",
    "ui_framework": "UI Toolkit",
    "asset_dependencies": ["Sprites/UI/HealthBarSprite.png"],
    "breaking_changes": false,
    "performance_budget": {
      "fps": ">= 60",
      "memory": "< 50MB (UI全体)"
    }
  }
}
```

### DoD特記事項（Unity開発必須）

| 項目 | 基準 | 検証方法 |
|------|------|----------|
| **Editor動作** | Play Mode で正常動作 | 手動確認 |
| **パフォーマンス** | 60FPS維持 | Profiler |
| **メモリ** | 予算内（各モジュール定義） | Memory Profiler |
| **Console** | エラー0、警告0 | Console ウィンドウ |
| **アセット参照** | Missing Reference なし | Project Validator |

---

## 🔄 開発フロー（E2E） - Unity開発版

```
[1] ゲームデザイン要件受信
       ↓
┌──────────────────────────────────────┐
│      Agent HQ（Orchestrator）        │
│  - GPT: Scene構成・GameObject設計    │
│  - Claude: メモリ・パフォーマンス検討 │
│  - 合意: _DEBATE.json                │
└──────┬───────────────────────────────┘
       │ 📄 _DEBATE.json（Unity要件）
       ↓
[2] CI: validate-debate-json
       ↓
┌──────────────────────────────────────┐
│         Cursor（Executor）           │
│  1. C# Script 実装                   │
│  2. Prefab 編集                      │
│  3. UI Toolkit（USS/UXML）           │
│  4. アセット参照確認                 │
│  5. Editor再生テスト                 │
│  6. Profiler確認（FPS/Memory）       │
└──────┬───────────────────────────────┘
       │ 📊 _REPORT.md + PR
       ↓
[3] Unity Build CI（自動）
       ↓
[4] Human Review（ゲームプレイ確認）
       ↓
[5] マージ → ビルド配布
```

---

## ❓ QUESTION運用 - Unity開発版

### Unity開発特有の停止条件

以下に該当する場合、**実装を停止**してQUESTION作成：

1. **Scene/Prefab構造が不明確**
   - GameObject階層が未定義
   - Parent/Child 関係が曖昧

2. **アセット参照が不明**
   - Sprite/Material/Prefab の参照元不明
   - Addressables Key が未定義

3. **パフォーマンス目標未定義**
   - FPS目標なし
   - メモリ予算なし

4. **Editor/Runtime分離が不明**
   - Editor拡張なのかRuntime機能なのか不明

5. **Input Systemの対応範囲不明**
   - Keyboard/Mouse/Gamepad/Touch のどれか不明

---

## 📚 付録 - Unity開発版

### A. Debate JSON例（UI実装）

```json
{
  "summary": "ヘルスバーをUI Toolkitで実装、60FPS維持",
  "cursor_task": {
    "what": "UI Toolkit を使用したヘルスバーコンポーネント実装",
    "where": "Assets/UI/Components/HealthBar.cs, Assets/UI/Prefabs/HUD/HealthBar.prefab",
    "dod": [
      "UI Toolkit (UXML/USS) 使用",
      "Editor Play Mode 正常動作",
      "Profiler: 60FPS維持",
      "Memory: < 50MB",
      "Console: エラー0、警告0"
    ]
  },
  "context": {
    "unity_version": "2022.3 LTS",
    "ui_framework": "UI Toolkit",
    "breaking_changes": false
  }
}
```

### B. コマンド例（Unity）

```bash
# Unity Editor 起動（CLI）
/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity -projectPath .

# テスト実行
Unity -runTests -testPlatform EditMode -testResults results.xml

# ビルド
Unity -quit -batchmode -buildTarget StandaloneWindows64 -buildPath build/
```

### C. Unity固有チェックリスト

- [ ] Prefab階層が正しい
- [ ] アセット参照が有効（Missing Referenceなし）
- [ ] UI ToolkitのUSS/UXMLが適用されている
- [ ] Profiler確認（CPU/GPU/Memory）
- [ ] Console エラー0、警告0
- [ ] Editor Play Mode で正常動作

---

## 📖 関連ドキュメント

- **[AGENTS.md](AGENTS.md)** - プロジェクト固有のAgent HQ設定
- **[AI_COLLABORATION_PROTOCOL_Software.md](AI_COLLABORATION_PROTOCOL_Software.md)** - 汎用版プロトコル
- **[AI_COLLABORATION_PROTOCOL_Web.md](AI_COLLABORATION_PROTOCOL_Web.md)** - Web開発版
- **[cursor_executor.py](cursor_executor.py)** - Cursor実行スクリプト
- **[schemas/debate.schema.json](schemas/debate.schema.json)** - JSON Schema

> **注記**: `cursor_executor.py`、`schemas/*.json` などは **フル運用（PR+JSONベース）** 向けの参考資料です。  
> 本テンプレート（`hq-cursor-bridge-template`）の **軽量ローカル運用モード** では、これらのファイルは同梱されていません。  
> 軽量ローカル運用では、`prompts/*.md`（YAML frontmatter+本文）と `scripts/` の Python スクリプトで運用します。  
> 詳細は本ドキュメントの「軽量ローカル運用モード」セクションを参照してください。

---

**Document Version**: `PROTOCOL_V2_AGENTHQ_UNITY`  
**Last Updated**: 2025-10-31  
**Status**: Agent HQ統合完了（Unity開発版・参考資料）  
**Maintained by**: Human + Agent HQ

**Note**: 現在のプロジェクト（SwingPilot-AI）はUnityではありませんが、将来のUnity統合や他プロジェクトでの活用を想定してドキュメントを維持しています。
