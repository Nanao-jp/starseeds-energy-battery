"use client";

import { KpiCard } from "./KpiCard";
import { KPI_DATA } from "@/data/kpi";
import { SectionContainer } from "@/components/layout/SectionContainer";

/**
 * KPIセクションコンポーネント
 * 
 * 特徴:
 * - 近未来的なデザインのKPIカードを表示
 * - スムーズなアニメーション
 * - レスポンシブ対応
 */
export function KpiSection() {
  return (
    <section className="kpi-section" aria-label="主要なKPI指標">
      <SectionContainer py="lg" withDivider dividerClassName="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {KPI_DATA.map((item, index) => (
            <KpiCard
              key={`${item.label}-${index}`}
              {...item}
              index={index}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
