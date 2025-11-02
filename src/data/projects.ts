import type { Project } from './types';

export const projects: Project[] = [
  {
    id: "hokkaido-20mw",
    name: "北海道◯◯BESS",
    region: "北海道◯◯町",
    coordinates: [141.35, 43.06],
    capacityMW: 20,
    energyMWh: 40,
    status: "operational",
    startDate: "2025-04-01",
    description: "北海道での系統安定化と市場運用。",
    photos: ["/images/projects/sample1.webp"]
  },
  {
    id: "chiba-10mw",
    name: "千葉◯◯BESS",
    region: "千葉県◯◯市",
    coordinates: [140.12, 35.61],
    capacityMW: 10,
    energyMWh: 20,
    status: "construction",
    plannedDate: "2026-02-01",
    description: "首都圏需給調整市場向け建設案件。",
    photos: ["/images/projects/sample2.jpg"]
  },
  {
    id: "fukuoka-40mw",
    name: "福岡◯◯BESS",
    region: "福岡県◯◯市",
    coordinates: [130.42, 33.59],
    capacityMW: 40,
    energyMWh: 80,
    status: "planning",
    plannedDate: "2027-10-01",
    description: "九州エリアの再生可能エネルギー導入拡大に向けた計画案件。",
    photos: ["/images/projects/sample3.jpg"]
  },
  {
    id: "tokyo-30mw",
    name: "東京◯◯BESS",
    region: "東京都◯◯区",
    coordinates: [139.69, 35.69],
    capacityMW: 30,
    energyMWh: 60,
    status: "operational",
    startDate: "2024-12-01",
    description: "首都圏の電力需給バランス調整を担う大規模蓄電池システム。",
    photos: ["/images/projects/sample1.webp"]
  },
  {
    id: "osaka-25mw",
    name: "大阪◯◯BESS",
    region: "大阪府◯◯市",
    coordinates: [135.50, 34.69],
    capacityMW: 25,
    energyMWh: 50,
    status: "construction",
    plannedDate: "2026-06-01",
    description: "関西エリアの電力安定供給を支援する蓄電池プロジェクト。",
    photos: ["/images/projects/sample2.jpg"]
  },
  {
    id: "aichi-35mw",
    name: "愛知◯◯BESS",
    region: "愛知県◯◯市",
    coordinates: [136.91, 35.18],
    capacityMW: 35,
    energyMWh: 70,
    status: "operational",
    startDate: "2024-08-15",
    description: "中部エリアの産業需要に対応した大容量蓄電池システム。",
    photos: ["/images/projects/sample3.jpg"]
  },
  {
    id: "saitama-15mw",
    name: "埼玉◯◯BESS",
    region: "埼玉県◯◯市",
    coordinates: [139.65, 35.86],
    capacityMW: 15,
    energyMWh: 30,
    status: "construction",
    plannedDate: "2026-03-01",
    description: "首都圏の電力ピークシフトに貢献する中規模蓄電池。",
    photos: ["/images/projects/sample1.webp"]
  },
  {
    id: "kanagawa-20mw",
    name: "神奈川◯◯BESS",
    region: "神奈川県◯◯市",
    coordinates: [139.64, 35.45],
    capacityMW: 20,
    energyMWh: 40,
    status: "planning",
    plannedDate: "2027-04-01",
    description: "横浜エリアの電力インフラ強化を目的とした計画案件。",
    photos: ["/images/projects/sample2.jpg"]
  },
  {
    id: "miyagi-18mw",
    name: "宮城◯◯BESS",
    region: "宮城県◯◯市",
    coordinates: [140.87, 38.27],
    capacityMW: 18,
    energyMWh: 36,
    status: "operational",
    startDate: "2024-11-01",
    description: "東北エリアの電力系統安定化を担う蓄電池システム。",
    photos: ["/images/projects/sample3.jpg"]
  },
  {
    id: "hiroshima-22mw",
    name: "広島◯◯BESS",
    region: "広島県◯◯市",
    coordinates: [132.46, 34.40],
    capacityMW: 22,
    energyMWh: 44,
    status: "construction",
    plannedDate: "2026-08-01",
    description: "中国エリアの再生可能エネルギー導入拡大を支援するプロジェクト。",
    photos: ["/images/projects/sample1.webp"]
  },
];
