import type { Metadata } from "next";
import { Noto_Sans_JP, Dancing_Script } from "next/font/google";
import "@fontsource-variable/orbitron";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundParticles } from "@/components/layout/BackgroundParticles";
import { Toaster } from "@/components/ui/sonner";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hero",
});

export const metadata: Metadata = {
  title: {
    default: "Starseeds energy Battery",
    template: `%s | Starseeds energy Battery`,
  },
  description: "スターシーズ株式会社の蓄電池事業。最先端のコンテナ型蓄電システムで、再生可能エネルギーの安定供給と電力系統の最適化に貢献します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`dark ${notoSansJp.variable} ${dancingScript.variable}`} suppressHydrationWarning>
      <body>
        {/* テスト用：一時的に無効化（パフォーマンステスト） */}
        {/* <BackgroundParticles /> */}
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-grow relative z-10">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
