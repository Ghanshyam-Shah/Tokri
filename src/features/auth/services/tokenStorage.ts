// src/features/auth/services/tokenStorage.ts
//
// Session ab Supabase sambhalta hai (login par save, token refresh, logout par saaf).
// Ye file wahi purana interface rakhti hai, taaki authSlice na badalna pade.

import { supabase } from '../../../lib/supabase';
import { AuthSession } from '../types';
import { toAuthSession } from '../../../features/auth/services/supabaseAuth';

export const tokenStorage = {
  // Supabase login par khud session save karta hai
  async save(_session: AuthSession): Promise<void> {},

  // App khulte hi: saved session hai to wahi user
  async load(): Promise<AuthSession | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session ? await toAuthSession(session) : null;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await supabase.auth.signOut();
  },
};
