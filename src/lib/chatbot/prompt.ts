/**
 * チャットボット用のプロンプト定義
 */

import { getKnowledgeBase } from "./knowledge-loader";
import type { Message } from "@/types/chatbot";

/**
 * システムプロンプトを生成
 */
export function getSystemPrompt(): string {
  return `あなたはStarseeds Energy（スターシーズ株式会社）のAIアシスタントです。

【あなたの役割】
- Starseeds EnergyのAIアシスタントとして、親しみやすく丁寧に対応する
- 製品（BESS）や工事に関する質問に専門的かつ親切に回答する
- 技術的な内容を分かりやすく、専門知識がない人にも理解できるように説明する
- 日本語で丁寧かつ親しみやすい口調で対応する
- ユーザーの質問の意図を正確に理解し、適切な情報を提供する

【回答の原則】
- 提供された知識ベースの情報を基に回答する（知識ベースの内容を正確に反映すること）
- 知識ベースにない情報については「詳細はお問い合わせフォームからご連絡いただくか、担当者まで直接お問い合わせください」と案内する
- 推測や不確実な情報は提供しない
- 製品の安全性や性能について、正確な情報のみを伝える
- 回答は簡潔で分かりやすく、必要に応じて箇条書きや段落分けを活用する

【重要なルール】
1. **事業への接続**
   - 基本的には自分たちの事業（BESS関連）に繋がるように話す
   - ただし、関係ない話から無理に繋げる必要はない
   - 自然な流れで事業に関連する場合は、関連性を示す

2. **一般的な質問への対応**
   - 再生可能エネルギーや事業に関係ない一般的な質問には、普通に返答する
   - 無理に事業に結びつける必要はない
   - ただし、BESSや蓄電池、電力系統、再生可能エネルギーに関連する話題の場合は、自然に事業との関連性を示す

3. **具体的な数字について**
   - 値段、価格、コスト、費用などの具体的な金額については「具体的な価格については、お問い合わせフォームからご連絡いただくか、担当者まで直接お問い合わせください」と案内する
   - 工期、期間、スケジュールなどの具体的な日数や期間については「具体的な工期については、サイトの条件により異なります。詳細はお問い合わせフォームからご連絡いただくか、担当者まで直接お問い合わせください」と案内する
   - わからないことは「わからない」と正直に伝え、お問い合わせを促す
   - 知識ベースに記載されていない具体的な数値は提供しない

【トーン】
- 専門的でありながら親しみやすい
- 丁寧で礼儀正しい
- ユーザーの理解を最優先に考える
- Starseeds EnergyのAIアシスタントとしての自覚を持つ

【会社情報】
- 会社名: Starseeds Energy（スターシーズ株式会社）
- 事業: 系統用蓄電池（BESS）事業
- 製品: コンテナ型大規模蓄電池システム`;
}

/**
 * ユーザーの質問に関連する知識を検索
 */
function findRelevantKnowledge(query: string, limit: number = 3): Array<{ title: string; content: string; keywords: string[] }> {
  const knowledgeBase = getKnowledgeBase();
  const lowerQuery = query.toLowerCase();
  
  return knowledgeBase
    .map(item => {
      // キーワードマッチングスコア計算
      const keywordMatches = item.keywords.filter(kw => 
        lowerQuery.includes(kw.toLowerCase())
      ).length;
      const titleMatch = item.title.toLowerCase().includes(lowerQuery) ? 3 : 0;
      const contentMatch = item.content.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const score = keywordMatches * 2 + titleMatch + contentMatch;
      
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

/**
 * ユーザーの質問に関連する知識を取得してコンテキストを構築
 */
export function buildContext(userMessage: string, history: Message[]): string {
  // 関連知識を検索（最大5件に増やしてより多くの情報を提供）
  const relevantKnowledge = findRelevantKnowledge(userMessage, 5);
  
  let context = "【関連情報】\n";
  
  if (relevantKnowledge.length > 0) {
    relevantKnowledge.forEach((item, index) => {
      context += `\n${index + 1}. ${item.title}\n${item.content}\n`;
    });
  } else {
    context += "一般的なBESS（蓄電池システム）に関する情報を参照してください。\n";
  }
  
  // 会話履歴を追加（最新5件に増やしてより多くのコンテキストを提供）
  if (history.length > 0) {
    context += "\n【会話履歴】\n";
    const recentHistory = history.slice(-5);
    recentHistory.forEach(msg => {
      const role = msg.role === "user" ? "ユーザー" : "アシスタント";
      context += `${role}: ${msg.content}\n`;
    });
  }
  
  return context;
}

/**
 * チャットAPI用のメッセージ配列を構築
 */
export function buildMessages(userMessage: string, history: Message[]): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
  
  // システムプロンプト
  const systemPrompt = getSystemPrompt();
  const context = buildContext(userMessage, history);
  
  messages.push({
    role: "system",
    content: `${systemPrompt}\n\n${context}`
  });
  
  // 会話履歴（最新10件までに増やしてより多くのコンテキストを提供）
  const recentHistory = history.slice(-10);
  recentHistory.forEach(msg => {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    });
  });
  
  // 現在のユーザーメッセージ
  messages.push({
    role: "user",
    content: userMessage
  });
  
  return messages;
}

