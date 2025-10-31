import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/solutions', label: '事業紹介' },
  { href: '/products', label: '製品・技術' },
  { href: '/status', label: '実績・工事状況' },
  { href: '/news', label: 'ニュース' },
  { href: '/company', label: '会社情報' },
  { href: '/contact', label: '問い合わせ' },
];

export function Header() {
  return (
    <header className="bg-white/80 dark:glass backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold font-heading">
              <Image 
                src="/images/logo.png" 
                alt="Starseeds energy Battery Logo" 
                width={180} 
                height={45} 
              />
              <span>{process.env.NEXT_PUBLIC_SITE_NAME}</span>
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Mobile menu button will be added later */}
        </div>
      </div>
    </header>
  );
}
