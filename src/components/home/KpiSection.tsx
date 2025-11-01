"use client";

import { motion } from "framer-motion";
import { BatteryCharging, ShieldCheck, Radio } from "lucide-react";
import { KpiCard } from "./KpiCard";
import type { KpiData } from "@/data/types";

/**
 * KPIセクション用のデータ
 */
const kpiData: KpiData[] = [
  {
    icon: BatteryCharging,
    value: "Peak Capacity",
    label: "総貯蔵容量",
    description: "大規模なエネルギーを安全に蓄え、需要に応じて供給",
  },
  {
    icon: ShieldCheck,
    value: "Grid Stability",
    label: "系統安定性",
    description: "高度な制御システムにより電力網を安定稼働",
  },
  {
    icon: Radio,
    value: "Nationwide Network",
    label: "展開エリア",
    description: "分散型システムで全国各地にネットワークを構築",
  },
];

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="section-divider mb-20" aria-hidden="true" />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {kpiData.map((item, index) => (
            <KpiCard
              key={`${item.label}-${index}`}
              {...item}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
