import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Siren, Thermometer, Zap } from 'lucide-react';
import { PageHeader, Section, SectionTitle } from '@/components/layout/PageLayout';

const productLineup = [
  { model: 'GB-2000', energyMWh: 2, powerMW: 1, footprint: '20ftコンテナ', cycleLife: '12,000回', efficiency: '95%' },
  { model: 'GB-10000', energyMWh: 10, powerMW: 5, footprint: '40ftコンテナ', cycleLife: '12,000回', efficiency: '95%' },
  { model: 'GB-40000', energyMWh: 40, powerMW: 10, footprint: '専用建屋', cycleLife: '12,000回', efficiency: '95%' },
];

const safetyFeatures = [
  {
    icon: <Siren className="h-8 w-8 text-green-600" />,
    title: "先進的な消火システム",
    description: "熱暴走の兆候を早期に検知し、瞬時に作動するガス系消火設備を標準搭載。延焼を未然に防ぎます。",
  },
  {
    icon: <Zap className="h-8 w-8 text-green-600" />,
    title: "多重絶縁監視",
    description: "バッテリーモジュール、ラック、コンテナの各レベルで絶縁状態を常時監視。地絡や短絡のリスクを最小限に抑えます。",
  },
  {
    icon: <Thermometer className="h-8 w-8 text-green-600" />,
    title: "高度な空調・冷却",
    description: "最適な温度管理を行うための高度な空調システムを搭載。バッテリーの性能を最大限に引き出し、長寿命化を実現します。",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
    title: "各種安全認証の取得",
    description: "UL9540Aなどの国際的な安全規格に準拠した設計。第三者機関による認証を取得し、客観的な安全性を確保しています。",
  },
];

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="製品・技術" subtitle="最先端のテクノロジーで、エネルギーの未来を創造する" />

      <Section className="border-t border-white/20">
        <SectionTitle>コンテナ型BESSラインナップ</SectionTitle>
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">モジュール設計による高い拡張性</h3>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
              当社のコンテナ型BESS（Battery Energy Storage System）は、標準化されたモジュールを組み合わせることで、お客様のニーズに合わせた容量と出力を柔軟に構成できます。小規模なものから大規模なプロジェクトまで、最適なソリューションを提供します。
            </p>
          </div>
          <div>
            <Image 
              src="/images/products-bess.jpg" 
              alt="コンテナ型BESS" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>モデル</TableHead>
              <TableHead>エネルギー容量 (MWh)</TableHead>
              <TableHead>最大出力 (MW)</TableHead>
              <TableHead>設置面積</TableHead>
              <TableHead>サイクル寿命</TableHead>
              <TableHead>往復効率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productLineup.map((product) => (
              <TableRow key={product.model}>
                <TableCell className="font-medium">{product.model}</TableCell>
                <TableCell>{product.energyMWh}</TableCell>
                <TableCell>{product.powerMW}</TableCell>
                <TableCell>{product.footprint}</TableCell>
                <TableCell>{product.cycleLife}</TableCell>
                <TableCell>{product.efficiency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
      
      <Section className="border-t border-white/20">
        <SectionTitle>最高水準の安全性</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safetyFeatures.map((feature) => (
            <div key={feature.title} className="p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-white/20">
        <SectionTitle>統合制御システム (EMS / BMS)</SectionTitle>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image 
              src="/images/products-ui-mockup.png" 
              alt="EMS/BMS UI モックアップ" 
              width={600} 
              height={450} 
              className="rounded-lg shadow-xl border"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">インテリジェントな運用と監視</h3>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed mb-4">
              自社開発の統合制御システムが、BESSの頭脳として機能します。
            </p>
            <ul className="space-y-4">
              <li>
                <h4 className="font-bold text-lg">EMS (エネルギーマネジメントシステム)</h4>
                <p className="text-gray-600 dark:text-muted-foreground">
                  電力市場の価格や天候予測データを基に、最適な充放電スケジュールを自動で作成・実行し、収益を最大化します。
                </p>
              </li>
              <li>
                <h4 className="font-bold text-lg">BMS (バッテリーマネジメントシステム)</h4>
                <p className="text-gray-600 dark:text-muted-foreground">
                  個々のバッテリーセルの状態（電圧、温度、電流）をリアルタイムで監視し、劣化を抑制。システムの長寿命化と安全な運用を実現します。
                </p>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
