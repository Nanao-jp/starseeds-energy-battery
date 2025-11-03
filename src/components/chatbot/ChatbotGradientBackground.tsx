"use client";

/**
 * チャットボット用のグラデーション背景とグロー効果コンポーネント
 * ボタンとウィンドウヘッダーで共通使用
 * 注意: Fragmentで返すことで、親要素（position: relative）の直接の子要素として配置される
 */
export function ChatbotGradientBackground() {
  return (
    <>
      {/* グラデーションアニメーション背景 */}
      <div className="chatbot-gradient-bg" />
      
      {/* グロー効果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 pointer-events-none" />
    </>
  );
}

