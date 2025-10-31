---
conversation_id: "kpi-countup-animation"
step: 1
co_authors: ["OpenAI GPT-4.1", "Anthropic Claude 3.5 Sonnet"]
priority: "high"
timebox: "60m"
allowed_paths: ["src/components/home", "src/lib", "package.json"]
constraints:
  - "PR は作成しない。ローカル CI が成功した場合のみ main に直 push すること。"
  - "外部依存は最小限に。標準の React hooks を優先し、必要な場合のみ軽量ライブラリを検討。"
  - "パフォーマンスを考慮し、Intersection Observer を使用してビューポートに入ったときのみアニメーション開始。"
expected_outputs:
  - "KpiSection コンポーネントの更新"
  - "カウントアップアニメーション用のカスタムフック"
  - "スムーズなアニメーション実装"
success_report_path_template: "reports/kpi-countup-animation__1__success.md"
---

# タスク: トップページKPIセクションにカウントアップアニメーションを実装

## 🎯 背景と目的

現在のトップページ（`/`）の KPI セクションには、以下の数値が静的に表示されています：

- 累計設置容量: 250 MW
- 稼働中プロジェクト: 8 件
- CO2削減量: 125,000 トン/年

これらの数値にカウントアップアニメーションを追加し、ユーザーがページをスクロールしてKPIセクションに到達したときに、0から目標値まで数字がカウントアップする視覚効果を実装します。これにより、実績数値に対する注目度と印象を高めます。

## 📋 タスク詳細

### 1. カスタムフックの作成

`src/lib/useCountUp.ts` を作成し、以下の機能を持つカスタムフックを実装してください：

**機能要件:**
- 開始値から終了値までスムーズにカウントアップ
- アニメーション時間を指定可能（デフォルト: 2秒）
- イージング関数のサポート（easeOutExpo推奨）
- 整数・小数のサポート
- 千の位区切りフォーマット対応

**型定義例:**
```typescript
interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  separator?: string;
  suffix?: string;
}

function useCountUp(options: UseCountUpOptions): {
  count: string;
  startAnimation: () => void;
}
```

### 2. Intersection Observer の統合

KPI セクションがビューポートに入ったときに自動的にアニメーションを開始する機能を実装してください。

**要件:**
- `IntersectionObserver` を使用
- 一度だけアニメーション実行（再度スクロールしても再生されない）
- threshold: 0.3（30%表示されたら開始）

### 3. KpiSection コンポーネントの更新

`src/components/home/KpiSection.tsx` を更新してください：

**現在の実装確認ポイント:**
- 数値は静的に表示されている
- グリッドレイアウトで3つのKPIカードを配置

**変更内容:**
- 各KPI数値に `useCountUp` フックを適用
- Intersection Observer で初回表示時にアニメーション開始
- アニメーション中も UI が崩れないこと
- アクセシビリティ: 最終値を `aria-label` で提供

### 4. アニメーションの調整

**パフォーマンス:**
- `requestAnimationFrame` を使用
- メモリリークを防ぐため、アンマウント時にクリーンアップ

**視覚効果:**
- 3つのKPIが同時にカウント開始（ただし若干のディレイで順次開始も検討可）
- イージング関数で自然な加速・減速

## ✅ 受入条件 (Definition of Done)

- [ ] `src/lib/useCountUp.ts` が作成され、TypeScript型定義が完全
- [ ] KpiSection でカウントアップアニメーションが動作
- [ ] ページをリロードして初回スクロール時にアニメーションが実行される
- [ ] 一度アニメーション実行後、再スクロールしても再実行されない
- [ ] 千の位区切り（250,000等）が正しく表示される
- [ ] `npm run build` が成功
- [ ] `npm run lint` が成功
- [ ] レスポンシブデザインが維持されている（スマホ・タブレット・PC）
- [ ] アクセシビリティチェック（スクリーンリーダーで数値が読み上げられる）

## 💡 実装のヒント

### イージング関数の例

```typescript
// easeOutExpo: 速く始まり、ゆっくり終わる
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
```

### 千の位区切りフォーマット

```typescript
function formatNumber(num: number, separator: string = ","): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
```

### Intersection Observer の基本パターン

```typescript
const ref = useRef<HTMLDivElement>(null);
const [hasAnimated, setHasAnimated] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        // アニメーション開始
        setHasAnimated(true);
      }
    },
    { threshold: 0.3 }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => observer.disconnect();
}, [hasAnimated]);
```

## 🚫 注意事項

- **外部ライブラリは不要**: React標準のhooksで実装可能です
- **パフォーマンス優先**: 60fps を維持してください
- **既存デザインの維持**: KpiSection の現在のレイアウト・スタイルを維持してください
- **モバイルファースト**: スマホでもスムーズに動作することを確認

## 📊 完了後の確認方法

1. 開発サーバーを起動: `npm run dev`
2. トップページ（`http://localhost:3000`）を開く
3. KPIセクションまでスクロール
4. カウントアップアニメーションが実行されることを確認
5. ページをリロードして再度確認
6. Chrome DevTools でモバイル表示を確認

---

**Executor**: Cursor  
**Expected Duration**: 60分  
**Priority**: High

