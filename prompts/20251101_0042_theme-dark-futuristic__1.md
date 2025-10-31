---
conversation_id: "theme-dark-futuristic"
step: 1
co_authors: ["GPT-4.1 (UI/UX)", "Claude 3.5 (Frontend Advisor)"]
priority: "high"
timebox: "90m"
allowed_paths: ["src", "public", "tailwind.config.ts", "globals.css"]
constraints:
  - "WCAG 4.5:1 以上のコントラスト必須"
  - "パフォーマンス優先（CSS > JS）"
  - "既存コンテンツは維持"
  - "prefers-reduced-motion を尊重"
expected_outputs:
  - "Tailwind カラートークン設定"
  - "グラスモーフィズム適用"
  - "未来的フォント導入"
  - "背景グラデーション"
success_report_path_template: "reports/YYYYMMDD_HHMM_theme-dark-futuristic__1__success.md"
---

# ダーク × 近未来テーマ適用

## 🎯 目的

「ダークで近未来的な高級感」を実現するデザインテーマを全体に適用します。アクセシビリティとパフォーマンスを両立しながら、視覚的なインパクトを強化します。

## 🎨 デザイン方針（GPT × Claude 合意）

### カラー
- **深いダーク背景** + **ネオンアクセント**（シアン系）
- 層構造で奥行き表現（背景 → サーフェス → アクセント）
- テキストコントラストは WCAG 4.5:1 以上を厳守

### サーフェス
- **グラスモーフィズム**（backdrop-blur）でカードに透明感
- 微細な border と subtle な glow で浮遊感
- Button は solid/ghost の2種類

### タイポグラフィ
- 見出し（英字）: **未来的フォント**（Orbitron, Space Grotesk 等）
- 本文: Noto Sans JP（既存維持）
- 行間とレターspacing を微調整

### アニメーション
- **控えめで滑らか**（CSS transition 優先）
- Intersection Observer で遅延開始
- **prefers-reduced-motion 必須対応**

### 背景演出
- 微細なグラデーション（CSS）
- 薄いライン/グリッド（SVG background）
- ゆっくりとした動き（60s〜）

## 📋 やること

### 1. Tailwind カラートークン設定
Tailwind config にダークテーマ用のカラートークンを追加：
- 背景色（深いダーク）
- サーフェス色（カード等）
- アクセント色（ネオン系）
- テキスト色（高コントラスト）

### 2. グラス効果適用
主要コンポーネントにグラスモーフィズムを適用：
- Hero セクション
- Card コンポーネント
- Button コンポーネント
- Navigation

### 3. 未来的フォント導入
見出し用に未来的フォント追加：
- 英字見出しのみ適用
- Next.js の Font Optimization 使用
- 日本語は Noto Sans JP 継続

### 4. 背景グラデーション
`globals.css` に背景レイヤーを追加：
- 深いダークのグラデーション
- 微細なグリッド/ライン（SVG）
- CSS アニメーション（控えめ）

## ✅ 受入条件

- [ ] ダークモードで「近未来感」が明確に感じられる
- [ ] テキストコントラストが WCAG 4.5:1 以上
- [ ] prefers-reduced-motion でアニメが無効化される
- [ ] `npm run build` が成功する
- [ ] `npm run lint` が成功する
- [ ] 既存コンテンツ・機能が維持されている
- [ ] パフォーマンスが著しく低下していない

## 📐 制約

- **アクセシビリティ優先**: 色だけで意味を伝えない
- **パフォーマンス重視**: 重い JS は避ける、CSS で代替
- **既存維持**: コンテンツ・構造は変更しない
- **段階的実装**: 小さなコミットで可逆的に

## 🎯 優先順位

1. **読みやすさ**（WCAG）を守ること
2. **Hero と主要 CTA** の印象強化
3. **サーフェスとカード** で奥行きを出す
4. **装飾アニメ** は最後に追加（性能測定）

## 💡 実装のヒント

### カラー例（参考）
```css
/* 深いダーク */
--bg-base: rgb(8 12 20);
--surface: rgb(15 20 30);

/* アクセント */
--accent-neon: rgb(0 220 255);
--text: rgb(230 235 245);
```

### グラス効果例
```css
.glass {
  backdrop-filter: blur(8px);
  background: rgba(15, 20, 30, 0.8);
  border: 1px solid rgba(0, 220, 255, 0.1);
}
```

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🚫 注意事項

- スクリーンショットは手動確認（Cursor は自動撮影不可）
- フォントサイズは既存を尊重（微調整のみ）
- 大幅な DOM 変更は避ける
- コンテンツの差し替えは行わない

---

**実装後**: レポート生成して結果を確認してください。

