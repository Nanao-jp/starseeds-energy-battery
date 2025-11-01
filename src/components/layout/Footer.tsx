import { FOOTER_NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { Logo } from './Logo';
import { NavLink } from './NavLink';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 glass backdrop-blur-md border-t border-gray-200 dark:border-primary/20">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-1">
            <Logo />
          </div>
          <div className="mt-8 md:mt-0 md:order-2">
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {FOOTER_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} variant="footer" />
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-muted-foreground">
          &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
