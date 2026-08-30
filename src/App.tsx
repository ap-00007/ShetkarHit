import { useState, useCallback, useEffect } from 'react';
import { LangProvider } from '@/context/LangContext';
import { WebShell } from '@/components/nav/WebShell';
import { IntroPage } from '@/components/IntroPage';
import { SignUpPage, LogInPage } from '@/components/auth/AuthCard';
import { OnboardingPage, type OnboardingResult } from '@/components/auth/OnboardingPage';
import { TodayPage } from '@/components/today/TodayPage';
import { AskPage } from '@/components/ask/AskPage';
import { SchemesPage } from '@/components/schemes/SchemesPage';
import { AccountPage } from '@/components/account/AccountPage';
import {
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  getCurrentUser,
  getProfileByUser,
  saveFarmerProfile,
  supabase,
} from '@/lib/supabase';

type Screen = 'intro' | 'login' | 'signup' | 'onboarding' | 'app';
type Page = 'today' | 'ask' | 'schemes' | 'account';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [page, setPage] = useState<Page>('today');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmProfile, setFarmProfile] = useState<OnboardingResult | null>(null);

  // Restore session from Supabase & localStorage on startup
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('shetkarihit_profile');
      if (savedProfile) {
        setFarmProfile(JSON.parse(savedProfile));
        setScreen('app');
      }

      // Check active Supabase auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const user = session.user;
          setCurrentUserId(user.id);
          setCurrentUserEmail(user.email || '');

          getProfileByUser(user.id, user.email).then((profile) => {
            if (profile) {
              setFarmProfile(profile);
              localStorage.setItem('shetkarihit_profile', JSON.stringify(profile));
              setScreen('app');
            }
          });
        }
      });
    } catch {
      // ignore
    }
  }, []);

  const handleSignUp = useCallback(async (email: string, pass: string, name?: string) => {
    const data = await signUpWithEmail(email, pass, name);
    const user = data.user;
    if (user) {
      setCurrentUserId(user.id);
      setCurrentUserEmail(user.email || email);
    }
    if (name) {
      setFarmerName(name);
    }
    // Proceed to onboarding to complete farm profile (skips asking name again)
    setScreen('onboarding');
  }, []);

  const handleLogIn = useCallback(async (email: string, pass: string) => {
    const data = await signInWithEmail(email, pass);
    const user = data.user;
    if (user) {
      setCurrentUserId(user.id);
      setCurrentUserEmail(user.email || email);

      const profile = await getProfileByUser(user.id, user.email);
      if (profile) {
        setFarmProfile(profile);
        localStorage.setItem('shetkarihit_profile', JSON.stringify(profile));
        setScreen('app');
        setPage('today');
      } else {
        // No farm profile yet -> guide to onboarding
        setScreen('onboarding');
      }
    }
  }, []);

  const handleOnboardingDone = useCallback(async (data: OnboardingResult) => {
    setFarmProfile(data);
    localStorage.setItem('shetkarihit_profile', JSON.stringify(data));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id || currentUserId;
      const uemail = user?.email || currentUserEmail;
      if (uid && uemail) {
        await saveFarmerProfile(uid, uemail, data);
      }
    } catch (err) {
      console.warn('[Supabase] Save profile error:', err);
    }

    setScreen('app');
    setPage('today');
  }, [currentUserId, currentUserEmail]);

  const handleOnboardingSkip = useCallback(() => {
    setScreen('app');
    setPage('today');
  }, []);

  const handleUpdateProfile = useCallback(async (updated: OnboardingResult) => {
    setFarmProfile(updated);
    if (updated.name) {
      setFarmerName(updated.name);
    }
    localStorage.setItem('shetkarihit_profile', JSON.stringify(updated));

    try {
      const user = await getCurrentUser();
      const uid = user?.id || currentUserId || `usr_${Date.now()}`;
      const uemail = user?.email || currentUserEmail || 'farmer@gmail.com';
      await saveFarmerProfile(uid, uemail, updated);
    } catch (err) {
      console.warn('[Supabase] Update profile note:', err);
    }
  }, [currentUserId, currentUserEmail]);

  const handleLogout = useCallback(async () => {
    await signOutUser();
    localStorage.removeItem('shetkarihit_profile');
    setFarmProfile(null);
    setCurrentUserId('');
    setCurrentUserEmail('');
    setFarmerName('');
    setScreen('intro');
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
          onSignUp={handleSignUp}
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
          onLogIn={handleLogIn}
          onSwitch={() => setScreen('signup')}
        />
      </LangProvider>
    );
  }

  if (screen === 'onboarding') {
    return (
      <LangProvider>
        <OnboardingPage
          initialName={farmerName || farmProfile?.name || ''}
          onDone={handleOnboardingDone}
          onSkip={handleOnboardingSkip}
        />
      </LangProvider>
    );
  }

  return (
    <LangProvider>
      <WebShell current={page} onNavigate={setPage} farmProfile={farmProfile} onLogout={handleLogout}>
        {page === 'today' && <TodayPage farmProfile={farmProfile} />}
        {page === 'ask' && <AskPage farmContext={(farmProfile ?? {}) as Record<string, unknown>} />}
        {page === 'schemes' && <SchemesPage farmProfile={farmProfile} />}
        {page === 'account' && (
          <AccountPage
            farmProfile={farmProfile}
            userEmail={currentUserEmail}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}
      </WebShell>
    </LangProvider>
  );
}

export default App;
