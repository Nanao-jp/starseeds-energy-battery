# TOPページ リファクタリング調査結果

## 調査概要
TOPページ（`src/app/page.tsx`）と関連コンポーネントを調査し、リファクタリング可能な箇所を特定しました。

---

## 1. ハードコードされた値

### 1.1 色の値（oklch値）の重複
**問題**: 同じ色の値が複数のコンポーネントで直接記述されている

**検出箇所:**
- `oklch(0.18 0.02 240 / 80%)` - カード背景（KpiCard, NavigationCard, FeatureCard）
- `oklch(0.15 0.02 240 / 80%)` - カード背景（同上）
- `oklch(0.72 0.15 210 / 80%)` - プライマリカラー（多数のコンポーネント）
- `oklch(0.72 0.15 210 / 30%)`, `/40%`, `/50%`, `/60%`, `/70%` - グロー効果

**影響度**: ⚠️ **中**
- 色を変更する際に複数箇所を修正する必要がある
- タイポのリスク

**推奨**: `src/lib/theme.ts` や `src/lib/styles.ts` に定数として定義

---

### 1.2 スタイル値の重複
**問題**: 同じスタイル値が重複している

**検出箇所:**
- シャドウスタイル: `'0 4px 16px rgba(0, 0, 0, 0.2)'`（KpiCard, NavigationCard, FeatureCard）
- ホバーシャドウ: `'0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px oklch(0.72 0.15 210 / 15%) inset'`（KpiCard, FeatureCard）

**影響度**: ⚠️ **中**
- デザインの一貫性を保つために統一管理が必要

---

### 1.3 データのコンポーネント内定義
**問題**: `KpiSection.tsx` 内で `kpiData` が定義されている

```typescript
// src/components/home/KpiSection.tsx (11-30行目)
const kpiData: KpiData[] = [
  { icon: BatteryCharging, value: "Peak Capacity", ... },
  ...
];
```

**影響度**: ✅ **低**（ただしデータ駆動型に統一すべき）
- `strengths.ts` のように外部化すべき
- 他のセクションは `src/data/` にデータがある

**推奨**: `src/data/kpi.ts` に移動

---

## 2. 重複コード

### 2.1 セクションコンテナの重複
**問題**: 同じコンテナクラスが複数箇所で使用されている

**検出箇所:**
```typescript
// KpiSection.tsx (43行目)
className="container mx-auto px-4 sm:px-6 lg:px-8 py-20"

// StrengthsSection.tsx (25行目)
className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16"

// NavigationCardsSection.tsx (26行目)
className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
```

**影響度**: ⚠️ **中**
- パディングやマージンの変更時に複数箇所を修正
- レスポンシブ設定の変更時に影響範囲が広い

**推奨**: `SectionContainer` コンポーネント化

---

### 2.2 カード背景スタイルの重複
**問題**: カードの背景グラデーションが3つのコンポーネントで同じ

**検出箇所:**
```typescript
// KpiCard.tsx (26行目)
background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))'

// NavigationCard.tsx (39行目)
background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))'

// FeatureCard.tsx (55行目)
background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))'
```

**影響度**: ⚠️ **中**
- カードの背景デザインを統一変更する際に3箇所を修正

**推奨**: 共通スタイル定数として定義

---

### 2.3 ホバーエフェクトの重複
**問題**: 同じshimmerエフェクトが複数箇所で実装されている

**検出箇所:**
```typescript
// KpiCard.tsx (75行目)
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />

// NavigationCard.tsx (48行目)
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />

// FeatureCard.tsx (70行目)
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
```

**影響度**: ✅ **低**（CSSクラスで統一されているため）
- 既に `animate-shimmer` で統一されているため問題は小さい

---

### 2.4 装飾的な背景パターンの重複
**問題**: 同じ背景パターンが複数箇所で実装されている

**検出箇所:**
```typescript
// NavigationCard.tsx (81行目)
backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.72 0.15 210 / 20%) 2px, oklch(0.72 0.15 210 / 20%) 4px)'

// FeatureCard.tsx (111行目)
repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.72 0.15 210 / 10%) 2px, oklch(0.72 0.15 210 / 10%) 4px)
```

**影響度**: ⚠️ **中**
- パターンの変更時に複数箇所を修正

**推奨**: CSSクラスまたは共通コンポーネント化

---

### 2.5 コーナーアクセントの重複
**問題**: FeatureCardのコーナーアクセントが2箇所で同じパターン

**検出箇所:**
```typescript
// FeatureCard.tsx (118-149行目)
// 左上と右下で同じパターンを2回記述
```

**影響度**: ✅ **低**（ただしコンポーネント化できる）

**推奨**: `CornerAccent` コンポーネント化

---

## 3. コンポーネント化不足

### 3.1 セクションコンテナコンポーネント
**問題**: セクションのラッパーが毎回同じクラスで記述されている

**推奨コンポーネント:**
```typescript
// src/components/layout/SectionContainer.tsx
interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  py?: 'sm' | 'md' | 'lg';
}

export function SectionContainer({ children, className, py = 'md' }: SectionContainerProps) {
  const pyClass = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
  }[py];

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${pyClass} ${className || ''}`}>
      {children}
    </div>
  );
}
```

**影響度**: ⚠️ **中**
- 3箇所で使用されているため、統一管理で保守性向上

---

### 3.2 カードの基本スタイル共通化
**問題**: カードの基本スタイル（背景、シャドウ）が重複

**推奨**: `src/lib/styles.ts` に共通スタイルを定義

```typescript
// src/lib/styles.ts
export const cardStyles = {
  background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))',
  defaultShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  hoverShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px oklch(0.72 0.15 210 / 15%) inset',
} as const;
```

**影響度**: ⚠️ **中**

---

### 3.3 装飾コンポーネントの共通化
**問題**: 背景パターン、コーナーアクセントが個別に実装されている

**推奨コンポーネント:**
- `DecorativeBackground` - 背景パターン用
- `CornerAccent` - コーナーアクセント用（FeatureCardで2回使用）
- `ShimmerOverlay` - ホバー時のshimmerエフェクト用

**影響度**: ✅ **低**（ただし共通化で保守性向上）

---

## 4. その他の改善点

### 4.1 アニメーション設定の統一
**問題**: `duration: 0.3`, `duration: 0.4` などが散在

**推奨**: `src/lib/animation.ts` にアニメーション定数を定義
```typescript
export const ANIMATION = {
  fast: { duration: 0.3 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
} as const;
```

**影響度**: ✅ **低**

---

### 4.2 型定義の不足
**問題**: `index` propが複数のコンポーネントで使用されているが、用途が異なる

**検出箇所:**
- `KpiCard`: `index` - アニメーション遅延用（現在未使用）
- `NavigationCard`: `index` - lazy loading判定用

**影響度**: ✅ **低**（ただし型を明確にすべき）

---

## 総合評価

### 優先度: 高
1. ✅ **KpiDataの外部化** (`src/data/kpi.ts` に移動)
2. ⚠️ **セクションコンテナの共通化** (`SectionContainer` コンポーネント)
3. ⚠️ **カードスタイルの共通化** (`src/lib/styles.ts` に定義)

### 優先度: 中
4. ⚠️ **色の値の定数化** (`src/lib/theme.ts` に定義)
5. ⚠️ **装飾コンポーネントの共通化** (背景パターン、コーナーアクセント)

### 優先度: 低
6. ✅ **アニメーション設定の統一** (保守性向上)
7. ✅ **型定義の改善** (可読性向上)

---

## リファクタリング後の期待効果

### 保守性
- 色やスタイルの変更が1箇所で完了
- セクションのパディング/マージンの統一管理
- コンポーネントの再利用性向上

### コード量
- 現在: 重複コードが約150行
- リファクタリング後: 約50行削減（約33%削減）

### 一貫性
- デザインシステムの統一
- スタイルの一元管理

---

## 実装推奨順序

1. **Phase 1**: データの外部化（KpiData）
2. **Phase 2**: スタイル定数の定義（色、スタイル）
3. **Phase 3**: セクションコンテナの共通化
4. **Phase 4**: 装飾コンポーネントの共通化（オプション）

