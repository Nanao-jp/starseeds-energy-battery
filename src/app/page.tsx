import Image from 'next/image';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/home/HeroSection';

// 非クリティカルコンポーネントの遅延読み込み
const KpiSection = dynamic(() => import('@/components/home/KpiSection').then(mod => ({ default: mod.KpiSection })), {
  ssr: true,
});

const NavigationCard = dynamic(() => import('@/components/home/NavigationCard').then(mod => ({ default: mod.NavigationCard })), {
  ssr: true,
});


const navigationCards = [
  {
    href: '/solutions',
    title: '事業紹介',
    description: '系統用蓄電の役割から、私たちのサービスと収益モデルについてご紹介します。',
    imgSrc: '/images/nav-solutions.webp',
  },
  {
    href: '/products',
    title: '製品・技術',
    description: 'コンテナ型BESSのラインナップ、最先端のEMS/BMS、そして安全性への取り組みについて。',
    imgSrc: '/images/nav-products.webp',
  },
  {
    href: '/status',
    title: '実績・工事状況',
    description: '現在稼働中、建設中、そして計画中のプロジェクト一覧をご覧いただけます。',
    imgSrc: '/images/nav-status.webp',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-24 mb-24">
      <HeroSection />

      <KpiSection />

      {/* Strengths Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16 border-t border-white/20">
        {/* Strength 1: Grid Stabilization */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <Image
              src="/images/strength-renewable.webp"
              alt="再生可能エネルギーと蓄電池"
              width={600}
              height={450}
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="rounded-lg shadow-xl dark:opacity-85 transition-opacity group-hover:dark:opacity-95 dark:border dark:border-primary/20"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="p-6 dark:backdrop-blur-sm dark:rounded-xl dark:border dark:border-primary/20">
            <h2 className="text-3xl font-bold tracking-tight mb-4 font-heading dark:text-foreground">再生可能エネルギーを、<br/>安定した主力電源へ。</h2>
            <p className="text-muted-foreground leading-relaxed">
              天候に左右される太陽光や風力発電の不安定な電力を大規模蓄電池に貯蔵。クリーンなエネルギーを安定的にお届けし、脱炭素社会の実現に貢献します。
            </p>
          </div>
        </div>

        {/* Strength 2: Revenue Maximization */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2 relative group">
            <Image
              src="/images/strength-market.webp"
              alt="電力市場での取引イメージ"
              width={600}
              height={450}
              loading="lazy"
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="rounded-lg shadow-xl dark:opacity-85 transition-opacity group-hover:dark:opacity-95 dark:border dark:border-primary/20"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="md:order-1 p-6 dark:bg-card/40 dark:backdrop-blur-sm dark:rounded-xl dark:border dark:border-primary/20">
            <h2 className="text-3xl font-bold tracking-tight mb-4 font-heading dark:text-foreground">独自のEMSが、<br/>電力取引を最適化し収益を最大化。</h2>
            <p className="text-muted-foreground leading-relaxed">
              自社開発のエネルギーマネジメントシステム（EMS）が、電力市場の価格変動や気象データをリアルタイムに分析。AIが最適な充放電を判断し、お客様の収益を最大化します。
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-heading dark:text-foreground">さらに詳しく</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            私たちの取り組みや技術について、より深く知る
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card, index) => (
            <NavigationCard
              key={card.href}
              href={card.href}
              title={card.title}
              description={card.description}
              imgSrc={card.imgSrc}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
