'use client';

import { PointWallet } from '@/components/wallet/point-wallet';
import { Logo } from '@/components/icons/logo';
import { useAppContext } from '@/context/AppContext';


export function Header() {
  const { points } = useAppContext();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Logo className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold font-headline">Taskify</span>
        </div>
        <div className="ml-auto">
          <PointWallet points={points} />
        </div>
      </div>
    </header>
  );
}
