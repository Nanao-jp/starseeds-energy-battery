/**
 * チャットボット用の知識ベースデータ
 * 製品・工事に関する情報を構造化して管理
 */

export interface KnowledgeItem {
  category: "product" | "construction" | "faq" | "company";
  title: string;
  content: string;
  keywords: string[];
}

export const chatbotKnowledge: KnowledgeItem[] = [
  // 製品情報
  {
    category: "product",
    title: "BESS（蓄電池システム）の特徴",
    content: "当社のBESS（Battery Energy Storage System）は、コンテナ型の大規模蓄電池システムです。定格出力は10MW〜40MW、蓄電容量は20MWh〜80MWhの範囲で対応可能です。安全性、信頼性、環境性能に優れ、電力系統の安定化と再生可能エネルギーの導入拡大に貢献します。",
    keywords: ["BESS", "蓄電池", "システム", "コンテナ", "出力", "容量", "仕様"]
  },
  {
    category: "product",
    title: "安全性への取り組み",
    content: "当社のBESSは、リチウムイオン電池を使用していますが、多重の安全対策を実装しています。電池管理システム（BMS）による24時間監視、火災検知システム、自動消火装置、断熱構造など、万全の安全対策を講じています。",
    keywords: ["安全性", "安全対策", "BMS", "火災", "リチウムイオン", "監視"]
  },
  {
    category: "product",
    title: "EMS/BMS（エネルギー管理システム/電池管理システム）",
    content: "EMS（Energy Management System）とBMS（Battery Management System）により、蓄電池の最適な運用を実現します。EMSは電力市場への参加や需給調整を自動化し、BMSは各電池セルの状態を監視・制御します。直感的なUIで運用状況を確認できます。",
    keywords: ["EMS", "BMS", "エネルギー管理", "電池管理", "UI", "運用"]
  },
  
  // 工事情報
  {
    category: "construction",
    title: "工事の流れ",
    content: "BESSの建設プロセスは以下の通りです：1) サイト調査・設計（1-2ヶ月）、2) 許認可取得（2-3ヶ月）、3) 基礎工事・電気設備工事（3-4ヶ月）、4) コンテナ設置・接続（1-2ヶ月）、5) 試運転・検収（1ヶ月）。合計で約8-12ヶ月程度の期間を要します。",
    keywords: ["工事", "建設", "プロセス", "期間", "許認可", "試運転"]
  },
  {
    category: "construction",
    title: "工事の進捗状況",
    content: "現在、複数のプロジェクトが進行中です。運用中のプロジェクトは8件、工事中のプロジェクトは4件、計画中のプロジェクトは2件あります。各地域の詳細な進捗状況は、実績・工事状況ページでご確認いただけます。",
    keywords: ["進捗", "状況", "運用中", "工事中", "計画中", "プロジェクト"]
  },
  {
    category: "construction",
    title: "工事の規模と容量",
    content: "プロジェクトの規模は様々で、定格出力10MW〜40MW、蓄電容量20MWh〜80MWhの範囲で実績があります。サイトの条件や用途に応じて最適なサイズを提案いたします。",
    keywords: ["規模", "容量", "MW", "MWh", "サイズ", "出力"]
  },
  
  // FAQ
  {
    category: "faq",
    title: "BESSとは何ですか？",
    content: "BESS（Battery Energy Storage System）は、蓄電池エネルギー貯蔵システムの略称です。電力系統に接続して、電気を蓄えたり放出したりすることで、電力の需給バランスを調整し、系統の安定化に貢献します。",
    keywords: ["BESS", "蓄電池", "システム", "電力系統", "需給"]
  },
  {
    category: "faq",
    title: "どんな用途に使えますか？",
    content: "BESSは主に以下の用途に活用できます：1) 需給調整市場への参加、2) 容量市場への参加、3) 再生可能エネルギーの出力変動の平滑化、4) ピークシフト、5) 系統周波数調整（AFC/FCR）。",
    keywords: ["用途", "需給調整", "容量市場", "再生可能エネルギー", "ピークシフト", "周波数調整"]
  },
  {
    category: "faq",
    title: "導入までの期間は？",
    content: "サイト調査から商業運転開始まで、一般的に8〜12ヶ月程度の期間を要します。許認可取得や電気設備工事に時間がかかる場合があります。具体的なスケジュールは、ご相談いただければお見積もりをお出しします。",
    keywords: ["期間", "導入", "スケジュール", "見積もり", "商業運転"]
  },
  {
    category: "faq",
    title: "維持管理はどうなりますか？",
    content: "当社では、設置後のメンテナンスサービスも提供しています。定期的な点検、リモート監視、故障時の対応など、包括的なサポートを行います。詳細はお問い合わせください。",
    keywords: ["維持管理", "メンテナンス", "点検", "監視", "サポート"]
  }
];

/**
 * キーワードに基づいて関連する知識を検索（簡易版）
 * 将来的にベクトル検索に置き換え可能
 */
export function findRelevantKnowledge(query: string, limit: number = 3): KnowledgeItem[] {
  const lowerQuery = query.toLowerCase();
  
  return chatbotKnowledge
    .map(item => {
      // キーワードマッチングスコア計算
      const keywordMatches = item.keywords.filter(kw => 
        lowerQuery.includes(kw.toLowerCase())
      ).length;
      const titleMatch = item.title.toLowerCase().includes(lowerQuery) ? 2 : 0;
      const contentMatch = item.content.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const score = keywordMatches * 2 + titleMatch + contentMatch;
      
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

