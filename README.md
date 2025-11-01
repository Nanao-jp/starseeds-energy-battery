# スターシーズ株式会社 蓄電池事業部 コーポレートサイト

これは、スターシーズ株式会社の系統用蓄電池（BESS）事業を紹介するコーポレートサイトです。Next.js 15, Tailwind CSS, TypeScript を使用して構築されています。

## プロジェクト概要

スターシーズ株式会社のBESS事業における事業内容、製品、実績を紹介するウェブサイトです。エネルギー分野におけるコーポレートサイトのシンプルでコピーしやすいテンプレートとなることを目指しています。

## 技術スタック

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) (アニメーション)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react) (アイコン)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (フォームバリデーション)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) (コード品質)

## 現在の構成と実装済み機能

本プロジェクトのベースラインとして、以下のページと機能が実装済みです。

### ページ構成

- **トップページ (`/`)**:
    - ヒーローセクション、価値提案、実績KPI、主要ページへの導線カード
- **事業紹介 (`/solutions`)**:
    - 蓄電池の役割、提供サービス、収益モデル、SDGsへの貢献
- **製品・技術 (`/products`)**:
    - BESSラインナップ仕様表、安全性への取り組み、EMS/BMSのUIモック
- **実績・工事状況 (`/status`)**:
    - 「運用中」「工事中」「計画中」のタブによるプロジェクトのフィルタリング表示
- **ニュース (`/news`, `/news/[slug]`)**:
    - ニュース記事一覧および詳細ページの表示 (Markdown対応)
- **会社情報 (`/company`)**:
    - 会社概要、沿革、代表メッセージ
- **問い合わせ (`/contact`)**:
    - バリデーション付き問い合わせフォーム (成功時にToast通知)

### その他

- **データ管理**: プロジェクト実績、ニュース記事、KPIデータなどのデータは `src/data` ディレクトリ以下のTypeScriptファイルで管理されています。
- **UIコンポーネント**: `shadcn/ui` を利用して、一貫性のあるUIを効率的に構築しています。
- **レスポンシブデザイン**: モバイルファーストで各ページの基本的なレスポンシブ対応が完了しています。
- **デザインシステム**: テーマカラー、スタイル定数、アニメーション設定を `src/lib` ディレクトリで一元管理し、保守性を向上させています。

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router ページ
│   ├── page.tsx            # トップページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── company/            # 会社情報ページ
│   ├── contact/            # 問い合わせページ
│   ├── news/               # ニュースページ
│   ├── products/           # 製品・技術ページ
│   ├── solutions/          # 事業紹介ページ
│   └── status/             # 実績・工事状況ページ
├── components/             # Reactコンポーネント
│   ├── home/               # トップページ専用コンポーネント
│   │   ├── KpiSection.tsx
│   │   ├── KpiCard.tsx
│   │   ├── StrengthsSection.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── NavigationCardsSection.tsx
│   │   └── NavigationCard.tsx
│   ├── layout/             # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SectionContainer.tsx
│   │   └── PageLayout.tsx
│   └── ui/                 # shadcn/ui コンポーネント
├── data/                  # データ定義
│   ├── kpi.ts              # KPIデータ
│   ├── strengths.ts        # 強みセクションデータ
│   ├── projects.ts         # プロジェクト実績データ
│   ├── news.ts             # ニュース記事データ
│   └── types.ts            # 型定義
└── lib/                    # 共通ライブラリ
    ├── theme.ts            # テーマカラー定数
    ├── styles.ts           # スタイル定数
    ├── animation.ts        # アニメーション設定
    ├── constants.ts        # サイト全体の定数
    └── utils.ts            # ユーティリティ関数
```

## リファクタリング完了

TOPページのリファクタリングを完了し、コードの保守性と品質を大幅に向上させました。

### 実施内容

- ✅ **データの外部化**: KPIデータを `src/data/kpi.ts` に移動
- ✅ **スタイル定数の定義**: `src/lib/theme.ts` と `src/lib/styles.ts` で色・スタイルを一元管理
- ✅ **アニメーション設定の統一**: `src/lib/animation.ts` でアニメーション設定を統一
- ✅ **セクションコンテナの共通化**: `SectionContainer` コンポーネントで3箇所の重複を解消
- ✅ **カードコンポーネントの最適化**: 全カードコンポーネントでスタイル定数を適用

### 改善効果

- **コード削減**: 約150行の重複コードを約50行に削減（約33%削減）
- **保守性向上**: 色やスタイルの変更が1箇所で完結
- **一貫性向上**: デザインシステムの統一管理

詳細は `REFACTORING_REPORT.md` と `PERFORMANCE_ANALYSIS.md` を参照してください。

## 今後やること (Next Steps)

このベースラインから、さらに以下の機能改善やタスクが考えられます。

### 機能改善

- **アニメーションの実装**:
    - トップページのKPIセクションに、数字がカウントアップするアニメーションを追加する。
- **インタラクティブ機能の強化**:
    - 実績・工事状況ページ (`/status`) に、プロジェクトカードクリックで詳細情報（写真、進捗KPIなど）を表示するモーダルを追加する。
- **ニュースページの機能拡張**:
    - ニュース一覧に年月でのフィルタリング機能を追加する。
- **フォームのバックエンド連携**:
    - 問い合わせフォームの送信データを実際にAPI経由で送信する処理を実装する。
- **画像の最適化と差し替え**:
    - 現在プレースホルダーとなっている画像を、実際の画像に差し替える。`next/image` の`fill`プロパティへの移行など、最適化を行う。

### 技術的改善

- **型定義の修正**:
    - `src/app/news/[slug]/page.tsx` で一時的に `any` 型を使用している部分を、Next.js 15 の正式な型定義に沿って修正する。
- **テストの導入**:
    - Jest や React Testing Library を用いたユニットテスト、コンポーネントテストを導入する。
- **CMS連携**:
    - ニュースや実績などのコンテンツを、MicroCMSやContentfulなどのヘッドレスCMSから取得するように変更する。
- **アクセシビリティの向上**:
    - WCAG AA準拠をより厳密にチェックし、改善する。

## 🤖 Agent HQ ↔ Cursor ブリッジ

このプロジェクトは **Agent HQ（複数AI討論）** と **Cursor（実装）** を連携させた AI 協働開発ワークフローを採用しています。

### 🔄 開発サイクル

```
1. Agent HQ（GPT + Claude + その他LLM）が討論
   ↓ 最適なプロンプト・実装戦略を合意
2. prompts/ にタスクを配置
   ↓ Cursor が実装指示を読み取る
3. Cursor で実装・コミット
   ↓ pre-push フックでローカルCI実行（Build + Lint）
4. CI成功 → main に push
   ↓ レポート生成スクリプトを実行
5. reports/ にレポート出力
   ↓ Agent HQ が結果を確認
6. 次のステップを討論（1に戻る）
```

### 📁 ブリッジ関連ディレクトリ

- **`prompts/`**: Agent HQ からの指示受信 inbox
- **`reports/`**: Cursor からのレポート送信 outbox
- **`scripts/`**: CI・レポート生成の自動化スクリプト
- **`.agent/`**: プロジェクト設定・状態管理
- **`.githooks/`**: pre-push フック（ローカルCI）

### 🛠️ ブリッジ用コマンド

```bash
# ローカルCIを手動実行
python scripts/ci_local.py

# レポート生成（成功時）
python scripts/make_report.py \
  --conversation-id <タスクID> \
  --step 1 \
  --status success \
  --duration 300

# レポート生成（失敗時）
python scripts/make_report.py \
  --conversation-id <タスクID> \
  --step 1 \
  --status failed
```

### 🔐 安全策

- ✅ **PRなし・ローカルCI**: pre-push フックで Build + Lint を自動実行
- ✅ **allow_paths 制限**: `.agent/project.json` で編集可能なディレクトリを制限
- ✅ **依存ゼロ**: Python標準ライブラリのみ（pip不要）
- ✅ **冪等性**: スクリプトは何度実行しても安全

詳細は `.cursorrules` および `prompts/_SCHEMA.md`、`reports/_SCHEMA.md` を参照してください。

---

## セットアップと開発

### 必要なもの

- Node.js 18.17 以降
- npm (または pnpm/yarn)
- Python 3.7+ (ブリッジスクリプト用)

### インストール

1.  リポジトリをクローンします:
    ```bash
    git clone https://github.com/Nanao-jp/starseeds-energy-battery.git
    cd starseeds-energy-battery
    ```

2.  依存関係をインストールします:
    ```bash
    npm install
    ```

3.  Git hooks をインストール（初回のみ）:
    ```bash
    python scripts/install_hooks.py
    ```

### 開発サーバーの起動

1.  プロジェクトルートに `.env.local` ファイルを作成し、以下の変数を追加します:
    ```env
    NEXT_PUBLIC_SITE_NAME="Starseeds energy Battery"
    NEXT_TELEMETRY_DISABLED=1
    ```

2.  開発サーバーを起動します:
    ```bash
    npm run dev
    ```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 利用可能なスクリプト

#### Next.js コマンド
- `npm run dev`: 開発サーバーを起動
- `npm run build`: プロダクションビルドを作成
- `npm run start`: プロダクションサーバーを起動
- `npm run lint`: ESLint を実行
- `npm run optimize:images`: 画像を最適化（`.webp`形式に変換）

#### ブリッジコマンド（Python）
- `python scripts/ci_local.py`: ローカルCI実行
- `python scripts/make_report.py`: レポート生成
- `python scripts/install_hooks.py`: Git hooks 再インストール
