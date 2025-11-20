'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/schedule', label: 'Schedule' },
  { href: '/dashboard/projects', label: 'Projects' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors',
            pathname === item.href
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
