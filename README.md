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
- [OpenAI](https://platform.openai.com/) (チャットボット)
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


## セットアップと開発

### 必要なもの

- Node.js 18.17 以降
- npm (または pnpm/yarn)

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

3.  環境変数を設定します:
    
    プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください:
    
    ```bash
    # OpenAI API設定（チャットボット機能用）
    OPENAI_API_KEY=your-api-key-here
    OPENAI_MODEL=gpt-4o-mini  # オプション: デフォルトは gpt-4o-mini
    
    # プロジェクトデータAPI設定（実績・工事状況ページ用）
    # 本番データのAPI URLを設定すると、そのAPIからデータを取得します
    # 設定されていない場合は、モックデータ（src/data/projects.ts）が使用されます
    PROJECTS_API_URL=https://your-api-endpoint.com/api/projects
    
    # その他の設定（オプション）
    NEXT_PUBLIC_SITE_NAME="Starseeds energy Battery"
    NEXT_TELEMETRY_DISABLED=1
    ```
    
    **OpenAI APIキーの取得方法:**
    1. [OpenAI Platform](https://platform.openai.com/) にアクセス
    2. アカウントを作成またはログイン
    3. [API Keys](https://platform.openai.com/api-keys) ページから新しいAPIキーを作成
    4. 作成したAPIキーを `.env.local` に設定
    
    **注意:** `.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

### 開発サーバーの起動

1.  開発サーバーを起動します:
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
