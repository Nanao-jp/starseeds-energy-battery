/**
 * チャットボット用の知識ベースローダー
 * MDファイルから知識を読み込んで構造化データに変換
 */

import fs from "fs";
import path from "path";
import type { KnowledgeItem } from "@/data/chatbot-knowledge";

const KNOWLEDGE_DIR = path.join(process.cwd(), "src/data/chatbot");

/**
 * MDファイルを読み込んでKnowledgeItemに変換
 */
function parseMarkdownFile(filePath: string, filename: string): KnowledgeItem[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const items: KnowledgeItem[] = [];
  
  // ファイル名からカテゴリを推測
  let category: "product" | "construction" | "faq" | "company" = "faq";
  if (filename.includes("company")) category = "company";
  else if (filename.includes("product")) category = "product";
  else if (filename.includes("construction")) category = "construction";
  else if (filename.includes("faq")) category = "faq";
  
  // MDファイルをセクションごとに分割
  const sections = content.split(/^#+\s+/m).filter(section => section.trim());
  
  for (const section of sections) {
    const lines = section.split("\n");
    const title = lines[0].trim();
    if (!title) continue;
    
    // セクションの内容を取得（タイトル行を除く）
    const contentLines = lines.slice(1).filter(line => line.trim());
    const content = contentLines.join("\n").trim();
    
    if (!content) continue;
    
    // キーワードを抽出（タイトルとコンテンツから）
    const keywords = extractKeywords(title, content);
    
    items.push({
      category,
      title,
      content,
      keywords,
    });
  }
  
  return items;
}

/**
 * タイトルとコンテンツからキーワードを抽出
 */
function extractKeywords(title: string, content: string): string[] {
  const keywords = new Set<string>();
  
  // タイトルから重要な単語を抽出
  const titleWords = title
    .replace(/[#【】()（）]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 1 && !/^[0-9]+$/.test(word));
  
  titleWords.forEach(word => keywords.add(word));
  
  // コンテンツから重要な単語を抽出（技術用語など）
  const importantTerms = [
    "BESS", "蓄電池", "システム", "コンテナ", "出力", "容量", "仕様",
    "安全性", "安全対策", "BMS", "火災", "リチウムイオン", "監視",
    "EMS", "エネルギー管理", "電池管理", "UI", "運用",
    "工事", "建設", "プロセス", "期間", "許認可", "試運転",
    "進捗", "状況", "運用中", "工事中", "計画中", "プロジェクト",
    "規模", "MW", "MWh", "サイズ",
    "電力系統", "需給", "用途", "需給調整", "容量市場",
    "再生可能エネルギー", "ピークシフト", "周波数調整",
    "導入", "スケジュール", "見積もり", "商業運転",
    "維持管理", "メンテナンス", "点検", "サポート"
  ];
  
  importantTerms.forEach(term => {
    if (content.includes(term) || title.includes(term)) {
      keywords.add(term);
    }
  });
  
  return Array.from(keywords);
}

/**
 * 知識ベースディレクトリからすべてのMDファイルを読み込む
 */
export function loadKnowledgeFromMarkdown(): KnowledgeItem[] {
  const items: KnowledgeItem[] = [];
  
  try {
    const files = fs.readdirSync(KNOWLEDGE_DIR);
    const mdFiles = files.filter(file => file.endsWith(".md"));
    
    // ファイル名でソート（01-, 02-などのプレフィックスで順序を保つ）
    mdFiles.sort();
    
    for (const file of mdFiles) {
      const filePath = path.join(KNOWLEDGE_DIR, file);
      const parsedItems = parseMarkdownFile(filePath, file);
      items.push(...parsedItems);
    }
  } catch (error) {
    console.error("知識ベースの読み込みエラー:", error);
  }
  
  return items;
}

/**
 * 知識ベースをキャッシュ（サーバーサイドでのみ使用）
 */
let cachedKnowledge: KnowledgeItem[] | null = null;

export function getKnowledgeBase(): KnowledgeItem[] {
  if (cachedKnowledge === null) {
    cachedKnowledge = loadKnowledgeFromMarkdown();
  }
  return cachedKnowledge;
}

