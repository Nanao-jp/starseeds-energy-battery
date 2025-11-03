import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/home/HeroSection';

// 非クリティカルコンポーネントの遅延読み込み
const KpiSection = dynamic(() => import('@/components/home/KpiSection').then(mod => ({ default: mod.KpiSection })), {
  ssr: true,
});

const StrengthsSection = dynamic(() => import('@/components/home/StrengthsSection').then(mod => ({ default: mod.StrengthsSection })), {
  ssr: true,
});

const NavigationCardsSection = dynamic(() => import('@/components/home/NavigationCardsSection').then(mod => ({ default: mod.NavigationCardsSection })), {
  ssr: true,
});

export default function HomePage() {
  return (
    <div className="space-y-24 mb-24 overflow-x-clip">
      <HeroSection />

      <KpiSection />

      <StrengthsSection />

      <NavigationCardsSection />
    </div>
  );
}
