# リファクタリング計画

## 目的
- コードの重複を削減し、メンテナンス性を向上
- ヘッダー・フッターの編集を容易にする
- コンポーネントの再利用性を高める
- Dark mode対応を統一

## 実施項目

### 1. 共通レイアウトコンポーネントの作成

**作成先**: `src/components/layout/PageLayout.tsx`

**内容**:
- `PageHeader`: ページタイトル・サブタイトル表示
- `Section`: セクションコンテナ（背景色・パディング対応）
- `SectionTitle`: セクションタイトル

**効果**: 6箇所の重複コードを1箇所に集約

---

### 2. 定数・共通要素の共通化

**作成先**: `src/lib/constants.ts`

**内容**:
- `NAV_ITEMS`: ナビゲーション項目（Header用）
- `FOOTER_NAV_ITEMS`: フッター用ナビゲーション（HOME除外）
- `SITE_CONFIG`: サイト名などの設定

**効果**: ナビゲーション変更時に1箇所の修正で済む

---

### 3. Header・Footerのモジュール化

**作成先**:
- `src/components/layout/Logo.tsx` - Logoコンポーネント
- `src/components/layout/NavLink.tsx` - ナビゲーションリンク
- `src/components/layout/Header.tsx` - リファクタリング
- `src/components/layout/Footer.tsx` - リファクタリング

**構成**:
```
Header/
  ├─ Logo (共通)
  ├─ NavLinks (共通定数使用)
  └─ MobileMenu (将来拡張用)

Footer/
  ├─ Logo (共通)
  ├─ NavLinks (共通定数使用)
  └─ Copyright (共通)
```

**効果**: ヘッダー・フッターの編集が容易に

---

### 4. 各ページのリファクタリング

**対象ページ**:
- `src/app/solutions/page.tsx`
- `src/app/products/page.tsx`
- `src/app/status/page.tsx`
- `src/app/news/page.tsx`
- `src/app/company/page.tsx`
- `src/app/contact/page.tsx`

**変更内容**:
- ローカル定義の `PageHeader`, `Section`, `SectionTitle` を削除
- `@/components/layout/PageLayout` から import

---

### 5. Next.js Image APIの修正

**対象**: `src/app/page.tsx:91`

**変更前**:
```tsx
<Image src={card.imgSrc} alt={card.title} layout="fill" objectFit="cover" />
```

**変更後**:
```tsx
<Image src={card.imgSrc} alt={card.title} fill className="object-cover" />
```

---

### 6. Dark mode対応の統一

**対象ページ**:
- `solutions/page.tsx`
- `products/page.tsx`
- `news/page.tsx`
- `contact/page.tsx`

**変更内容**:
- `bg-gray-50` → `bg-gray-50 dark:bg-card`
- `text-gray-600` → `text-gray-600 dark:text-muted-foreground`
- ハードコードされた色をTailwind CSS変数に置換

---

## 実装順序

1. ✅ 定数ファイル作成（`src/lib/constants.ts`）
2. ✅ Logoコンポーネント作成（`src/components/layout/Logo.tsx`）
3. ✅ 共通レイアウトコンポーネント作成（`src/components/layout/PageLayout.tsx`）
4. ✅ Header・Footerリファクタリング
5. ✅ 各ページの重複コード削除・共通化
6. ✅ Image API修正・Dark mode統一

---

## 期待される効果

### メンテナンス性
- ナビゲーション変更: 1ファイル修正で全反映
- レイアウト変更: 共通コンポーネント1箇所で全ページに反映
- Logo変更: 1コンポーネント修正でHeader・Footer両方に反映

### 一貫性
- 全ページで統一されたレイアウト構造
- Dark mode対応の統一
- 型安全性の向上

### 拡張性
- モバイルメニューの追加が容易
- 新しいページ追加時のテンプレート化
- コンポーネントの再利用性向上

