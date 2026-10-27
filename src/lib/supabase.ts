// src/lib/supabase.ts
//
// Supabase client + anonymous session.
//
// ⚠️ Packages:
//   npm install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage
//   cd ios && pod install     (AsyncStorage native hai -> app dobara build karo)

import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../config/supabase';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage, // session phone me save rehta hai
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// App foreground me ho tabhi token refresh chale
AppState.addEventListener('change', state => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});

/**
 * Supabase user pakka karo. Pehle se session ho to wahi, warna anonymous
 * sign-in (user ko kuch nahi karna). Session AsyncStorage me save hota hai,
 * isliye app dobara khulne par wahi user milta hai.
 */
export const ensureSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error('Could not create a Supabase session');
  return data.user;
};
