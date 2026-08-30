import { useState, useCallback } from 'react';
import { LangProvider } from '@/context/LangContext';
import { WebShell } from '@/components/nav/WebShell';
import { IntroPage } from '@/components/IntroPage';
import { SignUpPage, LogInPage } from '@/components/auth/AuthCard';
import { OtpPage } from '@/components/auth/OtpPage';
import { OnboardingPage, type OnboardingResult } from '@/components/auth/OnboardingPage';
import { TodayPage } from '@/components/today/TodayPage';
import { AskPage } from '@/components/ask/AskPage';
import { SchemesPage } from '@/components/schemes/SchemesPage';
import { AccountPage } from '@/components/account/AccountPage';

type Screen = 'intro' | 'login' | 'signup' | 'otp' | 'onboarding' | 'app';
type Page = 'today' | 'ask' | 'schemes' | 'account';

/** Compute profile completeness % from the collected onboarding data */
function computeCompleteness(p: OnboardingResult | null): number {
  if (!p) return 0;
  const checks = [
    !!p.name,
    !!(p.village || p.district),
    !!p.acres,
    p.crops.some((c) => c.name.trim() !== ''),
    !!(p.soil && p.irrigation),
    !!p.waterSource,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [page, setPage] = useState<Page>('today');
  const [otpFlow, setOtpFlow] = useState<'login' | 'signup'>('login');
  const [mobile, setMobile] = useState('');
  const [farmProfile, setFarmProfile] = useState<OnboardingResult | null>(null);

  const handleOtpSent = useCallback((m: string, flow: 'login' | 'signup') => {
    setMobile(m);
    setOtpFlow(flow);
    setScreen('otp');
  }, []);

  const handleVerified = useCallback((isNewUser: boolean) => {
    if (isNewUser) {
      setScreen('onboarding');
    } else {
      setScreen('app');
      setPage('today');
    }
  }, []);

  const handleOnboardingDone = useCallback((data: OnboardingResult) => {
    setFarmProfile(data);
    setScreen('app');
    setPage('today');
  }, []);

  const handleOnboardingSkip = useCallback(() => {
    setScreen('app');
    setPage('today');
  }, []);

  if (screen === 'intro') {
    return (
      <LangProvider>
        <IntroPage
          onStart={() => setScreen('signup')}
          onLogin={() => setScreen('login')}
        />
      </LangProvider>
    );
  }

  if (screen === 'signup') {
    return (
      <LangProvider>
        <SignUpPage
          onBack={() => setScreen('intro')}
          onOtpSent={handleOtpSent}
          onSwitch={() => setScreen('login')}
        />
      </LangProvider>
    );
  }

  if (screen === 'login') {
    return (
      <LangProvider>
        <LogInPage
          onBack={() => setScreen('intro')}
          onOtpSent={handleOtpSent}
          onSwitch={() => setScreen('signup')}
        />
      </LangProvider>
    );
  }

  if (screen === 'otp') {
    return (
      <LangProvider>
        <OtpPage
          mobile={mobile}
          flow={otpFlow}
          onBack={() => setScreen(otpFlow === 'signup' ? 'signup' : 'login')}
          onVerified={handleVerified}
        />
      </LangProvider>
    );
  }

  if (screen === 'onboarding') {
    return (
      <LangProvider>
        <OnboardingPage
          onDone={handleOnboardingDone}
          onSkip={handleOnboardingSkip}
        />
      </LangProvider>
    );
  }

  return (
    <LangProvider>
      <WebShell current={page} onNavigate={setPage} farmProfile={farmProfile}>
        {page === 'today' && <TodayPage farmProfile={farmProfile} />}
        {page === 'ask' && <AskPage farmContext={(farmProfile ?? {}) as Record<string, unknown>} />}
        {page === 'schemes' && <SchemesPage />}
        {page === 'account' && <AccountPage />}

      </WebShell>
    </LangProvider>
  );
}

export default App;
