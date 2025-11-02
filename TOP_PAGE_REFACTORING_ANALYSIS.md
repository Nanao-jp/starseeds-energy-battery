# TOPページリファクタリング不足の分析

## 問題の本質

ユーザーの指摘通り、**TOPページのリファクタリングが不十分**でした。

## 何が不足していたか

### 1. 定数ファイルの整理が不十分だった

**実績・工事状況ページのリファクタリングでは:**
- ✅ `src/lib/status.ts` を作成してステータス関連の定数を集約
- ✅ `src/lib/constants.ts` に地図関連の定数を集約
- ✅ `src/data/regions.ts` に地域定義を集約

**TOPページのリファクタリングでは:**
- ❌ `HERO_CONFIG` が削除され、再追加時に元の値を確認せずに設定
- ❌ `HOME_NAVIGATION_CARDS` が変更され、元の設定が失われた
- ❌ `SITE_CONFIG` の会社名が変更された

### 2. 定数ファイルの一元化は完了していたが、値が間違っていた

TOPページのコンポーネント自体は適切にリファクタリングされていました：
- ✅ コンポーネントが適切に分離されている
- ✅ 定数は `src/lib/constants.ts` から読み込んでいる
- ✅ データは `src/data/` から読み込んでいる

**しかし、問題は:**
- ❌ 定数ファイルに移す際に、元の値を確認せずに新しい値を設定してしまった
- ❌ Git履歴を確認せずに推測で設定してしまった

## 具体的な問題

### HERO_CONFIG

**リファクタリング前（各コンポーネント内にハードコード）:**
```typescript
// HeroTypingAnimation.tsx
const TEXT_LINE1 = "Driven by Nature,";
const TEXT_LINE2 = "Empowered by Technology.";
const TYPING_SPEED = 60;
const GLOW_DELAY = 300;

// HeroVideoBackground.tsx
const FADE_DURATION = 3000;
src="/video/hero.mp4"
```

**リファクタリング後（constants.tsに集約）:**
```typescript
// src/lib/constants.ts
export const HERO_CONFIG = {
  text: {
    line1: "持続可能なエネルギー社会へ", // ❌ 間違った値
    line2: "スターシーズの未来", // ❌ 間違った値
  },
  typing: {
    speed: 100, // ❌ 間違った値
    glowDelay: 500, // ❌ 間違った値
  },
  video: {
    fadeDuration: 2000, // ❌ 間違った値
    sources: {
      mobile: "/videos/hero-mobile.webm", // ❌ 間違ったパス
      desktop: "/videos/hero-desktop.webm", // ❌ 間違ったパス
    },
  },
}
```

**問題:** ハードコードされた値を定数ファイルに移す際に、元の値を確認せずに新しい値を設定してしまった

### HOME_NAVIGATION_CARDS

**リファクタリング前（page.tsx内にハードコード）:**
```typescript
// src/app/page.tsx
const navigationCards = [
  {
    href: '/solutions',
    title: '事業紹介',
    description: '系統用蓄電池の役割から...',
    imgSrc: '/images/nav-solutions.webp',
  },
  // ... 3つのカード
]
```

**リファクタリング後（constants.tsに集約）:**
```typescript
// src/lib/constants.ts
export const HOME_NAVIGATION_CARDS = [
  {
    href: "/solutions",
    title: "ソリューション", // ❌ 間違ったタイトル
    description: "系統用蓄電池システムの導入により...", // ❌ 間違った説明
    imgSrc: "/images/home/nav-solutions.webp", // ❌ 間違ったパス
  },
  // ... 6つのカード（❌ 3つから6つに増やしてしまった）
]
```

**問題:** カード数を3つ→6つに増やし、タイトルや説明文も変更してしまった

## なぜこの問題が発生したか

### 1. リファクタリングの流れ

1. **実績・工事状況ページのリファクタリング**
   - `src/lib/status.ts` を作成
   - `src/lib/constants.ts` に地図関連の定数を追加
   - この時点で `constants.ts` が整理され始めた

2. **定数ファイルの一元化**
   - `HERO_CONFIG` や `HOME_NAVIGATION_CARDS` を `constants.ts` に集約
   - **しかし、元の値を確認せずに新しい値を設定してしまった**

3. **問題の発見**
   - 実行時（ブラウザで表示）まで問題が発見されなかった

### 2. 確認不足の理由

- **Git履歴を確認しなかった**
  - `git show` で元の値を確認すべきだった
- **実際のファイル構造を確認しなかった**
  - 動画や画像のパスを設定する前に、実際のファイル構造を確認すべきだった
- **段階的な変更をしなかった**
  - 一度に全てを変更せず、段階的に変更して動作確認すべきだった

## 正しいリファクタリングの流れ（今後のために）

### ステップ1: 現状の確認
```bash
# 1. Git履歴で元の値を確認
git show <commit>:src/app/page.tsx
git show <commit>:src/components/home/HeroTypingAnimation.tsx

# 2. 実際のファイル構造を確認
ls -la public/video/
ls -la public/images/
```

### ステップ2: 定数の抽出
```typescript
// 元の値をコメントで残す
export const HERO_CONFIG = {
  // 元: const TEXT_LINE1 = "Driven by Nature,";
  text: {
    line1: "Driven by Nature,",
    // ...
  },
}
```

### ステップ3: 段階的な変更
1. まず定数ファイルに移す（値は元のまま）
2. 動作確認
3. 必要に応じて値の変更を検討

## 結論

**ユーザーの指摘は正しいです。**

TOPページのリファクタリング自体は完了していましたが、**定数ファイルの整理時に元の値を確認せずに新しい値を設定してしまった**ことが問題でした。

これは「リファクタリング不足」というより、「リファクタリング時の確認不足」です。

今後は：
1. ✅ Git履歴を確認してから値を設定する
2. ✅ 実際のファイル構造を確認してからパスを設定する
3. ✅ 段階的に変更して動作確認する

これらを徹底します。

