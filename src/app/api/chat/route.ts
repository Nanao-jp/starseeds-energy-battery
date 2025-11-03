import { NextRequest, NextResponse } from "next/server";
import type { ChatRequest, ChatResponse } from "@/types/chatbot";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;
    // historyは将来のAPI実装時に使用予定

    if (!message || typeof message !== "string") {
      return NextResponse.json<ChatResponse>(
        { message: "", error: "メッセージが不正です" },
        { status: 400 }
      );
    }

    // テスト用の固定レスポンス
    const testResponse = `※これはテストテキストです※

ご質問ありがとうございます。現在、システムのテスト中です。製品や工事に関するお問い合わせは、お問い合わせフォームからご連絡いただくか、担当者まで直接お問い合わせください。

ご不便をおかけして申し訳ございません。`;

    // 実際のAPI応答時間を想定した遅延（2秒）
    // 実際のOpenAI APIは通常1-3秒程度の応答時間がかかるため、それに合わせて調整
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json<ChatResponse>({
      message: testResponse,
    });
  } catch (error) {
    console.error("チャットAPIエラー:", error);
    return NextResponse.json<ChatResponse>(
      { message: "", error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

