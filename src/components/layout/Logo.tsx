import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 text-xl font-bold font-heading ${className}`}>
      <span>{SITE_CONFIG.name}</span>
    </Link>
  );
}

