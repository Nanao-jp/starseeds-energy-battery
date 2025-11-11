# 技術ドキュメント

このドキュメントでは、本プロジェクトの主要な機能の技術的な実装詳細を説明します。

---

## 📱 チャットボットシステム

### アーキテクチャ概要

チャットボットは、Next.jsのApp RouterとReact Server Componentsを活用したクライアント・サーバー分離アーキテクチャで実装されています。

```
┌─────────────────┐
│  ChatbotClient  │ (クライアントコンポーネント)
│  (SSR用ラッパー) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Chatbot      │ (メインコンポーネント)
│  (Portal使用)   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌──────────────────┐
│ Button │  │ WindowContent    │
│        │  │ (メッセージ表示)  │
└────────┘  └────────┬──────────┘
                    │
                    ▼
            ┌───────────────┐
            │  /api/chat    │ (API Route)
            │  (Server)     │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  Knowledge    │ (知識ベース)
            │  Base         │
            └───────────────┘
```

### コンポーネント構成

#### 1. `ChatbotClient` (`src/components/chatbot/ChatbotClient.tsx`)
- **役割**: SSR対応のラッパーコンポーネント
- **実装**: `mounted`ステートでクライアント側でのみレンダリング
- **理由**: PortalやDOM操作を安全に実行するため

#### 2. `Chatbot` (`src/components/chatbot/Chatbot.tsx`)
- **役割**: チャットボットのメインロジックとUI状態管理
- **主要機能**:
  - メッセージ状態管理 (`messages`, `isLoading`)
  - ウィンドウの開閉制御 (`isOpen`)
  - キーボード高さ検知（モバイル）
  - Portalを使用したbody直下へのレンダリング

**重要な実装ポイント**:

```typescript
// Portalでbody直下にレンダリング（z-index問題を回避）
return createPortal(
  <>
    {/* ボタン */}
    {/* ウィンドウ */}
  </>,
  document.body
);
```

#### 3. `ChatbotSimpleButton` (`src/components/chatbot/ChatbotSimpleButton.tsx`)
- **役割**: 右下に固定表示されるチャットボタン
- **特徴**:
  - モバイル: テキストのみのコンパクトなボタン
  - デスクトップ: アイコン+テキストのボタン
  - `100svw`を使用してiOSのビューポート問題に対応

#### 4. `ChatbotWindowContent` (`src/components/chatbot/ChatbotWindowContent.tsx`)
- **役割**: チャットウィンドウのコンテンツ表示
- **機能**:
  - メッセージ一覧の表示
  - 入力フォーム
  - 自動スクロール（新規メッセージ時）
  - モバイルでは自動フォーカスを無効化（キーボード競合回避）

### APIルート (`src/app/api/chat/route.ts`)

現在はテスト用の固定レスポンスを返していますが、将来的にOpenAI API等と連携する設計になっています。

**現在の実装**:
- POSTリクエストを受け取り
- 2秒の遅延を追加（実際のAPI応答時間をシミュレート）
- テスト用の固定メッセージを返却

**将来の拡張**:
- `src/lib/chatbot/prompt.ts`の`buildMessages()`を使用してプロンプトを構築
- OpenAI API等の外部サービスと連携
- エラーハンドリングとレート制限の実装

### 知識ベースシステム (`src/data/chatbot-knowledge.ts`)

**構造**:
```typescript
interface KnowledgeItem {
  category: "product" | "construction" | "faq";
  title: string;
  content: string;
  keywords: string[];
}
```

**検索アルゴリズム**:
- キーワードマッチング: 2点
- タイトルマッチ: 2点
- コンテンツマッチ: 1点
- スコアが高い順に最大3件を返却

**将来的な改善**:
- ベクトル検索への置き換え
- セマンティック検索の実装

### モバイル対応の実装

#### 1. キーボード高さ検知
```typescript
// visualViewport APIを使用してキーボードの高さを検知
const handleResize = () => {
  const viewport = window.visualViewport;
  if (viewport) {
    const heightDiff = window.innerHeight - viewport.height;
    setKeyboardHeight(Math.max(0, heightDiff));
  }
};
```

#### 2. ウィンドウ位置の動的調整
```typescript
// キーボード表示時にbottomとmaxHeightを調整
bottom: keyboardHeight > 0 ? `${keyboardHeight + 1}rem` : "1rem",
maxHeight: keyboardHeight > 0 
  ? `calc(100dvh - ${keyboardHeight}px - 2rem)` 
  : "calc(100dvh - 2rem)",
```

#### 3. 自動フォーカスの無効化
- モバイルでは自動フォーカスを無効化
- ユーザーが手動でタップするまで待機
- アニメーションとキーボード表示の競合を回避

### アニメーション

#### デスクトップ
- `layoutId`を使用したFAB→ウィンドウのモーフィングアニメーション
- Framer Motionの共有レイアウト機能を活用

#### モバイル
- `layoutId`を無効化（iOSでの`position: fixed`バグ回避）
- カスタムアニメーション（scale + opacity + y位置）
- スプリングアニメーションで自然な動きを実現

**注意**: モバイルで`layoutId`を無効化している理由は、iOS/Safariで`transform`が付いた要素の`position: fixed`が親に追従するバグを回避するためです。

---

## 🗺️ 日本地図システム

### アーキテクチャ概要

日本地図は、d3-geoライブラリを使用してGeoJSONデータをSVGに描画するシステムです。

```
┌──────────────────┐
│   JapanMap       │ (メインコンポーネント)
│   (状態管理)      │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌──────────────┐
│ GeoJSON│  │ d3-geo       │
│ データ │  │ (投影法)     │
└────────┘  └──────┬───────┘
                   │
              ┌────┴────┐
              ▼         ▼
        ┌────────┐  ┌────────┐
        │ SVG    │  │ ピン   │
        │ パス   │  │ (プロ  │
        │        │  │ ジェクト)│
        └────────┘  └────────┘
```

### 技術スタック

- **d3-geo**: 地理座標の投影とパス生成
- **GeoJSON**: 日本の都道府県境界データ
- **Framer Motion**: ズーム・パン時のスムーズなアニメーション
- **React Hooks**: 状態管理とパフォーマンス最適化

### データ構造

#### GeoJSONデータ (`public/data/japan-prefectures.json`)
- 日本の47都道府県の境界データ
- FeatureCollection形式
- 各Featureに都道府県名などのプロパティを含む

#### 地域定義 (`src/data/regions.ts`)
```typescript
interface Region {
  id: RegionId;           // 地域ID（"hokkaido", "kanto"など）
  name: string;           // 表示名（"北海道", "関東"など）
  center: [number, number]; // 中心座標 [経度, 緯度]
  scaleMultiplier: number;  // ズーム時のスケール倍率
}
```

### 主要機能

#### 1. レスポンシブ対応

画面サイズに応じて地図のサイズとスケールを自動調整：

```typescript
function getResponsiveDimensions() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  if (isMobile) {
    return {
      width: Math.min(window.innerWidth - 32, 400),
      height: width * 0.7,
      scale: 1800, // 全体表示時に北海道が見切れないように
    };
  }
  // ...
}
```

#### 2. 投影法の設定

d3-geoの`geoMercator()`投影法を使用：

```typescript
const projection = useMemo(() => {
  const center = selectedRegion 
    ? regions.find(r => r.id === selectedRegion)?.center || JAPAN_CENTER
    : JAPAN_CENTER;
  
  return geoMercator()
    .center(center)      // 中心座標
    .scale(scale)        // ズームレベル
    .translate(translate); // パン位置
}, [scale, translate, selectedRegion]);
```

#### 3. ズーム・パン機能

**マウスドラッグによるパン**:
```typescript
const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
  setIsDragging(true);
  setDragStart([e.clientX, e.clientY]);
};

const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
  if (!isDragging || !dragStart) return;
  
  const dx = e.clientX - dragStart[0];
  const dy = e.clientY - dragStart[1];
  
  setTranslate([translate[0] + dx, translate[1] + dy]);
};
```

**ホイールによるズーム**:
```typescript
const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
  e.preventDefault();
  
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(1000, Math.min(10000, scale * delta));
  
  setScale(newScale);
};
```

#### 4. 地域フォーカス機能

地域ボタンをクリックすると、その地域にズームイン：

```typescript
const handleRegionFocus = (regionId: RegionId) => {
  const region = regions.find((r) => r.id === regionId);
  if (!region) return;

  setSelectedRegion(regionId);
  
  // 地域に応じたスケールを計算
  const regionScale = getRegionScale(region, initialScale);
  
  // 地域の中心を画面中央に配置
  const tempProjection = geoMercator()
    .center(region.center)
    .scale(regionScale)
    .translate([width / 2, height / 2]);
  
  const [x, y] = tempProjection(region.center) || [width / 2, height / 2];
  const offsetX = width / 2 - x;
  const offsetY = height / 2 - y;
  
  setScale(regionScale);
  setTranslate([width / 2 + offsetX, height / 2 + offsetY]);
};
```

#### 5. プロジェクトピンの表示

プロジェクトの座標をSVG座標に変換してピンを表示：

```typescript
// 地理座標 → SVG座標への変換
const projectPoint = useMemo(() => {
  return (coordinates: [number, number]): [number, number] => {
    const projected = projection(coordinates);
    return [projected[0] as number, projected[1] as number];
  };
}, [projection]);

// プロジェクトのフィルタリング
const visibleProjects = useMemo(() => {
  if (selectedRegion) {
    // 地域選択時：その地域のプロジェクトのみ
    return projects.filter((project) => {
      const [lon, lat] = project.coordinates;
      const [regionLon, regionLat] = region.center;
      
      const lonDiff = Math.abs(lon - regionLon);
      const latDiff = Math.abs(lat - regionLat);
      
      return (
        lonDiff < REGION_FILTER_THRESHOLD &&
        latDiff < REGION_FILTER_THRESHOLD
      );
    });
  }
  
  // 全体表示時：ステータスフィルタのみ
  if (selectedStatus) {
    return projects.filter((p) => p.status === selectedStatus);
  }
  
  return projects;
}, [projects, selectedRegion, selectedStatus]);
```

### パフォーマンス最適化

#### 1. useMemoによる再計算の最適化
- `projection`: スケール・位置・地域が変更された時のみ再計算
- `pathGenerator`: projectionが変更された時のみ再計算
- `projectPoint`: projectionが変更された時のみ再計算
- `visibleProjects`: プロジェクト・地域・ステータスが変更された時のみ再計算

#### 2. データの遅延読み込み
- GeoJSONデータは`useEffect`で非同期に読み込み
- ローディング中はスピナーを表示

#### 3. アニメーションの最適化
- Framer Motionの`motion`コンポーネントでスムーズなトランジション
- ハードウェアアクセラレーションを活用

### 定数設定 (`src/lib/constants.ts`)

```typescript
// 日本の中心座標
export const JAPAN_CENTER: [number, number] = [138.0, 38.0];

// 初期スケール（全体表示時に北海道が見切れないように）
export const MAP_INITIAL_SCALE = 2000;

// 地域フィルタリングの閾値（度）
export const REGION_FILTER_THRESHOLD = 5;

// レスポンシブ設定
export const RESPONSIVE_CONFIG = {
  mobile: {
    maxWidth: 400,
    aspectRatio: 0.7,
    scale: 1800,
  },
  tablet: {
    maxWidth: 800,
    aspectRatio: 0.7,
    scale: 2000,
  },
  desktop: {
    width: 1000,
    height: 700,
    scale: 2000,
  },
};
```

### 注意事項

1. **GeoJSONデータの読み込み**: `/data/japan-prefectures.json`が存在することを前提としています
2. **座標系**: 経度・緯度の順序 `[longitude, latitude]` に注意
3. **パフォーマンス**: 大量のプロジェクトがある場合は、表示範囲外のピンを非表示にするなどの最適化を検討
4. **モバイル対応**: タッチイベントの実装は今後の拡張として検討

---

## 🔧 その他の技術的な実装

### モバイルメニュー (`src/components/layout/MobileMenu.tsx`)

- **Portal使用**: `createPortal`でbody直下にレンダリング
- **z-index管理**: `z-[60]`（オーバーレイ）、`z-[70]`（パネル）
- **アニメーション**: Framer Motionでスライドイン/アウト
- **SSR対応**: `mounted`ステートでクライアント側のみレンダリング

### ビューポート単位の使用

- **`100svw`**: iOSのアドレスバー表示/非表示に対応した視覚ビューポート単位
- **`100dvh`**: 動的ビューポート高さ（キーボード表示時に対応）

---

## 📚 参考資料

- [d3-geo Documentation](https://github.com/d3/d3-geo)
- [GeoJSON Specification](https://geojson.org/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**最終更新**: 2025-01-XX

