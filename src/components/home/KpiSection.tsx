"use client";

import { motion } from "framer-motion";
import { KpiCard } from "./KpiCard";
import { KPI_DATA } from "@/data/kpi";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { ANIMATION, VIEWPORT } from "@/lib/animation";

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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT.once}
          transition={ANIMATION.normal}
        >
          {KPI_DATA.map((item, index) => (
            <KpiCard
              key={`${item.label}-${index}`}
              {...item}
              index={index}
            />
          ))}
        </motion.div>
      </SectionContainer>
    </section>
  );
}
