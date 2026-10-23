// src/features/auth/utils/validators.ts

export const MIN_PASSWORD = 6;

export const isValidPhone = (v: string) => /^[6-9]\d{9}$/.test(v);
export const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
export const isValidOtp = (v: string) => /^\d{6}$/.test(v);
export const isValidPassword = (v: string) => v.length >= MIN_PASSWORD;
