import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatRequest, ChatResponse } from "@/types/chatbot";
import { buildMessages } from "@/lib/chatbot/prompt";

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history = [] } = body;

    // バリデーション
    if (!message || typeof message !== "string") {
      return NextResponse.json<ChatResponse>(
        { message: "", error: "メッセージが不正です" },
        { status: 400 }
      );
    }

    // APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEYが設定されていません");
      return NextResponse.json<ChatResponse>(
        { message: "", error: "API設定エラーが発生しました" },
        { status: 500 }
      );
    }

    // メッセージを構築（システムプロンプト + 会話履歴 + 現在のメッセージ）
    const messages = buildMessages(message, history);

    // OpenAI APIを呼び出し
    const model = process.env.OPENAI_MODEL || "o4-mini";
    const isO4Model = model.startsWith("o4") || model.startsWith("o3");
    
    // o4/o3シリーズはtemperatureを設定しない（デフォルト値1のみサポート）
    const completion = await openai.chat.completions.create({
      model: model, // デフォルトはo4-mini（2025年4月リリース、高速かつ低コストの推論モデル）
      messages: messages,
      // o4/o3シリーズはmax_completion_tokens、それ以外はmax_tokensとtemperatureを使用
      ...(isO4Model 
        ? { max_completion_tokens: 1000 } 
        : { max_tokens: 1000, temperature: 0.7 } // 創造性と一貫性のバランス
      ),
    });

    // レスポンスからメッセージを取得
    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("OpenAI APIからのレスポンスが不正です");
    }

    return NextResponse.json<ChatResponse>({
      message: assistantMessage,
    });
  } catch (error) {
    console.error("チャットAPIエラー:", error);

    // OpenAI APIのエラーハンドリング
    if (error instanceof OpenAI.APIError) {
      const statusCode = error.status || 500;
      let errorMessage = error.message || "APIエラーが発生しました";
      
      // より詳細なエラーメッセージを提供
      if (error.status === 401) {
        errorMessage = "APIキーが無効です。環境変数を確認してください。";
      } else if (error.status === 429) {
        errorMessage = "APIのレート制限に達しました。しばらく待ってから再度お試しください。";
      } else if (error.status === 500) {
        errorMessage = "OpenAI APIでサーバーエラーが発生しました。";
      }

      return NextResponse.json<ChatResponse>(
        { message: "", error: errorMessage },
        { status: statusCode }
      );
    }

    // その他のエラー
    const errorMessage = error instanceof Error ? error.message : "サーバーエラーが発生しました";
    console.error("予期しないエラー:", error);
    
    return NextResponse.json<ChatResponse>(
      { message: "", error: errorMessage },
      { status: 500 }
    );
  }
}

