import type { FeatureCardData } from './types';

/**
 * Strengths Section（強みセクション）のデータ
 */
export const STRENGTHS_DATA: FeatureCardData[] = [
  {
    imageSrc: "/images/photo/photo-04.webp",
    imageAlt: "再生可能エネルギーと蓄電池",
    title: "未来の電力貯蔵",
    description: "天候に左右される太陽光や風力発電の不安定な電力を大規模蓄電池に貯蔵。クリーンなエネルギーを安定的にお届けし、脱炭素社会の実現に貢献します。",
    iconName: "zap",
  },
  {
    imageSrc: "/images/photo/5068978.webp",
    imageAlt: "エネルギー最適配置ネットワーク",
    title: "エネルギーを最適配置",
    description: "分散型システムで全国各地にネットワークを構築。地域の特性や需要に応じて、最適な場所に蓄電池を配置し、効率的なエネルギーの流通を実現します。全国規模の最適配置により、より安定した電力供給を実現します。",
    iconName: "radio",
    reverse: true,
  },
];

