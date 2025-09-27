# スターシーズ株式会社 蓄電池事業部 コーポレートサイト

これは、スターシーズ株式会社の系統用蓄電池（BESS）事業を紹介するコーポレートサイトです。Next.js 15, Tailwind CSS, TypeScript を使用して構築されています。

## プロジェクト概要

スターシーズ株式会社のBESS事業における事業内容、製品、実績を紹介するウェブサイトです。エネルギー分野におけるコーポレートサイトのシンプルでコピーしやすいテンプレートとなることを目指しています。

## 技術スタック

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
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

- **データ管理**: プロジェクト実績やニュース記事などのデータは `src/data` ディレクトリ以下のTypeScriptファイルで管理されています。
- **UIコンポーネント**: `shadcn/ui` を利用して、一貫性のあるUIを効率的に構築しています。
- **レスポンシブデザイン**: モバイルファーストで各ページの基本的なレスポンシブ対応が完了しています。

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
    git clone https://github.com/your-username/bess-corp.git
    cd bess-corp
    ```

2.  依存関係をインストールします:
    ```bash
    npm install
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

- `npm run dev`: 開発サーバーを起動
- `npm run build`: プロダクションビルドを作成
- `npm run start`: プロダクションサーバーを起動
- `npm run lint`: ESLint を実行
