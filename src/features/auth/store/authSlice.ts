import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { tokenStorage } from '../services/tokenStorage';
import { AuthSession, AuthUser } from '../types';

export interface AuthState {
  status: 'loading' | 'signedIn' | 'signedOut';
  user: AuthUser | null;
  pending: AuthSession | null; // OTP ho gaya, naam baaki
  phone: string | null; // jis number par OTP gaya
  loading: boolean; // koi request chal rahi hai (button spinner)
  error: string | null;
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
  pending: null,
  phone: null,
  loading: false,
  error: null,
};

const msg = (e: unknown) =>
  e instanceof Error ? e.message : 'Kuch galat ho gaya, dobara koshish karein';

// ─── Thunks ───────────────────────────────────────────────────────
export const restoreSession = createAsyncThunk('auth/restoreSession', async () =>
  tokenStorage.load(),
);

export const sendOtp = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('auth/sendOtp', async (phone, { rejectWithValue }) => {
  try {
    await authApi.sendOtp(phone);
    return phone;
  } catch (e) {
    return rejectWithValue(msg(e));
  }
});

export const verifyOtp = createAsyncThunk<
  AuthSession,
  { phone: string; otp: string },
  { rejectValue: string }
>('auth/verifyOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const session = await authApi.verifyOtp(phone, otp);
    if (session.user.name) await tokenStorage.save(session); // naam hai to login poora
    return session;
  } catch (e) {
    return rejectWithValue(msg(e));
  }
});

export const loginWithEmail = createAsyncThunk<
  AuthSession,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginWithEmail', async ({ email, password }, { rejectWithValue }) => {
  try {
    const session = await authApi.loginWithEmail(email, password);
    await tokenStorage.save(session);
    return session;
  } catch (e) {
    return rejectWithValue(msg(e));
  }
});

export const completeProfile = createAsyncThunk<
  AuthSession,
  string,
  { rejectValue: string }
>('auth/completeProfile', async (name, { getState, rejectWithValue }) => {
  const { pending } = (getState() as { auth: AuthState }).auth;
  if (!pending) return rejectWithValue('Session nahi mili, dobara login karein');
  if (!name.trim()) return rejectWithValue('Apna naam daaliye');
  const session: AuthSession = {
    ...pending,
    user: { ...pending.user, name: name.trim() },
  };
  await tokenStorage.save(session);
  return session;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await tokenStorage.clear();
});

// ─── Slice ────────────────────────────────────────────────────────
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // OTP screen se "number badlo" par wapas
    resetOtpFlow(state) {
      state.phone = null;
      state.pending = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.user = payload?.user ?? null;
        state.status = payload ? 'signedIn' : 'signedOut';
      })
      .addCase(restoreSession.rejected, state => {
        state.status = 'signedOut';
      })
      .addCase(sendOtp.fulfilled, (state, { payload }) => {
        state.phone = payload;
      })
      .addCase(verifyOtp.fulfilled, (state, { payload }) => {
        if (payload.user.name) {
          state.user = payload.user;
          state.status = 'signedIn';
          state.pending = null;
        } else {
          state.pending = payload; // naam puchhna baaki
        }
      })
      .addCase(loginWithEmail.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = 'signedIn';
      })
      .addCase(completeProfile.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = 'signedIn';
        state.pending = null;
      })
      .addCase(signOut.fulfilled, () => ({
        ...initialState,
        status: 'signedOut' as const,
      }))
      // ── common loading / error (sirf user-triggered thunks ke liye) ──
      .addMatcher(
        a =>
          a.type.startsWith('auth/') &&
          a.type.endsWith('/pending') &&
          !a.type.includes('restoreSession'),
        state => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        a => a.type.startsWith('auth/') && a.type.endsWith('/fulfilled'),
        state => {
          state.loading = false;
        },
      )
      .addMatcher(
        a => a.type.startsWith('auth/') && a.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          const payload = (action as { payload?: unknown }).payload;
          if (typeof payload === 'string') state.error = payload;
        },
      );
  },
});

export const { clearError, resetOtpFlow } = slice.actions;
export default slice.reducer;