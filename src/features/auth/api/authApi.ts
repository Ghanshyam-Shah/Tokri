// Fake API: delay ke saath nakli responses.
import { AuthSession } from '../types';

const wait = (ms = 700) => new Promise<void>(r => setTimeout(r, ms));

// Fake "database": ye phone numbers pehle se registered maane jaate hain (naam saved hai)
const KNOWN_PHONES: Record<string, string> = {
  '9999999999': 'Ramesh Kirana',
};

export const authApi = {
  async sendOtp(phone: string): Promise<void> {
    await wait();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      throw new Error('Sahi 10 digit mobile number daaliye');
    }
    // asli backend yahan SMS bhejega. Fake me koi bhi 6 digit OTP chalega.
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthSession> {
    await wait();
    if (!/^\d{6}$/.test(otp)) throw new Error('6 digit OTP daaliye');
    return {
      token: `fake-token-${Date.now()}`,
      user: { id: `u-${phone}`, name: KNOWN_PHONES[phone] ?? '', phone },
    };
  },

  async loginWithEmail(email: string, password: string): Promise<AuthSession> {
    await wait();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Sahi email daaliye');
    if (password.length < 6) throw new Error('Password kam se kam 6 akshar ka ho');
    return {
      token: `fake-token-${Date.now()}`,
      user: { id: `u-${email}`, name: email.split('@')[0], email },
    };
  },
};