/**
 * チャットボット用のプロンプト定義
 */

import { findRelevantKnowledge } from "@/data/chatbot-knowledge";
import type { Message } from "@/types/chatbot";

/**
 * システムプロンプトを生成
 */
export function getSystemPrompt(): string {
  return `あなたはスターシーズ株式会社の蓄電池事業（BESS）に関する専門的なチャットボットアシスタントです。

【あなたの役割】
- 製品（BESS）や工事に関する質問に専門的かつ親切に回答する
- 技術的な内容を分かりやすく説明する
- 日本語で丁寧に対応する

【回答の原則】
- 提供された知識ベースの情報を基に回答する
- 知識ベースにない情報については「詳細はお問い合わせください」と案内する
- 推測や不確実な情報は提供しない
- 製品の安全性や性能について、正確な情報のみを伝える

【会社情報】
- 会社名: スターシーズ株式会社
- 事業: 系統用蓄電池（BESS）事業
- 製品: コンテナ型大規模蓄電池システム`;
}

/**
 * ユーザーの質問に関連する知識を取得してコンテキストを構築
 */
export function buildContext(userMessage: string, history: Message[]): string {
  // 関連知識を検索
  const relevantKnowledge = findRelevantKnowledge(userMessage, 3);
  
  let context = "【関連情報】\n";
  
  if (relevantKnowledge.length > 0) {
    relevantKnowledge.forEach((item, index) => {
      context += `\n${index + 1}. ${item.title}\n${item.content}\n`;
    });
  } else {
    context += "一般的なBESS（蓄電池システム）に関する情報を参照してください。\n";
  }
  
  // 会話履歴を追加（最新3件）
  if (history.length > 0) {
    context += "\n【会話履歴】\n";
    const recentHistory = history.slice(-3);
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
  
  // 会話履歴（最新5件まで）
  const recentHistory = history.slice(-5);
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

