export interface AuthUser {
  id: string;
  name: string; // khali ho to OTP ke baad naam puchhna hai
  phone?: string;
  email?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}