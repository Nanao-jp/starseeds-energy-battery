import { NextRequest, NextResponse } from "next/server";
import { buildMessages } from "@/lib/chatbot/prompt";
import type { ChatRequest, ChatResponse } from "@/types/chatbot";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json<ChatResponse>(
        { message: "", error: "メッセージが不正です" },
        { status: 400 }
      );
    }

    // OpenAI APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEYが設定されていません");
      return NextResponse.json<ChatResponse>(
        { message: "", error: "APIキーが設定されていません" },
        { status: 500 }
      );
    }

    // メッセージ配列を構築
    const messages = buildMessages(message, history);

    // OpenAI APIを呼び出し
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // または "gpt-4", "gpt-3.5-turbo" など
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI APIエラー:", errorData);
      return NextResponse.json<ChatResponse>(
        { message: "", error: "AIの応答を取得できませんでした" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "回答を生成できませんでした。";

    return NextResponse.json<ChatResponse>({
      message: assistantMessage,
    });
  } catch (error) {
    console.error("チャットAPIエラー:", error);
    return NextResponse.json<ChatResponse>(
      { message: "", error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

