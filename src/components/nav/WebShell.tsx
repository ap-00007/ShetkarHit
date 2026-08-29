import type { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';

type Page = 'today' | 'ask' | 'schemes' | 'account';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
  children: ReactNode;
}

export function WebShell({ current, onNavigate, children }: Props) {
  return (
    <div className="min-h-screen bg-cream">
      <SidebarNav current={current} onNavigate={onNavigate} />
      <main className="lg:ml-60 pb-16 lg:pb-0">
        {children}
      </main>
      <BottomNav current={current} onNavigate={onNavigate} />
    </div>
  );
}
