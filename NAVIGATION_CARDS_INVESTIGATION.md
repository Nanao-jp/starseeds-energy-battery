# 「さらに詳しく」セクション調査レポート

## 問題の概要

ユーザーからの報告：「さらに詳しく」セクションが変わっている

## 調査結果

### 以前の`HOME_NAVIGATION_CARDS`（コミット f684033）

```typescript
export const HOME_NAVIGATION_CARDS: NavigationCardData[] = [
  {
    href: '/solutions',
    title: '事業紹介',
    description: '系統用蓄電池の役割から、私たちのサービスと収益モデルについてご紹介します',
    imgSrc: '/images/nav-solutions.webp',
  },
  {
    href: '/products',
    title: '製品・技術',
    description: 'コンテナ型BESSのラインナップ、最先端のEMS/BMS、そして安全性への取り組みについて',
    imgSrc: '/images/photo/photo-02.webp',
  },
  {
    href: '/status',
    title: '実績・工事状況',
    description: '現在稼働中、建設中、そして計画中のプロジェクト一覧をご覧いただけます',
    imgSrc: '/images/nav-status.webp',
  },
];
```

**特徴:**
- カード数: **3つ**のみ
- タイトル: 「事業紹介」「製品・技術」「実績・工事状況」
- 画像パス: `/images/nav-solutions.webp`, `/images/photo/photo-02.webp`, `/images/nav-status.webp`

### 現在の`HOME_NAVIGATION_CARDS`

```typescript
export const HOME_NAVIGATION_CARDS: HomeNavigationCard[] = [
  {
    href: "/solutions",
    title: "ソリューション",
    description: "系統用蓄電池システムの導入により、電力系統の安定化と効率化を実現",
    imgSrc: "/images/home/nav-solutions.webp",
  },
  {
    href: "/products",
    title: "製品・サービス",
    description: "高品質な蓄電池システムと包括的なサポートサービスを提供",
    imgSrc: "/images/home/nav-products.webp",
  },
  {
    href: "/status",
    title: "実績・工事状況",
    description: "全国でのプロジェクト実績と現在進行中の工事状況をご紹介",
    imgSrc: "/images/home/nav-status.webp",
  },
  {
    href: "/news",
    title: "ニュース",
    description: "最新のお知らせ、プレスリリース、イベント情報をお届け",
    imgSrc: "/images/home/nav-news.webp",
  },
  {
    href: "/company",
    title: "会社情報",
    description: "スターシーズ株式会社について、経営理念や企業情報をご紹介",
    imgSrc: "/images/home/nav-company.webp",
  },
  {
    href: "/contact",
    title: "お問い合わせ",
    description: "お気軽にお問い合わせください。専門スタッフがサポートいたします",
    imgSrc: "/images/home/nav-contact.webp",
  },
];
```

**特徴:**
- カード数: **6つ**に増加
- タイトル: 「ソリューション」「製品・サービス」「実績・工事状況」「ニュース」「会社情報」「お問い合わせ」
- 画像パス: `/images/home/nav-*.webp` 形式

## 変更点の詳細

### 1. カード数の変更
- **以前**: 3つのカードのみ
- **現在**: 6つのカード

### 2. タイトルの変更
- `/solutions`: 「事業紹介」→「ソリューション」
- `/products`: 「製品・技術」→「製品・サービス」
- `/status`: 変更なし（「実績・工事状況」）

### 3. 説明文の変更
- `/solutions`: 「系統用蓄電池の役割から、私たちのサービスと収益モデルについてご紹介します」→「系統用蓄電池システムの導入により、電力系統の安定化と効率化を実現」
- `/products`: 「コンテナ型BESSのラインナップ、最先端のEMS/BMS、そして安全性への取り組みについて」→「高品質な蓄電池システムと包括的なサポートサービスを提供」
- `/status`: 「現在稼働中、建設中、そして計画中のプロジェクト一覧をご覧いただけます」→「全国でのプロジェクト実績と現在進行中の工事状況をご紹介」

### 4. 画像パスの変更
- `/solutions`: `/images/nav-solutions.webp` → `/images/home/nav-solutions.webp`
- `/products`: `/images/photo/photo-02.webp` → `/images/home/nav-products.webp`
- `/status`: `/images/nav-status.webp` → `/images/home/nav-status.webp`

### 5. 追加されたカード
- `/news`: 「ニュース」
- `/company`: 「会社情報」
- `/contact`: 「お問い合わせ」

## 根本原因

リファクタリング時に`HOME_NAVIGATION_CARDS`の内容が変更され、元の設定が失われた可能性があります。または、意図的に拡張された可能性もあります。

## 修正すべき内容

ユーザーの意図を確認する必要がありますが、以前の設定に戻す場合は：

1. カード数を3つに戻す
2. タイトルと説明文を元の内容に戻す
3. 画像パスを元のパスに戻す

## 次のステップ

1. ユーザーに確認: 以前の3つのカードに戻すか、現在の6つのカードを維持するか
2. タイトルと説明文を元の内容に戻すか確認
3. 画像パスの確認（実際のファイルが存在するか）

