import { BatteryCharging, ShieldCheck, Radio } from "lucide-react";
import type { KpiData } from "./types";

/**
 * KPIセクション用のデータ
 */
export const KPI_DATA: KpiData[] = [
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

