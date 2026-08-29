import { useState, useCallback } from 'react';
import { LangProvider } from '@/context/LangContext';
import { WebShell } from '@/components/nav/WebShell';
import { IntroPage } from '@/components/IntroPage';
import { LoginPage } from '@/components/auth/AuthCard';
import { OtpPage } from '@/components/auth/OtpPage';
import { TodayPage } from '@/components/today/TodayPage';
import { AskPage } from '@/components/ask/AskPage';
import { SchemesPage } from '@/components/schemes/SchemesPage';
import { AccountPage } from '@/components/account/AccountPage';

type Screen = 'intro' | 'login' | 'signup' | 'otp' | 'app';
type Page = 'today' | 'ask' | 'schemes' | 'account';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [page, setPage] = useState<Page>('today');
  const [otpFlow, setOtpFlow] = useState<'login' | 'signup'>('login');
  const [mobile, setMobile] = useState('');

  const handleOtpSent = useCallback((m: string, flow: 'login' | 'signup') => {
    setMobile(m);
    setOtpFlow(flow);
    setScreen('otp');
  }, []);

  const handleVerified = useCallback(() => {
    setScreen('app');
    setPage('today');
  }, []);

  if (screen === 'intro') {
    return (
      <LangProvider>
        <IntroPage onStart={() => setScreen('signup')} onLogin={() => setScreen('login')} />
      </LangProvider>
    );
  }

  if (screen === 'login' || screen === 'signup') {
    return (
      <LangProvider>
        <LoginPage
          flow={screen === 'signup' ? 'signup' : 'login'}
          onBack={() => setScreen('intro')}
          onOtpSent={handleOtpSent}
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

  return (
    <LangProvider>
      <WebShell current={page} onNavigate={setPage}>
        {page === 'today' && <TodayPage />}
        {page === 'ask' && <AskPage />}
        {page === 'schemes' && <SchemesPage />}
        {page === 'account' && <AccountPage />}
      </WebShell>
    </LangProvider>
  );
}

export default App;
