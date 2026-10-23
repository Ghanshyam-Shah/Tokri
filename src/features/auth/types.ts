// src/features/auth/types.ts

export interface AuthUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type OtpPurpose = 'login' | 'register' | 'reset';
export type OtpChannel = 'phone' | 'email';

// OTP screen ko jo kuch chahiye wo yahan rehta hai (Redux me)
export interface OtpFlow {
  purpose: OtpPurpose;
  channel: OtpChannel;
  target: string; // phone number (10 digit) ya email
  register?: RegisterPayload; // sirf purpose === 'register'
  resetToken?: string; // reset OTP verify hone ke baad milta hai
}

export interface ApiError {
  message: string;
  code?: 'USER_NOT_FOUND' | 'ALREADY_REGISTERED' | 'WRONG_PASSWORD';
}
