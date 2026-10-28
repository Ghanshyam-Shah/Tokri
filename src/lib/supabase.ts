// src/lib/supabase.ts
//
// Supabase client. Login Supabase Auth se hota hai; session AsyncStorage me
// save rehta hai aur token apne aap refresh hota hai.
//
// ⚠️ Packages:
//   npm install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage

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
 * Logged-in user. Login nahi hai to error (catalog / lists sirf login ke baad).
 */
export const ensureSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('You are signed out. Please login again.');
  return session.user;
};
