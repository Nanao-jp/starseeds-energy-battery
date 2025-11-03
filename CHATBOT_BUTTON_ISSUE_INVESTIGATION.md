# チャットボットボタンの位置問題 - 調査プロンプト

## 問題の概要

**症状**: HOMEページのモバイルでのみ、チャットボットボタンが右に見切れ、スクロールに追従してしまう  
**環境**: Next.js 15 (App Router), React 19, Framer Motion, Tailwind CSS  
**発生条件**: HOMEページ（`/`）のモバイル表示のみ  
**他のページ**: 正常に動作（`/products`, `/status`, `/news`, `/company`, `/contact`）

## 現在の実装

### チャットボットのレンダリング方法
```tsx
// src/components/chatbot/Chatbot.tsx
return createPortal(
  <>
    <AnimatePresence mode="wait">
      {!isOpen && (
        <motion.div
          key="button"
          layoutId="chatbot-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 99999,
            pointerEvents: "auto",
          }}
        >
          <ChatbotSimpleButton onClick={handleOpen} />
        </motion.div>
      )}
    </AnimatePresence>
    {/* ウィンドウ表示時のコード */}
  </>,
  document.body
);
```

### ボタンの構造
```tsx
// src/components/chatbot/ChatbotSimpleButton.tsx (モバイル版)
<button
  className="chatbot-gradient-animated animate-fade-up"
  style={{
    position: "relative",
    zIndex: 1,
    padding: "0.5rem 0.75rem",
    maxWidth: "calc(100vw - 2rem)",
    // ... その他のスタイル
  }}
>
  <ChatbotGradientBackground />
  {/* テキストコンテンツ */}
</button>
```

### グラデーション背景
```tsx
// src/components/chatbot/ChatbotGradientBackground.tsx
export function ChatbotGradientBackground() {
  return (
    <>
      <div className="chatbot-gradient-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 pointer-events-none" />
    </>
  );
}
```

```css
/* src/app/globals.css */
.chatbot-gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(...);
  background-size: 200% 100%;
  animation: gradient-shift 3s linear infinite;
  z-index: -1;
  pointer-events: none;
}
```

## HOMEページ特有の要素

### ページ構造
```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="space-y-24 mb-24">
      <HeroSection />
      <KpiSection />
      <StrengthsSection />
      <NavigationCardsSection />
    </div>
  );
}
```

### HeroSectionの構造
```tsx
// src/components/home/HeroSection.tsx
<section className="relative w-full h-[60vh] md:aspect-video flex items-center justify-center text-white overflow-hidden border-b border-white/20 cursor-default">
  <HeroVideoBackground />
  {/* 複数のabsolute要素 */}
</section>
```

### HeroVideoBackground
- Framer Motionの`motion.video`要素が2つ
- 常時アニメーション（opacityの切り替え）
- `position: absolute`で配置

### レイアウト構造
```tsx
// src/app/layout.tsx
<body>
  <div className="flex flex-col min-h-screen relative">
    <Header />
    <main className="flex-grow relative z-10">{children}</main>
    <Footer />
  </div>
  <ChatbotClient />
</body>
```

### グローバルCSS
```css
.dark body {
  position: relative;
  background: radial-gradient(...);
  background-attachment: scroll;
  min-height: 100vh;
}
```

## 既に試した対策

1. ✅ `createPortal`で`document.body`に直接レンダリング（他のページでは正常）
2. ✅ グラデーション背景を子要素として配置（CSSコメントに「position: fixedに影響しない」と記載）
3. ✅ `ChatbotGradientBackground`をFragmentで返すように修正
4. ❌ `transform: none`を追加（効果なし、元に戻した）
5. ❌ CSSで`!important`を使用（効果なし、元に戻した）

## 調査すべきポイント

### 1. CSSのスタッキングコンテキスト
- HOMEページで新しいスタッキングコンテキストが作成されているか？
- `overflow-hidden`（HeroSection）が影響しているか？
- `position: relative`の親要素が複数あるか？

### 2. Framer Motionの`layoutId`
- `layoutId="chatbot-container"`が`transform`を適用しているか？
- HOMEページでのみ`transform`が適用される理由は？
- 動画アニメーションがレイアウト計算に影響しているか？

### 3. レイアウトの再計算
- HOMEページのHeroSectionが大きく、スクロール時にレイアウト再計算が頻繁に発生しているか？
- 動画要素の継続的なアニメーションが原因か？

### 4. モバイル特有の問題
- ビューポートの計算がHOMEページで異なるか？
- `calc(100vw - 2rem)`の計算が正しく動作しているか？
- 横スクロールが発生しているか？

### 5. タイミングの問題
- ページ読み込み時に問題が発生するか？
- スクロール時に問題が発生するか？
- アニメーション中に問題が発生するか？

## 確認すべきコード箇所

1. `src/components/home/HeroSection.tsx` - `overflow-hidden`の影響
2. `src/components/home/HeroVideoBackground.tsx` - 動画アニメーションの影響
3. `src/app/layout.tsx` - `relative`なラッパーdivの影響
4. `src/app/globals.css` - `.dark body`の`position: relative`の影響
5. `src/components/chatbot/Chatbot.tsx` - `layoutId`と`motion.div`のスタイル
6. `src/components/chatbot/ChatbotSimpleButton.tsx` - モバイル時のスタイル

## 推測される原因（優先度順）

1. **HeroSectionの`overflow-hidden`**: 新しいスタッキングコンテキストを作成し、`fixed`要素の位置計算に影響
2. **Framer Motionの`layoutId`**: HOMEページでのみ`transform`が適用され、`position: fixed`の動作が変わる
3. **動画アニメーション**: 継続的なアニメーションがレイアウトスレッドに負荷をかけ、`fixed`要素の位置計算が遅れる
4. **`.dark body`の`position: relative`**: HOMEページのコンテンツが重いため、影響が目立つ

## 質問

1. HOMEページのモバイルでのみ`position: fixed`が正しく動作しない原因は何か？
2. 他のページでは正常なのに、HOMEページでだけ問題が発生する理由は？
3. `createPortal`で`document.body`に直接レンダリングしているのに、なぜ親要素の影響を受けるのか？
4. `layoutId`が`transform`を適用することで、どのように`position: fixed`に影響するのか？
5. HeroSectionの`overflow-hidden`が`fixed`要素に影響を与える可能性はあるか？
6. グラデーション背景の`position: absolute`が`fixed`要素の親に影響を与える可能性はあるか？

## 推奨される調査方法

1. ブラウザの開発者ツールで`computed`スタイルを確認
2. `getBoundingClientRect()`で実際の位置を確認
3. 一時的に`layoutId`を削除してテスト
4. 一時的にHeroSectionを削除してテスト
5. 一時的に`.dark body`の`position: relative`を削除してテスト

