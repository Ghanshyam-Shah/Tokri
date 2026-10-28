// src/features/auth/api/authApi.ts
//
// Supabase Auth. Abhi sirf EMAIL + PASSWORD login chalu hai.
// Phone OTP / Register / Forgot password baad me yahin jodenge (screens waise hi rahengi).

import { supabase } from '../../../lib/supabase';
import {
  ApiError,
  AuthSession,
  OtpChannel,
  RegisterPayload,
} from '../types';
import { isValidEmail } from '../utils/validators';
import { toAuthSession } from '../services/supabaseAuth';

const fail = (message: string, code?: ApiError['code']) =>
  Object.assign(new Error(message), { code });

const NOT_AVAILABLE =
  'This option is not available yet. Please login with email and password.';

export const authApi = {
  // ── Login with email + password ───────────────────────────────
  async loginWithEmail(email: string, password: string): Promise<AuthSession> {
    if (!isValidEmail(email)) throw fail('Enter a valid email address.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.session) {
      const invalid = error?.message?.toLowerCase().includes('invalid login');
      throw fail(
        invalid
          ? 'Incorrect email or password.'
          : error?.message ?? 'Could not login. Please try again.',
        invalid ? 'WRONG_PASSWORD' : undefined,
      );
    }
    return toAuthSession(data.session);
  },

  // ── Baad me (abhi band) ───────────────────────────────────────
  async requestLoginOtp(_phone: string): Promise<void> {
    throw fail(NOT_AVAILABLE);
  },
  async verifyLoginOtp(_phone: string, _otp: string): Promise<AuthSession> {
    throw fail(NOT_AVAILABLE);
  },
  async requestRegisterOtp(_p: RegisterPayload): Promise<void> {
    throw fail(NOT_AVAILABLE);
  },
  async verifyRegisterOtp(
    _p: RegisterPayload,
    _otp: string,
  ): Promise<AuthSession> {
    throw fail(NOT_AVAILABLE);
  },
  async requestResetOtp(_channel: OtpChannel, _target: string): Promise<void> {
    throw fail(NOT_AVAILABLE);
  },
  async verifyResetOtp(
    _channel: OtpChannel,
    _target: string,
    _otp: string,
  ): Promise<string> {
    throw fail(NOT_AVAILABLE);
  },
  async resetPassword(_resetToken: string, _newPassword: string): Promise<void> {
    throw fail(NOT_AVAILABLE);
  },
};
