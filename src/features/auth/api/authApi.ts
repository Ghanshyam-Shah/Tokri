// src/features/auth/api/authApi.ts
//
// FAKE API — delay ke saath nakli responses, users memory me rehte hain
// (app reload par reset ho jate hain). Asli backend aane par sirf ye file badlegi.
//
// Test user: phone 9999999999 | email test@tokri.com | password 123456
// OTP: koi bhi 6 digit chalega.

import {
  ApiError,
  AuthSession,
  AuthUser,
  OtpChannel,
  RegisterPayload,
} from '../types';
import {
  isValidEmail,
  isValidOtp,
  isValidPassword,
  isValidPhone,
  MIN_PASSWORD,
} from '../utils/validators';

interface FakeUser extends AuthUser {
  phone: string;
  email: string;
  password: string;
}

const users: FakeUser[] = [
  {
    id: 'u-1',
    name: 'Test User',
    phone: '9999999999',
    email: 'test@tokri.com',
    password: '123456',
  },
];

const resetTokens = new Map<string, string>(); // resetToken -> userId

const wait = (ms = 700) => new Promise<void>(r => setTimeout(r, ms));

const fail = (message: string, code?: ApiError['code']) =>
  Object.assign(new Error(message), { code });

const norm = (email: string) => email.trim().toLowerCase();
const byPhone = (phone: string) => users.find(u => u.phone === phone);
const byEmail = (email: string) => users.find(u => u.email === norm(email));

const toSession = (u: FakeUser): AuthSession => ({
  token: `fake-token-${u.id}-${Date.now()}`,
  user: { id: u.id, name: u.name, phone: u.phone, email: u.email },
});

const assertPhone = (phone: string) => {
  if (!isValidPhone(phone)) throw fail('Enter a valid 10-digit mobile number.');
};
const assertEmail = (email: string) => {
  if (!isValidEmail(email)) throw fail('Enter a valid email address.');
};
const assertOtp = (otp: string) => {
  if (!isValidOtp(otp)) throw fail('Enter the 6-digit OTP.');
};

export const authApi = {
  // ── Login with phone ──────────────────────────────────────────
  async requestLoginOtp(phone: string): Promise<void> {
    await wait();
    assertPhone(phone);
    if (!byPhone(phone)) {
      throw fail(
        'No account found with this number. Please register.',
        'USER_NOT_FOUND',
      );
    }
    // asli backend yahan SMS bhejega
  },

  async verifyLoginOtp(phone: string, otp: string): Promise<AuthSession> {
    await wait();
    assertOtp(otp);
    const user = byPhone(phone);
    if (!user) throw fail('Account not found.', 'USER_NOT_FOUND');
    return toSession(user);
  },

  // ── Login with email ──────────────────────────────────────────
  async loginWithEmail(email: string, password: string): Promise<AuthSession> {
    await wait();
    assertEmail(email);
    const user = byEmail(email);
    if (!user) {
      throw fail(
        'No account found with this email. Please register.',
        'USER_NOT_FOUND',
      );
    }
    if (user.password !== password) {
      throw fail('Incorrect password.', 'WRONG_PASSWORD');
    }
    return toSession(user);
  },

  // ── Register ──────────────────────────────────────────────────
  async requestRegisterOtp(p: RegisterPayload): Promise<void> {
    await wait();
    if (p.name.trim().length < 2) throw fail('Enter your name.');
    assertEmail(p.email);
    assertPhone(p.phone);
    if (!isValidPassword(p.password)) {
      throw fail(`Password must be at least ${MIN_PASSWORD} characters.`);
    }
    if (byPhone(p.phone)) {
      throw fail(
        'This number is already registered. Please login.',
        'ALREADY_REGISTERED',
      );
    }
    if (byEmail(p.email)) {
      throw fail(
        'This email is already registered. Please login.',
        'ALREADY_REGISTERED',
      );
    }
  },

  async verifyRegisterOtp(
    p: RegisterPayload,
    otp: string,
  ): Promise<AuthSession> {
    await wait();
    assertOtp(otp);
    if (byPhone(p.phone) || byEmail(p.email)) {
      throw fail('Already registered. Please login.', 'ALREADY_REGISTERED');
    }
    const user: FakeUser = {
      id: `u-${Date.now()}`,
      name: p.name.trim(),
      phone: p.phone,
      email: norm(p.email),
      password: p.password,
    };
    users.push(user);
    return toSession(user);
  },

  // ── Forgot / reset password ───────────────────────────────────
  async requestResetOtp(channel: OtpChannel, target: string): Promise<void> {
    await wait();
    if (channel === 'phone') assertPhone(target);
    else assertEmail(target);
    const user = channel === 'phone' ? byPhone(target) : byEmail(target);
    if (!user) {
      throw fail(
        channel === 'phone'
          ? 'No account found with this number.'
          : 'No account found with this email.',
        'USER_NOT_FOUND',
      );
    }
  },

  async verifyResetOtp(
    channel: OtpChannel,
    target: string,
    otp: string,
  ): Promise<string> {
    await wait();
    assertOtp(otp);
    const user = channel === 'phone' ? byPhone(target) : byEmail(target);
    if (!user) throw fail('Account not found.', 'USER_NOT_FOUND');
    const token = `reset-${user.id}-${Date.now()}`;
    resetTokens.set(token, user.id);
    return token;
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    await wait();
    if (!isValidPassword(newPassword)) {
      throw fail(`Password must be at least ${MIN_PASSWORD} characters.`);
    }
    const userId = resetTokens.get(resetToken);
    const user = users.find(u => u.id === userId);
    if (!user) throw fail('Reset session expired. Please try again.');
    user.password = newPassword;
    resetTokens.delete(resetToken);
  },
};
