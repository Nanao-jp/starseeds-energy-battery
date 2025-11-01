"use client";

import { motion } from 'framer-motion';
import { MapPin, Phone, User } from 'lucide-react';
import { FOOTER_NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { Logo } from './Logo';
import { NavLink } from './NavLink';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-100 glass backdrop-blur-md border-t border-gray-200 dark:border-primary/20 overflow-hidden">
      {/* 装飾的な背景パターン */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.72 0.15 210 / 10%) 2px, oklch(0.72 0.15 210 / 10%) 4px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* 上部の区切り線 */}
      <div className="section-divider" aria-hidden="true" />

      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* メインコンテンツ（シンプル化：一括表示） */}
        <motion.div
          className="grid md:grid-cols-3 gap-12 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* 会社情報セクション */}
          <div className="space-y-6">
            <Logo className="text-foreground" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              スターシーズ株式会社は、系統用蓄電池（BESS）事業を通じて、持続可能なエネルギー社会の実現に貢献しています。
            </p>
          </div>

          {/* 連絡先情報セクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4 relative">
              <span className="relative">
                会社情報
                <span className="absolute -bottom-2 left-0 h-0.5 w-12 bg-primary/50 rounded-full" style={{
                  boxShadow: '0 0 6px oklch(0.72 0.15 210 / 40%)'
                }} />
              </span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" style={{
                  filter: 'drop-shadow(0 0 6px oklch(0.72 0.15 210 / 50%))'
                }} />
                <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                  〒105-0004<br />
                  東京都港区新橋四丁目21番3号<br />
                  新橋東急ビル8階
                </address>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" style={{
                  filter: 'drop-shadow(0 0 6px oklch(0.72 0.15 210 / 50%))'
                }} />
                <a 
                  href="tel:03-6721-5891" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  TEL：03-6721-5891
                </a>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary flex-shrink-0" style={{
                  filter: 'drop-shadow(0 0 6px oklch(0.72 0.15 210 / 50%))'
                }} />
                <span className="text-sm text-muted-foreground">
                  代表取締役社長 鈴木 雅順
                </span>
              </div>
            </div>
          </div>

          {/* ナビゲーションセクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4 relative">
              <span className="relative">
                サイトマップ
                <span className="absolute -bottom-2 left-0 h-0.5 w-12 bg-primary/50 rounded-full" style={{
                  boxShadow: '0 0 6px oklch(0.72 0.15 210 / 40%)'
                }} />
              </span>
            </h3>
            <nav className="flex flex-col gap-3">
              {FOOTER_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} variant="footer" />
              ))}
            </nav>
          </div>
        </motion.div>

        {/* コピーライト（シンプル化：一括表示） */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="pt-8 border-t border-primary/10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
