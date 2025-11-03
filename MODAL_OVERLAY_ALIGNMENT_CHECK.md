# モーダルとオーバーレイのズレ確認レポート

## 現在の実装確認

### DialogOverlay（src/components/ui/dialog.tsx）
```typescript
className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
```
- **位置**: `fixed inset-0` - 画面全体をカバー
- **z-index**: `z-50`
- **アニメーション**: `data-[state=open]:animate-in data-[state=closed]:animate-out`

### DialogContent（src/components/ui/dialog.tsx）
```typescript
className="fixed left-[50%] top-[50%] z-50 ... data-[state=open]:modal-open data-[state=closed]:modal-closed"
```
- **位置**: `fixed left-[50%] top-[50%]` + CSSで`transform: translate(-50%, -50%)`
- **z-index**: `z-50`（オーバーレイと同じ）
- **アニメーション**: `data-[state=open]:modal-open data-[state=closed]:modal-closed`

### CSSアニメーション（src/app/globals.css）
```css
[data-state="open"] {
  animation: fade-slide-up 0.3s ease-out;
  transform: translate(-50%, -50%);
}

[data-state="closed"] {
  animation: fade-slide-down 0.3s ease-out;
  transform: translate(-50%, -50%);
}
```

## 問題点の可能性

### 1. z-indexの階層
- **オーバーレイ**: `z-50`
- **コンテンツ**: `z-50`（同じ）
- **問題**: DOM順序ではコンテンツが後なので上に来るはずだが、明示的に`z-index`を上げる方が安全

### 2. アニメーションのタイミング
- **オーバーレイ**: Radix UIの`animate-in`/`animate-out`を使用
- **コンテンツ**: カスタムCSSアニメーション（`fade-slide-up`/`fade-slide-down`）
- **問題**: アニメーションのタイミングが同期していない可能性

### 3. transformの適用タイミング
- `left-[50%] top-[50%]`と`transform: translate(-50%, -50%)`の併用
- アニメーションで`transform`が変更される際に、位置計算がずれる可能性

### 4. Portalの順序
- `DialogPortal`内で`DialogOverlay` → `DialogContent`の順
- しかし、Radix UIの内部実装によっては順序が変わる可能性

## 確認すべき点

1. **実際のズレの様子**:
   - オーバーレイがコンテンツの後ろに来ている？
   - オーバーレイとコンテンツのアニメーションがずれている？
   - コンテンツの位置がずれている？

2. **z-indexの調整**:
   - コンテンツの`z-index`を`z-[51]`や`z-[60]`に上げる

3. **アニメーションの統一**:
   - オーバーレイとコンテンツのアニメーションを同じタイミングに統一

4. **transformの扱い**:
   - `left-[50%] top-[50%]`は必須か確認
   - アニメーション中の`transform`の扱いを確認

## 推奨される修正

### 1. z-indexの調整
```typescript
// DialogContentのz-indexを上げる
className="fixed left-[50%] top-[50%] z-[60] ..."
```

### 2. アニメーションの確認
- オーバーレイとコンテンツのアニメーションタイミングを確認
- 必要に応じて、同じアニメーション設定を使用

### 3. transformの適用確認
- `transform: translate(-50%, -50%)`が確実に適用されているか確認
- アニメーション中のtransformの扱いを確認


