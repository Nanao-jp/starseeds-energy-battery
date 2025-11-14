import React from 'react';
import { PageHeader, Section, SectionTitle } from '@/components/layout/PageLayout';

const overviewData = [
  { label: '社名', value: 'スターシーズ株式会社  Star seeds Co., LTD.' },
  { label: '住所', value: '〒105-0004 東京都港区新橋四丁目21番3号 新橋東急ビル8階' },
  { label: 'URL', value: 'https://starseeds.co.jp/' },
  { label: '適格請求書発行事業者登録番号', value: 'T6010001072528' },
  { label: '設立', value: '1989年3月1日' },
  { label: '資本金', value: '4億8536万円' },
  { label: '代表者', value: '代表取締役会長 泉 信彦\n代表取締役社長 鈴木 雅順' },
  { label: '従業員数', value: '（2025年02月28日現在）\n101名' },
  { label: '大株主', value: '（2025年02月28日現在）\n株式会社Blue lagoon、他' },
  { label: '主要取引銀行', value: 'りそな銀行、三井住友銀行' },
  { label: '会社監査法人', value: '監査法人やまぶき' },
  { label: '営業実績', value: '決算期 売上\n2023年2月期 63億5百万円（連結）\n2024年2月期 55億30百万円（連結）\n2025年2月期 51億10百万円（連結）' },
  { label: '主要仕入先', value: '（株）TSIホールディングス、（株）三高、（株）サンマリノ、美濃屋（株' },
  { label: '役員', value: '（2025年5月23日現在）\n代表取締役会長 泉 信彦\n代表取締役社長 鈴木 雅順\n取締役 三井 剛\n取締役（社外）迫田 さやか\n取締役（社外）水田 崇史\n監査役 髙橋 博一\n監査役（社外）山川 貴嗣\n監査役（社外）滝川 好夫' },
  { label: '古物商許可', value: '東京都公安委員会 第301082516891号' },
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
                <dd className="md:col-span-2 whitespace-pre-line">{item.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </Section>
    </div>
  );
}
