import { NAV_ITEMS } from '@/lib/constants';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="bg-white/80 dark:bg-transparent dark:glass backdrop-blur-md sticky top-0 z-40 border-b dark:border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex md:space-x-8">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} variant="header" />
            ))}
          </nav>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
