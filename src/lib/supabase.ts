import { createClient, type User } from '@supabase/supabase-js';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your_supabase_anon_key_here'
  );
};

// Create client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export interface DbProfile {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  village?: string;
  district?: string;
  state?: string;
  acres?: number;
  soil?: string;
  irrigation?: string;
  water_source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbCrop {
  id?: string;
  profile_id?: string;
  name: string;
  variety?: string;
  sowing_date?: string;
}

/* ─────────────────────────────────────────────
   Auth Methods (Email & Password)
───────────────────────────────────────────── */

export async function signUpWithEmail(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name?.trim() || splitEmail(email),
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('[Supabase] Sign out error:', error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function splitEmail(email: string): string {
  return email.split('@')[0] || 'शेतकरी मित्र';
}

/* ─────────────────────────────────────────────
   Profile & Crop Queries
───────────────────────────────────────────── */

/**
 * Fetch a farmer's profile and crops by user ID or email
 */
export async function getProfileByUser(userId?: string, email?: string): Promise<OnboardingResult | null> {
  if (!isSupabaseConfigured() || (!userId && !email)) {
    return null;
  }

  try {
    let query = supabase.from('profiles').select('*');
    if (userId) {
      query = query.eq('id', userId);
    } else if (email) {
      query = query.eq('email', email.trim().toLowerCase());
    }

    const { data: profile, error } = await query.maybeSingle();

    if (error) {
      console.warn('[Supabase] getProfile error:', error.message);
      return null;
    }

    if (!profile) return null;

    // Fetch crops
    const { data: cropsData, error: cropsError } = await supabase
      .from('crops')
      .select('*')
      .eq('profile_id', profile.id);

    if (cropsError) {
      console.warn('[Supabase] getCrops error:', cropsError.message);
    }

    const crops = (cropsData || []).map((c: DbCrop) => ({
      name: c.name || '',
      variety: c.variety || '',
      sowingDate: c.sowing_date || '',
    }));

    return {
      name: profile.name || splitEmail(profile.email),
      village: profile.village || '',
      district: profile.district || 'Ahmednagar',
      state: profile.state || 'Maharashtra',
      acres: profile.acres ? String(profile.acres) : '',
      crops: crops.length > 0 ? crops : [{ name: 'Onion', variety: '', sowingDate: '' }],
      soil: profile.soil || '',
      irrigation: profile.irrigation || '',
      waterSource: profile.water_source || '',
    };
  } catch (err) {
    console.error('[Supabase] Fetch profile failed:', err);
    return null;
  }
}

/**
 * Save or update a farmer profile and their crops in Supabase
 */
export async function saveFarmerProfile(
  userId: string,
  email: string,
  result: OnboardingResult
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Upsert profile
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email: cleanEmail,
          name: result.name,
          village: result.village,
          district: result.district,
          state: result.state || 'Maharashtra',
          acres: parseFloat(result.acres) || null,
          soil: result.soil,
          irrigation: result.irrigation,
          water_source: result.waterSource,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (profileErr) {
      console.error('[Supabase] saveProfile error:', profileErr.message);
      return false;
    }

    // 2. Clear old crops for this profile and insert new
    await supabase.from('crops').delete().eq('profile_id', userId);

    const cropsToInsert = (result.crops || [])
      .filter((c) => c.name.trim() !== '')
      .map((c) => ({
        profile_id: userId,
        name: c.name.trim(),
        variety: c.variety?.trim() || null,
        sowing_date: c.sowingDate || null,
      }));

    if (cropsToInsert.length > 0) {
      const { error: cropsErr } = await supabase.from('crops').insert(cropsToInsert);
      if (cropsErr) {
        console.warn('[Supabase] saveCrops error:', cropsErr.message);
      }
    }

    console.log('[Supabase] Profile & crops saved successfully for:', cleanEmail);
    return true;
  } catch (err) {
    console.error('[Supabase] Save failed:', err);
    return false;
  }
}
