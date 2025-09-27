import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { KpiSection } from '@/components/home/KpiSection';
import { HeroSection } from '@/components/home/HeroSection';


const navigationCards = [
  {
    href: '/solutions',
    title: '事業紹介',
    description: '系統用蓄電の役割から、私たちのサービスと収益モデルについてご紹介します。',
    imgSrc: '/images/nav-solutions.jpg',
  },
  {
    href: '/products',
    title: '製品・技術',
    description: 'コンテナ型BESSのラインナップ、最先端のEMS/BMS、そして安全性への取り組みについて。',
    imgSrc: '/images/nav-products.jpg',
  },
  {
    href: '/status',
    title: '実績・工事状況',
    description: '現在稼働中、建設中、そして計画中のプロジェクト一覧をご覧いただけます。',
    imgSrc: '/images/nav-status.jpg',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-24 mb-24">
      <HeroSection />

      <KpiSection />

      {/* Strengths Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Strength 1: Grid Stabilization */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/images/strength-renewable.jpg"
              alt="再生可能エネルギーと蓄電池"
              width={600}
              height={450}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">再生可能エネルギーを、<br/>安定した主力電源へ。</h2>
            <p className="text-gray-600 leading-relaxed">
              天候に左右される太陽光や風力発電の不安定な電力を大規模蓄電池に貯蔵。クリーンなエネルギーを安定的にお届けし、脱炭素社会の実現に貢献します。
            </p>
          </div>
        </div>

        {/* Strength 2: Revenue Maximization */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2">
            <Image
              src="/images/strength-market.jpg"
              alt="電力市場での取引イメージ"
              width={600}
              height={450}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="md:order-1">
            <h2 className="text-3xl font-bold tracking-tight mb-4">独自のEMSが、<br/>電力取引を最適化し収益を最大化。</h2>
            <p className="text-gray-600 leading-relaxed">
              自社開発のエネルギーマネジメントシステム（EMS）が、電力市場の価格変動や気象データをリアルタイムに分析。AIが最適な充放電を判断し、お客様の収益を最大化します。
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">さらに詳しく</h2>
          <p className="mt-2 text-lg text-gray-600">
            私たちの取り組みや技術について、より深く知る
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card) => (
            <Card key={card.href} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={card.imgSrc} alt={card.title} layout="fill" objectFit="cover" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle>{card.title}</CardTitle>
                <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={card.href} className="flex items-center font-semibold text-green-600 hover:text-green-700">
                  詳しく見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
