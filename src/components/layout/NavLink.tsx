import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/constants';

interface NavLinkProps {
  item: NavItem;
  className?: string;
  variant?: 'header' | 'footer';
  onClick?: () => void;
}

export function NavLink({ item, className, variant = 'header', onClick }: NavLinkProps) {
  const baseClasses = 'transition-colors';
  
  const variantClasses = {
    header: 'text-sm font-medium text-gray-700 dark:text-foreground hover:text-primary dark:hover:text-primary',
    footer: 'text-sm text-gray-600 dark:text-muted-foreground hover:text-green-600 dark:hover:text-primary',
  };

  return (
    <Link
      href={item.href}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}

