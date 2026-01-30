'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/locker', label: 'Locker', icon: Lock },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary">
            <Icon className={cn('h-6 w-6', pathname === href ? 'text-primary' : '')} />
            <span className={cn('text-xs font-medium', pathname === href ? 'text-primary' : '')}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
