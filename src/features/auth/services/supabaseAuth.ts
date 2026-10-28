// src/features/auth/services/supabaseAuth.ts
// Supabase session -> app ka AuthSession (naam / phone profiles table se)

import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { AuthSession, AuthUser } from '../types';

const toAuthUser = async (u: User): Promise<AuthUser> => {
  const { data } = await supabase
    .from('profiles')
    .select('name,phone,email')
    .eq('id', u.id)
    .maybeSingle();

  const email = data?.email ?? u.email ?? undefined;
  return {
    id: u.id,
    name: data?.name ?? (u.user_metadata?.name as string | undefined) ?? email?.split('@')[0] ?? 'User',
    phone: data?.phone ?? u.phone ?? undefined,
    email,
  };
};

export const toAuthSession = async (s: Session): Promise<AuthSession> => ({
  token: s.access_token,
  user: await toAuthUser(s.user),
});
