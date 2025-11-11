"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { geoPath, geoMercator } from "d3-geo";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { Project, ProjectStatus } from "@/data/types";
import { getRegions, getRegionScale, type RegionId } from "@/data/regions";
import { RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  JAPAN_CENTER,
  MAP_INITIAL_SCALE,
  MAP_DEFAULT_SIZE,
  REGION_FILTER_THRESHOLD,
  RESPONSIVE_CONFIG,
  MAP_STYLES,
} from "@/lib/constants";
import { getStatusColorForPin, getPinColorRGB } from "@/lib/status";

interface JapanMapProps {
  width?: number;
  height?: number;
  projects?: Project[];
  selectedStatus?: ProjectStatus;
  onProjectClick?: (project: Project) => void;
}

// 画面サイズに応じた初期設定を計算
function getResponsiveDimensions() {
  if (typeof window === "undefined") {
    return {
      width: MAP_DEFAULT_SIZE.width,
      height: MAP_DEFAULT_SIZE.height,
      scale: MAP_INITIAL_SCALE,
    };
  }

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  if (isMobile) {
    const width = Math.min(
      window.innerWidth - 32,
      RESPONSIVE_CONFIG.mobile.maxWidth
    );
    const height = width * RESPONSIVE_CONFIG.mobile.aspectRatio;
    return {
      width,
      height,
      scale: RESPONSIVE_CONFIG.mobile.scale,
    };
  } else if (isTablet) {
    const width = Math.min(
      window.innerWidth - 64,
      RESPONSIVE_CONFIG.tablet.maxWidth
    );
    const height = width * RESPONSIVE_CONFIG.tablet.aspectRatio;
    return {
      width,
      height,
      scale: RESPONSIVE_CONFIG.tablet.scale,
    };
  } else {
    return {
      width: RESPONSIVE_CONFIG.desktop.width,
      height: RESPONSIVE_CONFIG.desktop.height,
      scale: RESPONSIVE_CONFIG.desktop.scale,
    };
  }
}

export function JapanMap({ 
  width: propWidth, 
  height: propHeight,
  projects = [],
  selectedStatus,
  onProjectClick
}: JapanMapProps) {
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // SSR/ハイドレーション対応: クライアント側でのみ初期化
  useEffect(() => {
    setMounted(true);
  }, []);

  // レスポンシブ対応: 画面サイズに応じた寸法とスケール
  const [dimensions, setDimensions] = useState(() => {
    if (propWidth && propHeight) {
      return { width: propWidth, height: propHeight, scale: MAP_INITIAL_SCALE };
    }
    // SSR時はデフォルト値を使用
    return {
      width: MAP_DEFAULT_SIZE.width,
      height: MAP_DEFAULT_SIZE.height,
      scale: MAP_INITIAL_SCALE,
    };
  });

  const { width, height } = dimensions;
  
  // initialScaleを動的に計算（dimensions変更時に更新される）
  const initialScale = useMemo(() => dimensions.scale, [dimensions.scale]);
  
  // モバイル時の初期translateを計算（北海道が見えるように少し上にシフト）
  const getInitialTranslate = useCallback((): [number, number] => {
    if (propWidth && propHeight) {
      return [propWidth / 2, propHeight / 2 + 50]; // デスクトップ: 下にシフト
    }
    if (mounted && typeof window !== "undefined" && window.innerWidth < 768) {
      // モバイル時: 少し上にシフト（北海道が見えるように）
      return [width / 2, height / 2 - 20];
    }
    // デスクトップ: 下にシフトして北海道の上部が見えるように
    return [width / 2, height / 2 + 50];
  }, [propWidth, propHeight, width, height, mounted]);

  // ズーム・パンの状態管理
  const [scale, setScale] = useState(() => {
    if (propWidth && propHeight) {
      return MAP_INITIAL_SCALE;
    }
    return MAP_INITIAL_SCALE; // SSR時はデフォルト値
  });
  const [translate, setTranslate] = useState<[number, number]>(() => {
    // SSR時はデフォルト値
    if (propWidth && propHeight) {
      return [propWidth / 2, propHeight / 2 + 50];
    }
    return [MAP_DEFAULT_SIZE.width / 2, MAP_DEFAULT_SIZE.height / 2 + 50];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  // 地域選択機能（コメントアウト：将来的に必要になった場合に有効化可能）
  // const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const selectedRegion: RegionId | null = null; // 常にnull（全体表示のみ）
  const svgRef = useRef<SVGSVGElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // ピンチズーム用の状態（モバイル）
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(null);
  const [pinchStartScale, setPinchStartScale] = useState<number | null>(null);
  
  // ズームの最小/最大値
  const MIN_SCALE = useMemo(() => initialScale * 0.5, [initialScale]);
  const MAX_SCALE = useMemo(() => initialScale * 5, [initialScale]);

  // クライアント側での初期化（mounted後）
  useEffect(() => {
    if (!mounted) return;
    
    // クライアント側で正しいサイズを設定
    if (!propWidth || !propHeight) {
      const newDims = getResponsiveDimensions();
      setDimensions(newDims);
      setScale(newDims.scale);
      setTranslate(getInitialTranslate());
    }
  }, [mounted, propWidth, propHeight, getInitialTranslate]);

  // 画面リサイズ時の対応（debounce付き）
  useEffect(() => {
    if (!mounted) return;
    if (propWidth && propHeight) return; // プロパティで指定されている場合は変更しない
    
    const handleResize = () => {
      // 既存のタイマーをクリア
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // 150ms後に実行（debounce）
      resizeTimeoutRef.current = setTimeout(() => {
        const newDims = getResponsiveDimensions();
        setDimensions(newDims);
        setScale(newDims.scale);
        // モバイル時は少し上にシフト、デスクトップ時は下にシフト
        const newTranslate = window.innerWidth < 768
          ? [newDims.width / 2, newDims.height / 2 - 20] as [number, number]
          : [newDims.width / 2, newDims.height / 2 + 50] as [number, number];
        setTranslate(newTranslate);
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [propWidth, propHeight, mounted]);

  // GeoJSONデータの読み込み
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/data/japan-prefectures.json");
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status}`);
        }
        
        const data = await response.json() as FeatureCollection<Geometry, GeoJsonProperties>;
        
        // データの検証
        if (!data.type || !data.features || !Array.isArray(data.features)) {
          throw new Error("Invalid GeoJSON format");
        }
        
        setGeoData(data);
      } catch (err) {
        console.error("Error loading GeoJSON:", err);
        setError(err instanceof Error ? err.message : "Failed to load map data");
      } finally {
        setIsLoading(false);
      }
    };

    loadGeoData();
  }, []);

  // d3-geo投影法とパスジェネレーターの設定（動的に更新）
  const projection = useMemo(() => {
    // 地域選択機能（コメントアウト：将来的に必要になった場合に有効化可能）
    // const regions = getRegions();
    // const center = selectedRegion 
    //   ? regions.find(r => r.id === selectedRegion)?.center || JAPAN_CENTER
    //   : JAPAN_CENTER;
    
    return geoMercator()
      .center(JAPAN_CENTER) // 常に日本中心
      .scale(scale)
      .translate(translate);
  }, [scale, translate, width, height]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // 都道府県座標をSVG座標に変換（ピン用）
  const projectPoint = useMemo(() => {
    return (coordinates: [number, number]): [number, number] => {
      const projected = projection(coordinates);
      if (!projected || projected.length < 2) {
        return [0, 0];
      }
      return [projected[0] as number, projected[1] as number];
    };
  }, [projection]);


  // ドラッグ開始
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // 左クリックのみ
    setIsDragging(true);
    setDragStart([e.clientX, e.clientY]);
  };

  // ドラッグ中
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !dragStart) return;
    
    const dx = e.clientX - dragStart[0];
    const dy = e.clientY - dragStart[1];
    
    setTranslate([translate[0] + dx, translate[1] + dy]);
    setDragStart([e.clientX, e.clientY]);
  };

  // ドラッグ終了
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // マウスホイールでズーム（デスクトップ）
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1; // スクロールダウンで縮小、アップで拡大
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * delta));
    
    // マウス位置を中心にズーム
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const [lon, lat] = projection.invert?.([x, y]) || [0, 0];
      
      if (lon && lat) {
        const scaleRatio = newScale / scale;
        const newTranslate: [number, number] = [
          x - (x - translate[0]) * scaleRatio,
          y - (y - translate[1]) * scaleRatio,
        ];
        setTranslate(newTranslate);
      }
    }
    
    setScale(newScale);
  };

  // タッチ開始（ピンチズーム用）
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setPinchStartDistance(distance);
      setPinchStartScale(scale);
    } else if (e.touches.length === 1) {
      // シングルタッチはドラッグとして扱う
      setIsDragging(true);
      setDragStart([e.touches[0].clientX, e.touches[0].clientY]);
    }
  };

  // タッチ移動（ピンチズーム用）
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && pinchStartDistance !== null && pinchStartScale !== null) {
      // ピンチズーム
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleRatio = distance / pinchStartDistance;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartScale * scaleRatio));
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging && dragStart) {
      // ドラッグ
      const dx = e.touches[0].clientX - dragStart[0];
      const dy = e.touches[0].clientY - dragStart[1];
      
      setTranslate([translate[0] + dx, translate[1] + dy]);
      setDragStart([e.touches[0].clientX, e.touches[0].clientY]);
    }
  };

  // タッチ終了
  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart(null);
    setPinchStartDistance(null);
    setPinchStartScale(null);
  };

  // ズームイン（モバイル用、スライダーでは使用しない）
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(MAX_SCALE, scale * 1.2);
    setScale(newScale);
  }, [scale, MAX_SCALE]);

  // ズームアウト（モバイル用、スライダーでは使用しない）
  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(MIN_SCALE, scale * 0.8);
    setScale(newScale);
  }, [scale, MIN_SCALE]);

  // スライダー用のズーム値（0-100の範囲に変換）
  const zoomSliderValue = useMemo(() => {
    const range = MAX_SCALE - MIN_SCALE;
    return ((scale - MIN_SCALE) / range) * 100;
  }, [scale, MIN_SCALE, MAX_SCALE]);

  // スライダー変更時のハンドラー
  const handleZoomSliderChange = useCallback((values: number[]) => {
    const value = values[0];
    const range = MAX_SCALE - MIN_SCALE;
    const newScale = MIN_SCALE + (value / 100) * range;
    setScale(newScale);
  }, [MIN_SCALE, MAX_SCALE]);

  // リセット機能（全体表示に戻る）
  const handleReset = useCallback(() => {
    setScale(initialScale);
    // モバイル時は少し上にシフト、デスクトップ時は下にシフト
    const resetTranslate = mounted && typeof window !== "undefined" && window.innerWidth < 768
      ? [width / 2, height / 2 - 20] as [number, number]
      : [width / 2, height / 2 + 50] as [number, number];
    setTranslate(resetTranslate);
    // 地域選択機能（コメントアウト）
    // setSelectedRegion(null);
  }, [initialScale, width, height, mounted]);

  // 地域フォーカス機能（コメントアウト：将来的に必要になった場合に有効化可能）
  // const handleRegionFocus = useCallback((regionId: RegionId) => {
  //   const regions = getRegions();
  //   const region = regions.find((r) => r.id === regionId);
  //   if (!region) return;

  //   setSelectedRegion(regionId);

  //   const regionScale = getRegionScale(region, initialScale);

  //   // スムーズなアニメーションのために、投影法を計算してtranslateを設定
  //   const tempProjection = geoMercator()
  //     .center(region.center)
  //     .scale(regionScale)
  //     .translate([width / 2, height / 2]);

  //   // 地域の中心を画面中央に配置
  //   const [x, y] = tempProjection(region.center) || [width / 2, height / 2];
  //   const offsetX = width / 2 - x;
  //   const offsetY = height / 2 - y;

  //   setScale(regionScale);
  //   setTranslate([width / 2 + offsetX, height / 2 + offsetY]);
  // }, [initialScale, width, height]);

  // プロジェクトのピン表示判定とフィルタリング
  const visibleProjects = useMemo(() => {
    // 地域選択機能（コメントアウト：将来的に必要になった場合に有効化可能）
    // if (selectedRegion) {
    //   // 地域選択時：その地域のプロジェクトのみ（暫定的に座標から判断）
    //   const regions = getRegions();
    //   const region = regions.find((r) => r.id === selectedRegion);
    //   if (!region) return [];

    //   // 地域の中心座標から一定範囲内のプロジェクトを表示
    //   // 簡易実装：地域に応じたフィルタリング（後で改善可能）
    //   return projects.filter((project) => {
    //     // ステータスフィルタ
    //     if (selectedStatus && project.status !== selectedStatus) return false;

    //     // 地域フィルタ（座標から大まかに判断）
    //     const [lon, lat] = project.coordinates;
    //     const [regionLon, regionLat] = region.center;

    //     // 地域の中心から閾値以内（簡易実装）
    //     const lonDiff = Math.abs(lon - regionLon);
    //     const latDiff = Math.abs(lat - regionLat);
    //     return (
    //       lonDiff < REGION_FILTER_THRESHOLD &&
    //       latDiff < REGION_FILTER_THRESHOLD
    //     );
    //   });
    // }

    // 全体表示時：ステータスフィルタのみ
    if (selectedStatus) {
      return projects.filter((p) => p.status === selectedStatus);
    }

    return projects;
  }, [projects, selectedStatus]);

  const shouldShowPins = visibleProjects.length > 0;

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-muted-foreground">地図データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error || !geoData) {
    return (
      <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="mb-2">地図データの読み込みに失敗しました</p>
          <p className="text-sm text-gray-600 dark:text-muted-foreground">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* サイドバー式ズームスライダー（デスクトップのみ） */}
      <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <div className="bg-black/90 backdrop-blur-md border border-primary/20 rounded-lg p-4">
          <div className="flex flex-col items-center gap-4 h-64">
            <span className="text-xs text-primary/70 font-medium">ズーム</span>
            <Slider
              orientation="vertical"
              value={[zoomSliderValue]}
              onValueChange={handleZoomSliderChange}
              min={0}
              max={100}
              step={1}
              className="h-full"
            />
            <div className="flex flex-col items-center gap-1 text-xs text-primary/50">
              <span>{Math.round((zoomSliderValue / 100) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVGコンテナ - レスポンシブ対応 */}
      <div className="relative w-full h-full max-w-full" style={{ aspectRatio: `${width} / ${height}`, minHeight: '400px' }}>
        {/* 背景グリッドパターン */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(${MAP_STYLES.grid.color} 1px, transparent 1px),
            linear-gradient(90deg, ${MAP_STYLES.grid.color} 1px, transparent 1px)
          `,
            backgroundSize: `${MAP_STYLES.grid.size}px ${MAP_STYLES.grid.size}px`,
          }}
        />
      
      {/* 地図コンテナ */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="cyber-map"
          preserveAspectRatio="xMidYMid meet"
          style={{
            backgroundColor: "transparent",
            cursor: isDragging ? "grabbing" : "grab",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 日本列島の輪郭線（GeoJSONから生成） */}
          <g className="japan-outline">
            {geoData.features.map((feature, index) => {
              const pathData = pathGenerator(feature);
              if (!pathData) return null;

              return (
                <motion.path
                  key={`feature-${index}`}
                  d={pathData}
                  fill="transparent"
                  stroke={MAP_STYLES.stroke.color}
                  strokeWidth={MAP_STYLES.stroke.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: Math.min(index * 0.02, 0.5), // 最大0.5秒まで（47都道府県でも約1秒）
                  }}
                  style={{
                    filter: `drop-shadow(0 0 4px ${MAP_STYLES.glow.dropShadow})`,
                  }}
                  className="hover:stroke-[2px] transition-all duration-300"
                />
              );
            })}
          </g>

          {/* プロジェクトピン */}
          {visibleProjects.map((project, index) => {
            const [x, y] = projectPoint(project.coordinates);
            const pinColor = getStatusColorForPin(project.status);
            const rgb = getPinColorRGB(project.status);
            
            return (
              <motion.g
                key={project.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.02, 0.3), // 最大0.3秒まで
                }}
                onClick={() => onProjectClick?.(project)}
                style={{ cursor: 'pointer' }}
              >
                {/* メインピン */}
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill={pinColor}
                  style={{
                    filter: `drop-shadow(0 0 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8))`,
                  }}
                  className="hover:opacity-100 hover:r-[8] cursor-pointer transition-all duration-300"
                />
                
                {/* パルスアニメーション */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill="transparent"
                  stroke={pinColor}
                  strokeWidth={1.5}
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  style={{
                    filter: `drop-shadow(0 0 10px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7))`,
                  }}
                />
                
                {/* 外側のグローリング */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill="transparent"
                  stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`}
                  strokeWidth={0.5}
                  animate={{
                    scale: [1, 3, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: index * 0.15,
                  }}
                />
              </motion.g>
            );
          })}
        </svg>

        {/* 装飾的なグロー効果 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${MAP_STYLES.glow.radialGradient}, transparent 70%)`,
          }}
        />
      </motion.div>
      </div>

      {/* コントロールUI - 上部バー */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-black/90 backdrop-blur-md border-b border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* 左側: リセットボタンとピン表示インジケーター */}
              <div className="flex items-center gap-4">
                {/* リセットボタン */}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm rounded transition-all duration-300 bg-black/60 text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/20 flex items-center gap-2"
                  aria-label="全体表示に戻る"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">リセット</span>
                </button>
                
                {/* ピン表示中のインジケーター */}
                {shouldShowPins && (
                  <div className="flex items-center gap-2 text-primary text-xs">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span>{visibleProjects.length}件表示</span>
                  </div>
                )}
              </div>

              {/* 右側: ズームコントロール（デスクトップのみ） */}
              {/* ボタンは削除、サイドバー式スライダーに変更 */}
            </div>
          </div>
        </div>
      </div>

      {/* 地域選択バー（コメントアウト：将来的に必要になった場合に有効化可能） */}
      {/* <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-black/90 backdrop-blur-md border-b border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <div className="md:flex md:items-center md:gap-2 md:overflow-x-auto md:scrollbar-hide pb-1">
              <div className="grid grid-cols-5 gap-2 md:grid-cols-none md:flex md:flex-nowrap">
                <button
                  onClick={handleReset}
                  className={`px-4 py-2 text-sm rounded transition-all duration-300 whitespace-nowrap ${
                    selectedRegion === null
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-black/60 text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/20"
                  }`}
                  aria-label="全体表示に戻る"
                >
                  全体
                </button>
                
                {getRegions().map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionFocus(region.id)}
                    className={`px-4 py-2 text-sm rounded transition-all duration-300 whitespace-nowrap ${
                      selectedRegion === region.id
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-black/60 text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/20"
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
              
              {shouldShowPins && (
                <div className="flex-shrink-0 md:ml-auto flex items-center gap-2 text-primary text-xs mt-2 md:mt-0 col-span-5 md:col-span-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span>{visibleProjects.length}件表示</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
