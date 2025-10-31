# AI協働プロトコル：Agent HQ × Cursor × 人間（Web開発版）

## 目的
**Agent HQ**（GPT + Claude 討論オーケストレータ）を中核に据え、Web開発（Next.js/React/TypeScript）において、機械可読な合意形成→実装→レビューのサイクルを回す標準プロトコルを定義します。

**対象**: Agent HQ（GPT+Claude）、Cursor、人間開発者  
**技術スタック**: Next.js、React、TypeScript、TailwindCSS  
**成果物**: `_DEBATE.json`（合意）、`_REPORT.md`（実行結果）、`_QUESTION.md`（質問）

本プロトコルはWeb開発の特性（UI/UX、フロントエンド/バックエンド統合、パフォーマンス）を考慮した**Agent HQ統合標準**です。

---

## なぜ刷新が必要か（Web開発の特性）

### 従来の課題
- ❌ UI設計とロジックが混在し、合意が曖昧
- ❌ コンポーネント分割の判断基準が不明確
- ❌ パフォーマンス要件が実装後に発覚
- ❌ レスポンシブ対応の漏れ

### Agent HQ導入後の解決
- ✅ **UI要件とロジックを分離**して合意（`cursor_task`で明示）
- ✅ **コンポーネント設計をGPT+Claudeで事前討論**
- ✅ **パフォーマンス要件を DoD に明記**（LCP、TTI等）
- ✅ **レスポンシブ対応をDoD必須項目化**

---

## 🎭 役割と責務（RACI） - Web開発特化

| 役割 | エージェント | Responsible | Web開発での特記事項 |
|------|-------------|------------|---------------------|
| **意思決定** | Human（Owner） | 最終承認 | UI/UXの最終判断 |
| **討論・合意形成** | **Agent HQ** | JSON生成 | UI設計とロジックの統合 |
| **UI/UX設計** | GPT（Planner） | コンポーネント構成・状態管理 | デザインシステム準拠 |
| **実装助言** | Claude（Advisor） | パフォーマンス・アクセシビリティ | Core Web Vitals、WCAG準拠 |
| **実装実行** | Cursor（Executor） | Next.js/React/TS コード生成 | Tailwind、shadcn/ui活用 |
| **CI/CD** | GitHub Actions | ビルド・Lint・E2Eテスト | Vercel連携 |

### Web開発での特記事項

#### GPT（UI/UX Planner）
- **追加責務**: コンポーネント階層設計、状態管理戦略（useState/Context/Zustand）
- **判断基準**: 再利用性、パフォーマンス（React.memo、useMemo）、SEO

#### Claude（Frontend Advisor）
- **追加責務**: アクセシビリティ（ARIA属性）、Core Web Vitals最適化
- **判断基準**: LCP < 2.5s、CLS < 0.1、ユーザビリティ

#### Cursor（Frontend Executor）
- **技術スタック**:
  - Next.js 14+ (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui
  - TanStack Query (React Query)

---

## 📦 成果物と唯一の通信路

### Debate JSON - Web開発固有フィールド

```json
{
  "summary": "ダッシュボードにチャートコンポーネントを追加",
  "cursor_task": {
    "what": "Rechartsを使用したチャートコンポーネントを追加",
    "where": "apps/web/src/components/SignalChart.tsx",
    "dod": [
      "レスポンシブ対応（sm/md/lg）",
      "ダークモード対応",
      "LCP < 2.5s",
      "アクセシビリティスコア 95+",
      "E2Eテスト追加"
    ]
  },
  "context": {
    "ui_framework": "shadcn/ui",
    "chart_library": "recharts",
    "breaking_changes": false,
    "performance_budget": {
      "lcp": "< 2.5s",
      "fcp": "< 1.8s",
      "cls": "< 0.1"
    }
  }
}
```

### DoD特記事項（Web開発必須）

すべてのUI実装は以下を満たす必要があります：

| 項目 | 基準 | 検証方法 |
|------|------|----------|
| **レスポンシブ** | sm(640px)/md(768px)/lg(1024px) | Chrome DevTools |
| **ダークモード** | TailwindCSS dark: クラス | 手動切り替え確認 |
| **アクセシビリティ** | WCAG 2.1 AA / Lighthouse 90+ | `pnpm lighthouse` |
| **パフォーマンス** | LCP < 2.5s、CLS < 0.1 | Lighthouse CI |
| **TypeScript** | strict mode、エラー0 | `pnpm typecheck` |
| **Lint** | ESLint + Prettier | `pnpm lint` |

---

## 🔄 開発フロー（E2E） - Web開発版

```
[1] UI/UX要件受信（Figma / 口頭 / Issue）
       ↓
┌──────────────────────────────────────┐
│      Agent HQ（Orchestrator）        │
│  - GPT: コンポーネント設計           │
│  - Claude: パフォーマンス・A11y検討  │
│  - 合意: _DEBATE.json                │
└──────┬───────────────────────────────┘
       │ 📄 _DEBATE.json（UI要件 + DoD）
       ↓
[2] CI: validate-debate-json
       ↓
┌──────────────────────────────────────┐
│         Cursor（Executor）           │
│  1. Next.js/React/TS 実装            │
│  2. TailwindCSS スタイリング         │
│  3. shadcn/ui コンポーネント活用     │
│  4. レスポンシブ対応                 │
│  5. ダークモード対応                 │
│  6. アクセシビリティ対応             │
│  7. パフォーマンス最適化             │
│  8. E2Eテスト作成                    │
└──────┬───────────────────────────────┘
       │ 📊 _REPORT.md + PR
       ↓
[3] Lighthouse CI（自動）
       ↓
[4] Vercel Preview Deployment（自動）
       ↓
[5] Human Review（UI/UX確認）
       ↓
[6] マージ → 本番デプロイ
```

---

## 🌿 ブランチ・PR運用 - Web開発版

### コミットメッセージ（Web特有type）

```
<type>(<scope>): <subject> -- refs reports/<DEBATE_FILE>
```

**Web開発特有Types**:
- `feat(ui)`: UI コンポーネント追加
- `feat(page)`: ページ追加
- `fix(style)`: スタイル修正
- `perf`: パフォーマンス改善
- `a11y`: アクセシビリティ改善

**例**:
```
feat(ui): Add responsive chart component with dark mode -- refs reports/20251031_1500_ChartComponent_DEBATE.json

- Added Recharts integration
- Responsive sm/md/lg breakpoints
- Dark mode with Tailwind
- LCP: 2.1s (target: < 2.5s)
- Accessibility score: 96
```

---

## 🛡️ CI/CD - Web開発版

### 必須CI（.github/workflows/）

#### 1. Build & Lint
```yaml
- pnpm install
- pnpm build
- pnpm lint
- pnpm typecheck
```

#### 2. Lighthouse CI
```yaml
- pnpm lighthouse-ci
# 基準:
# - Performance: 90+
# - Accessibility: 90+
# - Best Practices: 90+
# - SEO: 90+
```

#### 3. E2E Tests（Playwright）
```yaml
- pnpm test:e2e
```

#### 4. Vercel Preview
- PR作成時に自動デプロイ
- プレビューURLでUI確認

---

## ❓ QUESTION運用 - Web開発版

### Web開発特有の停止条件

以下に該当する場合、**実装を停止**してQUESTION作成：

1. **UI設計が曖昧**
   - レイアウト・カラー・タイポグラフィが不明
   - コンポーネント階層が不明確

2. **状態管理方針が未定**
   - useState / Context / Zustand の選択基準不明
   - グローバル状態の管理方針不明

3. **パフォーマンス要件が未定義**
   - 初期表示時間の目標値なし
   - データ量が不明（ページネーション要否判断不可）

4. **レスポンシブ対応範囲が不明**
   - 対応ブレークポイント未定義
   - モバイルファースト or デスクトップファースト不明

5. **アクセシビリティ要件が不明**
   - WCAG準拠レベル不明（A/AA/AAA）
   - キーボード操作対応の要否不明

---

## 🔗 既存資産との整合 - Web開発版

### プロジェクト構造

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # トップページ
│   │   ├── layout.tsx    # ルートレイアウト
│   │   └── logs/
│   │       └── page.tsx
│   ├── components/       # UIコンポーネント
│   │   ├── SignalChart.tsx
│   │   ├── SignalList.tsx
│   │   └── OrderList.tsx
│   └── lib/
│       └── api.ts        # API Client
├── public/               # 静的アセット
├── package.json
└── tailwind.config.ts
```

---

## 📚 付録 - Web開発版

### A. Debate JSON例（UI実装）

```json
{
  "summary": "シグナルチャートをレスポンシブ対応・ダークモード対応で追加",
  "cursor_task": {
    "what": "Recharts を使用したシグナルチャートコンポーネントを追加",
    "where": "apps/web/src/components/SignalChart.tsx",
    "dod": [
      "レスポンシブ: sm/md/lg ブレークポイント対応",
      "ダークモード: Tailwind dark: クラス使用",
      "LCP < 2.5s",
      "Accessibility Score 95+",
      "TypeScript strict mode エラー0"
    ]
  },
  "context": {
    "ui_framework": "shadcn/ui",
    "chart_library": "recharts",
    "state_management": "TanStack Query",
    "styling": "TailwindCSS",
    "breaking_changes": false
  }
}
```

### B. コマンド例（Next.js/TypeScript）

```bash
# 環境構築
cd apps/web
pnpm install

# 開発サーバー起動
pnpm dev
# → http://localhost:3000

# ビルド
pnpm build

# Lint
pnpm lint

# 型チェック
pnpm typecheck

# Lighthouse CI
pnpm lighthouse

# E2Eテスト
pnpm test:e2e
```

### C. パフォーマンス最適化チェックリスト

- [ ] 画像最適化（next/image使用）
- [ ] フォント最適化（next/font使用）
- [ ] Code Splitting（dynamic import）
- [ ] React.memo / useMemo / useCallback
- [ ] ISR / SSG 活用
- [ ] Bundle Size 監視

### D. アクセシビリティチェックリスト

- [ ] セマンティックHTML（header/nav/main/footer）
- [ ] ARIA属性（role/aria-label/aria-describedby）
- [ ] キーボード操作対応（Tab/Enter/Escape）
- [ ] フォーカスインジケータ
- [ ] カラーコントラスト（AA基準: 4.5:1以上）
- [ ] スクリーンリーダー対応

---

## 📖 関連ドキュメント

- **[AGENTS.md](AGENTS.md)** - プロジェクト固有のAgent HQ設定
- **[AI_COLLABORATION_PROTOCOL_Software.md](AI_COLLABORATION_PROTOCOL_Software.md)** - 汎用版プロトコル
- **[cursor_executor.py](cursor_executor.py)** - Cursor実行スクリプト
- **[schemas/debate.schema.json](schemas/debate.schema.json)** - JSON Schema
- **[prompts/CURSOR_INGEST_AND_EXECUTE_PROMPT.md](prompts/CURSOR_INGEST_AND_EXECUTE_PROMPT.md)** - Cursor標準プロンプト

---

**Document Version**: `PROTOCOL_V2_AGENTHQ_WEB`  
**Last Updated**: 2025-10-31  
**Status**: Agent HQ統合完了（Web開発版）  
**Maintained by**: Human + Agent HQ
