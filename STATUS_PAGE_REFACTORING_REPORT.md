# 実績・工事状況ページ リファクタリング調査レポート

## 📋 調査概要

実績・工事状況ページ（`src/app/status/page.tsx`）と関連コンポーネントの全要素を調査し、リファクタリングが必要な箇所を特定しました。

---

## 🔍 発見された問題点

### 1. コードの重複 ⚠️ **最重要**

#### 1.1 ステータス関連関数の重複（3箇所）

**場所**:
- `src/app/status/page.tsx` - `ProjectCard`コンポーネント内
- `src/components/status/ProjectDetailModal.tsx`
- `src/components/status/JapanMap.tsx` - `getPinColor`関数

**重複コード**:
```typescript
// 3箇所すべてで同じロジックが重複
const getStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case 'operational': return '稼働中';
    case 'construction': return '工事中';
    case 'planning': return '計画中';
  }
};

const getStatusColor = (status: ProjectStatus) => {
  // 各コンポーネントで異なる色の定義（統一されていない）
  // page.tsx: 'text-blue-400 border-blue-400/30'
  // ProjectDetailModal.tsx: 'text-blue-400 border-blue-400/40 bg-blue-400/10'
  // JapanMap.tsx: '#60a5fa' (hex値)
};
```

**問題点**:
- 同じロジックが3箇所に存在
- 色の定義が統一されていない（Tailwindクラス vs hex値）
- メンテナンスが困難（1箇所変更すると3箇所修正が必要）

**推奨対応**:
- `src/lib/status.ts`にユーティリティ関数を集約
- 定数として定義し、一箇所で管理

---

#### 1.2 モーダル開閉ロジックの重複

**場所**:
- `src/app/status/page.tsx` - 2箇所（地図のクリックとカードのクリック）

**重複コード**:
```typescript
// 2箇所で同じロジック
onClick={() => {
  setSelectedProject(project);
  setIsModalOpen(true);
}}
```

**推奨対応**:
- ハンドラー関数を抽出して統一

---

#### 1.3 タブ定義の重複

**場所**:
- `src/app/status/page.tsx` - タブの定義とステータスラベルの定義が重複

**重複コード**:
```typescript
// タブ定義
const tabs: { value: ProjectStatus; label: string }[] = [
  { value: 'operational', label: '運用中' },
  { value: 'construction', label: '工事中' },
  { value: 'planning', label: '計画中' },
];

// getStatusLabel関数内でも同じラベルを定義
```

**推奨対応**:
- タブ定義を定数として集約し、`getStatusLabel`で参照

---

### 2. ハードコードされた値 ⚠️

#### 2.1 地図のサイズ

**場所**:
- `src/app/status/page.tsx` (line 76-78)
- `src/components/status/JapanMap.tsx` (複数箇所)

**ハードコード値**:
```typescript
<JapanMap 
  width={1000}  // ハードコード
  height={700}  // ハードコード
  ...
/>
```

**問題点**:
- 画面サイズに応じて動的に変更されるべき値が固定値
- レスポンシブ対応が不十分

**推奨対応**:
- デフォルト値を定数として定義
- または、propsをオプショナルにしてコンポーネント内で計算

---

#### 2.2 色の値（hex値）

**場所**:
- `src/components/status/JapanMap.tsx` (line 355-361)

**ハードコード値**:
```typescript
const getPinColor = (status: ProjectStatus) => {
  switch (status) {
    case 'operational': return '#60a5fa'; // ハードコード
    case 'construction': return '#fbbf24'; // ハードコード
    case 'planning': return '#ffffff'; // ハードコード
  }
};
```

**問題点**:
- Tailwindの色と不一致（`blue-400` = `#60a5fa`だが、他のコンポーネントでは`text-blue-400`を使用）
- 色の変更時に複数箇所の修正が必要

**推奨対応**:
- 色の定義を定数として集約
- Tailwindのカラーシステムと統合

---

#### 2.3 マジックナンバー

**場所**:
- `src/components/status/JapanMap.tsx`

**ハードコード値**:
```typescript
const INITIAL_SCALE = 2200; // マジックナンバー
const PIN_VISIBILITY_THRESHOLD = 3000; // 未使用だが定義されている
const JAPAN_CENTER: [number, number] = [138.0, 38.0]; // 座標

// 地域フィルタリングの閾値（line 340）
return lonDiff < 5 && latDiff < 5; // マジックナンバー
```

**問題点**:
- 値の意味がコードから読み取れない
- 変更時に影響範囲が不明確

**推奨対応**:
- 定数として定義し、コメントで説明

---

#### 2.4 スタイルクラスの文字列結合

**場所**:
- `src/app/status/page.tsx` (line 34, 39)
- `src/components/status/ProjectDetailModal.tsx` (line 48)

**問題コード**:
```typescript
className={`cursor-pointer hover:shadow-xl transition-all border-2 ${getStatusColor(project.status)} hover:border-opacity-60`}
```

**問題点**:
- テンプレートリテラルによる動的なクラス結合
- Tailwindのクラス名が正しく認識されない可能性
- 型安全性がない

**推奨対応**:
- `cn()`関数を使用（既に`@/lib/utils`で定義されている）
- または、Tailwindの`clsx`を使用

---

### 3. 型定義の不足 ⚠️

#### 3.1 タブの型定義

**場所**:
- `src/app/status/page.tsx` (line 63)

**現在のコード**:
```typescript
const tabs: { value: ProjectStatus; label: string }[] = [
  { value: 'operational', label: '運用中' },
  // ...
];
```

**問題点**:
- インライン型定義
- 再利用できない

**推奨対応**:
- `src/data/types.ts`に型定義を追加

---

#### 3.2 リージョンの型定義

**場所**:
- `src/components/status/JapanMap.tsx`

**現在のコード**:
```typescript
type RegionId = ReturnType<typeof getRegions>[number]["id"];
```

**問題点**:
- 型定義が複雑で読みにくい
- リージョン情報がハードコードされている

**推奨対応**:
- リージョン定義を定数ファイルに移動
- 型定義を明確に

---

### 4. 未使用のコード

#### 4.1 未使用の定数

**場所**:
- `src/components/status/JapanMap.tsx` (line 99)

**未使用コード**:
```typescript
const PIN_VISIBILITY_THRESHOLD = 3000; // 定義されているが使用されていない
```

**推奨対応**:
- 削除または使用する

---

#### 4.2 未使用のインポート

**場所**:
- `src/app/status/page.tsx` (line 7)

**未使用インポート**:
```typescript
import { CardFooter } from "@/components/ui/card"; // 使用されていない
```

**推奨対応**:
- 削除

---

### 5. コンポーネントの責務の分離不足

#### 5.1 ProjectCardコンポーネント

**場所**:
- `src/app/status/page.tsx` (line 14-56)

**問題点**:
- ページコンポーネント内に定義されている
- 再利用できない
- ステータス関連の関数がコンポーネント内に定義されている

**推奨対応**:
- `src/components/status/ProjectCard.tsx`に分離
- ステータス関連の関数はユーティリティからインポート

---

#### 5.2 JapanMapコンポーネントの肥大化

**場所**:
- `src/components/status/JapanMap.tsx` (602行)

**問題点**:
- 1つのコンポーネントに多くの責務が含まれている
  - GeoJSONデータの読み込み
  - 地図の描画
  - ズーム・パン機能
  - ピンの表示
  - リージョン選択機能
  - レスポンシブ対応

**推奨対応**:
- サブコンポーネントに分離
  - `MapControls` - コントロールUI
  - `MapPins` - ピン表示
  - `MapPath` - 地図のパス描画

---

### 6. パフォーマンスの問題

#### 6.1 不要な再レンダリング

**場所**:
- `src/app/status/page.tsx` - `ProjectCard`コンポーネント

**問題点**:
- `getStatusLabel`と`getStatusColor`が毎回再計算される
- プロジェクトリストが変更されると全てのカードが再レンダリングされる

**推奨対応**:
- `React.memo`を使用してメモ化
- ユーティリティ関数をコンポーネント外に移動

---

### 7. 定数の集約不足

#### 7.1 スタイル定数

**問題点**:
- スタイルクラスが各コンポーネントに散在している
- 変更時に複数箇所の修正が必要

**推奨対応**:
- `src/lib/status.ts`にスタイル定数を集約

---

#### 7.2 リージョン定義

**場所**:
- `src/components/status/JapanMap.tsx` (line 102-157)

**問題点**:
- リージョン定義がコンポーネント内にハードコードされている
- 他のコンポーネントから参照できない

**推奨対応**:
- `src/data/regions.ts`に移動

---

## 📊 リファクタリング優先度

### 🔴 高優先度（即座に対応）

1. **ステータス関連関数の集約**
   - 影響範囲: 3ファイル
   - 作業量: 小
   - 効果: 高（メンテナンス性向上）

2. **ハードコードされた色の値の統一**
   - 影響範囲: 3ファイル
   - 作業量: 小
   - 効果: 高（一貫性向上）

3. **未使用コードの削除**
   - 影響範囲: 2ファイル
   - 作業量: 極小
   - 効果: 中（コードの可読性向上）

### 🟡 中優先度（近日中に対応）

4. **ProjectCardコンポーネントの分離**
   - 影響範囲: 1ファイル
   - 作業量: 小
   - 効果: 中（再利用性向上）

5. **マジックナンバーの定数化**
   - 影響範囲: 1ファイル
   - 作業量: 小
   - 効果: 中（可読性向上）

6. **タブ定義の集約**
   - 影響範囲: 1ファイル
   - 作業量: 極小
   - 効果: 中（一貫性向上）

### 🟢 低優先度（時間があるときに対応）

7. **JapanMapコンポーネントの分割**
   - 影響範囲: 1ファイル
   - 作業量: 大
   - 効果: 高（可読性・保守性向上）

8. **型定義の改善**
   - 影響範囲: 複数ファイル
   - 作業量: 中
   - 効果: 中（型安全性向上）

---

## 💡 推奨されるリファクタリング計画

### Phase 1: ユーティリティの集約（高優先度）

1. `src/lib/status.ts`を作成
   - `getStatusLabel()`関数
   - `getStatusColor()`関数（Tailwindクラス版）
   - `getStatusPinColor()`関数（hex値版）
   - ステータス関連の定数

2. 既存ファイルからユーティリティ関数を削除し、インポートに変更

### Phase 2: 定数の集約（中優先度）

1. `src/data/regions.ts`を作成
   - リージョン定義を移動
   - 型定義を追加

2. `src/lib/constants.ts`を作成
   - 地図関連の定数
   - マジックナンバーの定数化

### Phase 3: コンポーネントの分離（中優先度）

1. `src/components/status/ProjectCard.tsx`を作成
   - `ProjectCard`コンポーネントを分離

2. `src/components/status/MapControls.tsx`を作成（低優先度）
   - 地図のコントロールUIを分離

---

## 📝 詳細なリファクタリング対象ファイル一覧

### 修正が必要なファイル

1. **`src/app/status/page.tsx`**
   - ステータス関連関数の削除
   - ProjectCardコンポーネントの分離
   - 未使用インポートの削除
   - タブ定義の集約

2. **`src/components/status/ProjectDetailModal.tsx`**
   - ステータス関連関数の削除
   - スタイルクラスの定数化

3. **`src/components/status/JapanMap.tsx`**
   - `getPinColor`関数の削除
   - リージョン定義の移動
   - マジックナンバーの定数化
   - 未使用定数の削除

### 新規作成が必要なファイル

1. **`src/lib/status.ts`** - ステータス関連のユーティリティ
2. **`src/data/regions.ts`** - リージョン定義
3. **`src/components/status/ProjectCard.tsx`** - ProjectCardコンポーネント
4. **`src/lib/constants.ts`** - 定数の集約（オプション）

---

## 🔗 関連ファイル

- `src/app/status/page.tsx` - メインページ
- `src/components/status/JapanMap.tsx` - 地図コンポーネント
- `src/components/status/ProjectDetailModal.tsx` - モーダルコンポーネント
- `src/data/projects.ts` - プロジェクトデータ
- `src/data/types.ts` - 型定義
- `src/lib/theme.ts` - テーマ定義

---

## 📌 調査結果サマリー

### 発見された問題

- **コードの重複**: 3箇所（ステータス関連関数）
- **ハードコード**: 10箇所以上（色、サイズ、マジックナンバー）
- **未使用コード**: 2箇所（定数、インポート）
- **コンポーネントの分離不足**: 2箇所（ProjectCard、JapanMap）

### 推奨されるリファクタリング

1. **即座に対応**: ステータス関連関数の集約
2. **近日中に対応**: 定数の集約、コンポーネントの分離
3. **時間があるときに対応**: JapanMapコンポーネントの分割

### 期待される効果

- **メンテナンス性の向上**: 一箇所の変更で全体に反映
- **コードの可読性向上**: 重複の削除、定数の明確化
- **再利用性の向上**: コンポーネントとユーティリティの分離
- **型安全性の向上**: 型定義の改善

