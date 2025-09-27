import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/solutions', label: '事業紹介' },
  { href: '/products', label: '製品・技術' },
  { href: '/status', label: '実績・工事状況' },
  { href: '/news', label: 'ニュース' },
  { href: '/company', label: '会社情報' },
  { href: '/contact', label: '問い合わせ' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-1">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold">
              <Image 
                src="/images/logo.png" 
                alt="Starseeds energy Battery Logo" 
                width={180} 
                height={45} 
              />
              <span>{process.env.NEXT_PUBLIC_SITE_NAME}</span>
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-2">
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {currentYear} {process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
