import { useState, type ReactNode } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Sprout } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';

type Page = 'today' | 'ask' | 'schemes' | 'account';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
  children: ReactNode;
  farmProfile?: OnboardingResult | null;
  onLogout?: () => void;
}

export function WebShell({ current, onNavigate, children, farmProfile, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Desktop sidebar (always visible on lg+) */}
      <SidebarNav
        current={current}
        onNavigate={onNavigate}
        farmProfile={farmProfile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Mobile top header — visible only below lg */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white border-b border-ochre-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-brand-700 text-base">शेतकरीHit</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ochre-100 transition-colors text-muted"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            id="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ochre-100 transition-colors text-ink"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-64 pt-[57px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}
