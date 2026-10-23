// src/features/auth/services/tokenStorage.ts
import * as Keychain from 'react-native-keychain';
import { AuthSession } from '../types';

const SERVICE = 'tokri.auth';

export const tokenStorage = {
  async save(session: AuthSession): Promise<void> {
    await Keychain.setGenericPassword('session', JSON.stringify(session), {
      service: SERVICE,
    });
  },

  async load(): Promise<AuthSession | null> {
    try {
      const creds = await Keychain.getGenericPassword({ service: SERVICE });
      return creds ? (JSON.parse(creds.password) as AuthSession) : null;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await Keychain.resetGenericPassword({ service: SERVICE });
  },
};
