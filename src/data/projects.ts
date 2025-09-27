import type { Project } from './types';

export const projects: Project[] = [
  {
    id: "hokkaido-20mw",
    name: "北海道◯◯BESS",
    region: "北海道◯◯町",
    capacityMW: 20,
    energyMWh: 40,
    status: "operational",
    startDate: "2025-04-01",
    description: "北海道での系統安定化と市場運用。",
    photos: ["/images/projects/sample1.jpg"]
  },
  {
    id: "chiba-10mw",
    name: "千葉◯◯BESS",
    region: "千葉県◯◯市",
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
    capacityMW: 40,
    energyMWh: 80,
    status: "planning",
    plannedDate: "2027-10-01",
    description: "九州エリアの再生可能エネルギー導入拡大に向けた計画案件。",
    photos: ["/images/projects/sample3.jpg"]
  }
];
