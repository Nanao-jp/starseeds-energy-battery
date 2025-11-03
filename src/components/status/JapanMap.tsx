"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { geoPath, geoMercator } from "d3-geo";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { Project, ProjectStatus } from "@/data/types";
import { getRegions, getRegionScale, type RegionId } from "@/data/regions";
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
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // レスポンシブ対応: 画面サイズに応じた寸法とスケール
  const [dimensions, setDimensions] = useState(() => {
    if (propWidth && propHeight) {
      return { width: propWidth, height: propHeight, scale: MAP_INITIAL_SCALE };
    }
    return getResponsiveDimensions();
  });

  const { width, height } = dimensions;
  const initialScale = dimensions.scale;
  
  // モバイル時の初期translateを計算（北海道が見えるように少し上にシフト）
  const getInitialTranslate = (): [number, number] => {
    if (propWidth && propHeight) {
      return [propWidth / 2, propHeight / 2 + 50]; // デスクトップ: 下にシフト
    }
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // モバイル時: 少し上にシフト（北海道が見えるように）
      return [width / 2, height / 2 - 20];
    }
    // デスクトップ: 下にシフトして北海道の上部が見えるように
    return [width / 2, height / 2 + 50];
  };

  // ズーム・パンの状態管理
  const [scale, setScale] = useState(initialScale);
  const [translate, setTranslate] = useState<[number, number]>(getInitialTranslate());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 画面リサイズ時の対応
  useEffect(() => {
    if (propWidth && propHeight) return; // プロパティで指定されている場合は変更しない
    
    const handleResize = () => {
      const newDims = getResponsiveDimensions();
      setDimensions(newDims);
      setScale(newDims.scale);
      // モバイル時は少し上にシフト、デスクトップ時は下にシフト
      const newTranslate = window.innerWidth < 768
        ? [newDims.width / 2, newDims.height / 2 - 20] as [number, number]
        : [newDims.width / 2, newDims.height / 2 + 50] as [number, number];
      setTranslate(newTranslate);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [propWidth, propHeight]);

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
    const regions = getRegions();
    const center = selectedRegion 
      ? regions.find(r => r.id === selectedRegion)?.center || JAPAN_CENTER
      : JAPAN_CENTER;
    
    return geoMercator()
      .center(center)
      .scale(scale)
      .translate(translate);
  }, [scale, translate, selectedRegion]);

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

  // リセット機能（全体表示に戻る）
  const handleReset = () => {
    setScale(initialScale);
    // モバイル時は少し上にシフト、デスクトップ時は下にシフト
    const resetTranslate = typeof window !== "undefined" && window.innerWidth < 768
      ? [width / 2, height / 2 - 20] as [number, number]
      : [width / 2, height / 2 + 50] as [number, number];
    setTranslate(resetTranslate);
    setSelectedRegion(null);
  };

  // 地域フォーカス機能
  const handleRegionFocus = (regionId: RegionId) => {
    const regions = getRegions();
    const region = regions.find((r) => r.id === regionId);
    if (!region) return;

    setSelectedRegion(regionId);

    const regionScale = getRegionScale(region, initialScale);

    // スムーズなアニメーションのために、投影法を計算してtranslateを設定
    const tempProjection = geoMercator()
      .center(region.center)
      .scale(regionScale)
      .translate([width / 2, height / 2]);

    // 地域の中心を画面中央に配置
    const [x, y] = tempProjection(region.center) || [width / 2, height / 2];
    const offsetX = width / 2 - x;
    const offsetY = height / 2 - y;

    setScale(regionScale);
    setTranslate([width / 2 + offsetX, height / 2 + offsetY]);
  };

  // プロジェクトのピン表示判定とフィルタリング
  const visibleProjects = useMemo(() => {
    if (selectedRegion) {
      // 地域選択時：その地域のプロジェクトのみ（暫定的に座標から判断）
      const regions = getRegions();
      const region = regions.find((r) => r.id === selectedRegion);
      if (!region) return [];

      // 地域の中心座標から一定範囲内のプロジェクトを表示
      // 簡易実装：地域に応じたフィルタリング（後で改善可能）
      return projects.filter((project) => {
        // ステータスフィルタ
        if (selectedStatus && project.status !== selectedStatus) return false;

        // 地域フィルタ（座標から大まかに判断）
        const [lon, lat] = project.coordinates;
        const [regionLon, regionLat] = region.center;

        // 地域の中心から閾値以内（簡易実装）
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
                    duration: 1,
                    ease: "easeInOut",
                    delay: index * 0.05,
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
                  delay: index * 0.05,
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
            {/* 地域選択バー */}
            {/* モバイル: 5列グリッド（2行）、デスクトップ: 横スクロール */}
            <div className="md:flex md:items-center md:gap-2 md:overflow-x-auto md:scrollbar-hide pb-1">
              <div className="grid grid-cols-5 gap-2 md:grid-cols-none md:flex md:flex-nowrap">
                {/* 全体表示ボタン */}
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
                
                {/* 地域ボタン */}
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
              
              {/* ピン表示中のインジケーター */}
              {shouldShowPins && (
                <div className="flex-shrink-0 md:ml-auto flex items-center gap-2 text-primary text-xs mt-2 md:mt-0 col-span-5 md:col-span-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span>{visibleProjects.length}件表示</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
