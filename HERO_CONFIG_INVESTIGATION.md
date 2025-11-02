# HERO_CONFIG 調査レポート

## 問題の概要

ユーザーからの報告：
1. ヒーローセクションの動画が表示されない
2. テキストの内容が違う
3. ヘッダーも違う

## 調査結果

### 1. テキスト内容の不一致

**以前の設定（コミット 67ce8ac）:**
```typescript
const TEXT_LINE1 = "Driven by Nature,";
const TEXT_LINE2 = "Empowered by Technology.";
```

**現在の設定（私が追加したもの）:**
```typescript
text: {
  line1: "持続可能なエネルギー社会へ",
  line2: "スターシーズの未来",
}
```

**原因**: リファクタリング時に`HERO_CONFIG`が削除され、再追加時に元の内容を確認せずに日本語のテキストを設定してしまった。

### 2. 動画パスの不一致

**以前の設定（コミット 67ce8ac）:**
```typescript
src="/video/hero.mp4"
```

**現在の設定（私が追加したもの）:**
```typescript
video: {
  sources: {
    mobile: "/videos/hero-mobile.webm",
    desktop: "/videos/hero-desktop.webm",
  },
}
```

**実際に存在するファイル（`public/video/`）:**
- `hero.webm`
- `hero_mobile.webm`
- `hero_light.webm`
- `hero_ultralight.webm`

**問題点**:
1. ディレクトリが `/video/` ではなく `/videos/` になっている（`/videos/` ディレクトリは存在しない）
2. ファイル名が実際のファイルと一致しない（`hero-mobile.webm` vs `hero_mobile.webm`）

### 3. タイピング速度と設定値の不一致

**以前の設定:**
```typescript
const TYPING_SPEED = 60; // ミリ秒
const GLOW_DELAY = 300; // ミリ秒
const FADE_DURATION = 3000; // ミリ秒
```

**現在の設定:**
```typescript
typing: {
  speed: 100, // ミリ秒（60 → 100に変更）
  glowDelay: 500, // ミリ秒（300 → 500に変更）
},
video: {
  fadeDuration: 2000, // ミリ秒（3000 → 2000に変更）
}
```

### 4. ヘッダーについて

以前のコミット（67ce8ac）を確認したところ、ヘッダーは`HERO_CONFIG`を使用していませんでした。ヘッダーの問題は別の原因の可能性があります。

**以前のHeroSection（67ce8ac）:**
- z-indexはハードコード（`z-[1]`, `z-[2]`, `z-10`）
- `HERO_CONFIG`を使用していない

**現在のHeroSection:**
- `HERO_CONFIG.zIndex`を使用

## 修正すべき内容

### 1. テキスト内容の修正
```typescript
text: {
  line1: "Driven by Nature,",
  line2: "Empowered by Technology.",
}
```

### 2. 動画パスの修正
```typescript
video: {
  fadeDuration: 3000, // 元の値に戻す
  mobileBreakpoint: 768,
  sources: {
    mobile: "/video/hero_mobile.webm",  // 実際のファイル名に修正
    desktop: "/video/hero.webm",        // 実際のファイル名に修正
  },
}
```

### 3. タイピング設定の修正
```typescript
typing: {
  speed: 60,    // 元の値に戻す
  glowDelay: 300, // 元の値に戻す
}
```

### 4. ヘッダーについて
ヘッダーは`HERO_CONFIG`と直接関係ないため、別途調査が必要です。

## 根本原因

リファクタリングの過程で`src/lib/constants.ts`から`HERO_CONFIG`が削除されたが、再追加時に：
1. Git履歴を確認せずに新しい値を設定してしまった
2. 実際のファイル構造を確認せずにパスを設定してしまった
3. 元の設定値を確認せずに変更してしまった

## 次のステップ

1. 上記の修正を適用する
2. ヘッダーの問題を別途調査する（必要に応じて）
3. 修正後に動作確認を行う

