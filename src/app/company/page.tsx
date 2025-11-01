import Image from 'next/image';
import React from 'react';
import { PageHeader, Section, SectionTitle } from '@/components/layout/PageLayout';

const overviewData = [
  { label: '会社名', value: 'スターシーズ株式会社' },
  { label: '事業部名', value: 'エネルギーソリューション事業部（蓄電池事業担当）' },
  { label: '設立', value: '2024年4月1日' },
  { label: '代表者', value: '代表取締役 蓄電 太郎' },
  { label: '資本金', value: '1億円' },
  { label: '事業内容', value: '系統用蓄電システムの開発、販売、運用、保守' },
  { label: '所在地', value: '〒100-0005 東京都千代田区丸の内1-1-1' },
];

const historyData = [
  { year: '2024.04', event: 'スターシーズ株式会社 設立' },
  { year: '2024.10', event: '千葉県にて初の蓄電所（10MWh）建設開始' },
  { year: '2025.04', event: '北海道にて2拠点目（40MWh）の系統連系、運転開始' },
  { year: '2025.12', event: '第三者割当増資を実施、資本金3億円に' },
];

export default function CompanyPage() {
  return (
    <div>
      <PageHeader title="会社情報" subtitle="私たちのビジョンと歩み" />

      <Section id="overview" className="border-t border-white/20">
        <SectionTitle>会社概要</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {overviewData.map(item => (
              <React.Fragment key={item.label}>
                <dt className="font-bold md:col-span-1">{item.label}</dt>
                <dd className="md:col-span-2">{item.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </Section>
      
      <Section id="history" className="border-t border-white/20">
        <SectionTitle>沿革</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <dl>
            {historyData.map(item => (
              <div key={item.year} className="grid grid-cols-3 gap-4 border-b py-4">
                <dt className="font-bold">{item.year}</dt>
                <dd className="col-span-2">{item.event}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="message" className="border-t border-white/20">
        <SectionTitle>代表メッセージ</SectionTitle>
        <div className="grid md:grid-cols-3 gap-12 items-center max-w-5xl mx-auto">
          <div className="md:col-span-1">
            <div className="rounded-lg p-8 flex items-center justify-center aspect-square">
              <Image
                src="/images/logo.png"
                alt="Starseeds energy Battery Logo"
                width={240}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">エネルギーの未来を、共に創る。</h3>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed space-y-4">
              <span>
                脱炭素化という世界的な潮流の中、電力システムのあり方は大きな変革の時を迎えています。再生可能エネルギーの導入拡大は急務ですが、その不安定さを克服しなければ、真に持続可能なエネルギー社会は実現できません。
              </span>
              <span>
                私たちスターシーズ株式会社は、その鍵となる「系統用蓄電池」のプロフェッショナル集団です。最先端のテクノロジーと独自の運用ノウハウを駆使し、電力の安定供給と価値最大化を実現します。
              </span>
              <span>
                クリーンなエネルギーが、いつでも、どこでも、当たり前に使える社会へ。私たちは、蓄電技術を通じて、エネルギーの未来を皆様と共に創り上げてまいります。
              </span>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
