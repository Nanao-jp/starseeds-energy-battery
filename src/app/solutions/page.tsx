// ソリューションページを一時的に非表示
// 戻す場合は下記のコメントアウトを外してください

// 一時的に空のページを返す（404を避けるため）
export default function SolutionsPage() {
  return null;
}

/*
元のコードは以下の通りです（コメントアウト内のJSXコメントは通常のコメントに変換済み）：

import { Handshake, Target, BarChart3, Recycle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader, Section, SectionTitle } from '@/components/layout/PageLayout';

const services = [
  {
    icon: <Handshake className="h-10 w-10 text-green-600" />,
    title: "BESS販売・導入支援",
    description: "お客様のニーズに合わせた最適な蓄電システムをご提案。設計から設置、系統連系の手続きまでワンストップでサポートします。",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-green-600" />,
    title: "市場運用・最適化",
    description: "自社開発のEMS（エネルギーマネジメントシステム）を活用し、電力市場での取引を自動化。収益の最大化を図ります。",
  },
  {
    icon: <Target className="h-10 w-10 text-green-600" />,
    title: "O&M（運用・保守）",
    description: "24時間365日の遠隔監視体制と、迅速な現地対応で、システムの安定稼働を長期的に保証します。",
  },
];

export default function SolutionsPage() {
  return (
    <div>
      <PageHeader title="事業紹介" subtitle="系統用蓄電が拓く、エネルギーの新たな可能性" />

      <Section className="border-t border-white/20">
        <SectionTitle>系統用蓄電池の役割</SectionTitle>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image 
              src="/images/solutions-role.webp" 
              alt="系統用蓄電池の役割" 
              width={600} 
              height={400}
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">未来の電力網を支えるキーテクノロジー</h3>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
              太陽光や風力といった再生可能エネルギーは、天候によって発電量が変動します。系統用蓄電池は、発電しすぎた電力を貯蔵し、不足時に供給することで、電力の需要と供給のバランスを保ちます。これにより、再生可能エネルギーの導入を拡大し、安定的でクリーンな電力網の実現に貢献します。
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-white/20">
        <SectionTitle>提供サービス</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-white/20">
        <SectionTitle>収益モデル概要</SectionTitle>
        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">アービトラージ（価格差益取引）</h3>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed mb-4">
                電力市場では、需要と供給のバランスによって価格が常に変動しています。私たちは、電力が安い時間帯に蓄電池を充電し、高い時間帯に放電することで、その価格差から収益を得ます。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-muted-foreground">
                <li><span className="font-bold">充電：</span>電力価格が安い深夜などに電力を購入・充電。</li>
                <li><span className="font-bold">放電：</span>電力需要が高まる夕方などに電力を売却・放電。</li>
              </ul>
            </div>
            <div>
              <Image 
                src="/images/solutions-arbitrage.svg" 
                alt="アービトラージモデルの図解" 
                width={500} 
                height={300} 
                className="mx-auto"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <h3 className="text-2xl font-bold mb-4">需給調整市場・容量市場への参加</h3>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed mb-4">
                蓄電池の高速な充放電能力を活かし、電力の安定供給を目的とした「需給調整市場」や「容量市場」に参加します。これにより、電力インフラへの貢献と引き換えに、安定した収益を確保します。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-muted-foreground">
                <li><span className="font-bold">需給調整市場：</span>周波数の乱れに応動し、系統を安定化させる。</li>
                <li><span className="font-bold">容量市場：</span>将来の電力供給力（kW）を確保し、対価を得る。</li>
              </ul>
            </div>
            <div className="md:order-1">
              <Image 
                src="/images/solutions-market.svg" 
                alt="市場参加モデルの図解" 
                width={500} 
                height={300} 
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-green-700 text-white border-t border-white/20">
        <div className="text-center max-w-3xl mx-auto">
          <Recycle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">脱炭素社会とSDGsへの貢献</h2>
          <p className="mt-4 leading-relaxed">
            系統用蓄電池は、再生可能エネルギーの普及を加速させ、CO2排出量の大幅な削減に貢献します。私たちは、事業活動を通じて、持続可能な開発目標（SDGs）の達成、特に目標7「エネルギーをみんなに そしてクリーンに」と目標13「気候変動に具体的な対策を」の実現を目指しています。
          </p>
          <div className="mt-8">
            <Link href="/contact" className="inline-block bg-white text-green-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">
              事業に関するお問い合わせ
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
*/
