import type { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';

type Page = 'today' | 'ask' | 'schemes' | 'account';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
  children: ReactNode;
  farmProfile?: OnboardingResult | null;
}

export function WebShell({ current, onNavigate, children, farmProfile }: Props) {
  return (
    <div className="min-h-screen bg-cream">
      <SidebarNav current={current} onNavigate={onNavigate} farmProfile={farmProfile} />
      <main className="lg:ml-60 pb-16 lg:pb-0">
        {children}
      </main>
      <BottomNav current={current} onNavigate={onNavigate} />
    </div>
  );
}
