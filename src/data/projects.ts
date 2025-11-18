import type { Project } from './types';

export const projects: Project[] = [
  // 工事中
  {
    id: "toyohashi-bess",
    name: "豊橋蓄電所",
    region: "愛知県豊橋市",
    coordinates: [137.3917, 34.7692], // [経度, 緯度]
    capacityMW: 0,
    energyMWh: 0,
    status: "construction",
    plannedDate: "2026年2月",
    description: "",
    photos: [],
    purchaseFrom: "株式会社サンヴィレッジ",
    powerArea: "中部電力",
    lotNumber: "250-3・250-5",
    landCategory: "宅地",
    type: "販売"
  },
  {
    id: "komaki-bess",
    name: "小牧蓄電所",
    region: "愛知県小牧市",
    coordinates: [136.9116, 35.2903], // [経度, 緯度]
    capacityMW: 0,
    energyMWh: 0,
    status: "construction",
    plannedDate: "2026年8月",
    description: "",
    photos: [],
    purchaseFrom: "株式会社サンヴィレッジ",
    powerArea: "中部電力",
    lotNumber: "1741-1・1743・1745",
    landCategory: "宅地",
    type: "販売"
  },
  {
    id: "tahara-bess",
    name: "田原蓄電所",
    region: "愛知県田原市",
    coordinates: [137.2644, 34.6686], // [経度, 緯度]
    capacityMW: 0,
    energyMWh: 0,
    status: "construction",
    plannedDate: "2026年3月",
    description: "",
    photos: [],
    purchaseFrom: "株式会社サンヴィレッジ",
    powerArea: "中部電力",
    lotNumber: "362-1・362-2",
    landCategory: "宅地",
    type: "販売"
  },
  {
    id: "oita-bess",
    name: "大分蓄電所",
    region: "大分県杵築市",
    coordinates: [131.6186, 33.4184], // [経度, 緯度]
    capacityMW: 0,
    energyMWh: 0,
    status: "construction",
    plannedDate: "2026年6月",
    description: "",
    photos: [],
    purchaseFrom: "株式会社モリタ電器",
    powerArea: "九州電力",
    lotNumber: "2726-1 他4筆",
    landCategory: "雑種地",
    type: "運用"
  },
  // 運用中
  {
    id: "k527",
    name: "K527",
    region: "和歌山県紀の川市",
    coordinates: [135.3158, 34.2306], // [経度, 緯度]
    capacityMW: 0,
    energyMWh: 0,
    status: "operational",
    startDate: "2025-11-07",
    description: "",
    photos: [],
    purchaseFrom: "日本エネルギー総合システム株式会社",
    powerArea: "関西電力",
    lotNumber: "400-1・400-2",
    landCategory: "田",
    type: "運用"
  },
  {
    id: "k538",
    name: "K538",
    region: "和歌山県紀の川市",
    coordinates: [135.3200, 34.2350], // [経度, 緯度] 上田井字尾崎谷付近
    capacityMW: 0,
    energyMWh: 0,
    status: "operational",
    startDate: "2025-10-30",
    description: "",
    photos: [],
    purchaseFrom: "日本エネルギー総合システム株式会社",
    powerArea: "関西電力",
    lotNumber: "423-1・424-1・425-1",
    landCategory: "田・畑",
    type: "運用"
  },
];
