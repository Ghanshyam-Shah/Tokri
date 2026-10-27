// src/features/auth/store/authSlice.ts

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { tokenStorage } from '../services/tokenStorage';
import {
  ApiError,
  AuthSession,
  AuthUser,
  OtpChannel,
  OtpFlow,
  OtpPurpose,
  RegisterPayload,
} from '../types';

export interface AuthState {
  status: 'loading' | 'signedIn' | 'signedOut';
  user: AuthUser | null;
  otpFlow: OtpFlow | null; // OTP screen ka poora context
  loading: boolean; // koi request chal rahi hai (button spinner)
  error: string | null;
  errorCode: ApiError['code'] | null;
  notice: string | null; // success message (e.g. password updated)
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
  otpFlow: null,
  loading: false,
  error: null,
  errorCode: null,
  notice: null,
};

type Cfg = { rejectValue: ApiError; state: { auth: AuthState } };

const toApiError = (e: unknown): ApiError => ({
  message:
    e instanceof Error ? e.message : 'Something went wrong. Please try again.',
  code: (e as { code?: ApiError['code'] } | null)?.code,
});

const MIN_SPLASH_MS = 1200; // splash kam se kam itni der dikhe
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// ─── Session restore (Splash ke time) ─────────────────────────────
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async () => {
    const [session] = await Promise.all([
      tokenStorage.load(),
      wait(MIN_SPLASH_MS),
    ]);
    return session;
  },
);

// ─── OTP bhejna (3 flows) ─────────────────────────────────────────
export const sendLoginOtp = createAsyncThunk<OtpFlow, string, Cfg>(
  'auth/sendLoginOtp',
  async (phone, { rejectWithValue }) => {
    try {
      await authApi.requestLoginOtp(phone);
      return { purpose: 'login', channel: 'phone', target: phone };
    } catch (e) {
      return rejectWithValue(toApiError(e));
    }
  },
);

export const sendRegisterOtp = createAsyncThunk<
  OtpFlow,
  RegisterPayload,
  Cfg
>('auth/sendRegisterOtp', async (payload, { rejectWithValue }) => {
  try {
    await authApi.requestRegisterOtp(payload);
    return {
      purpose: 'register',
      channel: 'phone',
      target: payload.phone,
      register: payload,
    };
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const sendResetOtp = createAsyncThunk<
  OtpFlow,
  { channel: OtpChannel; target: string },
  Cfg
>('auth/sendResetOtp', async ({ channel, target }, { rejectWithValue }) => {
  try {
    await authApi.requestResetOtp(channel, target);
    return { purpose: 'reset', channel, target };
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const resendOtp = createAsyncThunk<void, void, Cfg>(
  'auth/resendOtp',
  async (_, { getState, rejectWithValue }) => {
    const flow = getState().auth.otpFlow;
    if (!flow) return rejectWithValue({ message: 'Please start again.' });
    try {
      if (flow.purpose === 'login') {
        await authApi.requestLoginOtp(flow.target);
      } else if (flow.purpose === 'register' && flow.register) {
        await authApi.requestRegisterOtp(flow.register);
      } else {
        await authApi.requestResetOtp(flow.channel, flow.target);
      }
    } catch (e) {
      return rejectWithValue(toApiError(e));
    }
  },
);

// ─── OTP verify ───────────────────────────────────────────────────
interface VerifyResult {
  purpose: OtpPurpose;
  session?: AuthSession; // login / register: seedha signed in
  resetToken?: string; // reset: ab ResetPassword screen
}

export const verifyOtp = createAsyncThunk<VerifyResult, string, Cfg>(
  'auth/verifyOtp',
  async (otp, { getState, rejectWithValue }) => {
    const flow = getState().auth.otpFlow;
    if (!flow) {
      return rejectWithValue({ message: 'Session expired. Please start again.' });
    }
    try {
      if (flow.purpose === 'login') {
        const session = await authApi.verifyLoginOtp(flow.target, otp);
        await tokenStorage.save(session);
        return { purpose: 'login', session };
      }
      if (flow.purpose === 'register' && flow.register) {
        const session = await authApi.verifyRegisterOtp(flow.register, otp);
        await tokenStorage.save(session);
        return { purpose: 'register', session };
      }
      const resetToken = await authApi.verifyResetOtp(
        flow.channel,
        flow.target,
        otp,
      );
      return { purpose: 'reset', resetToken };
    } catch (e) {
      return rejectWithValue(toApiError(e));
    }
  },
);

// ─── Email login / password reset / sign out ──────────────────────
export const loginWithEmail = createAsyncThunk<
  AuthSession,
  { email: string; password: string },
  Cfg
>('auth/loginWithEmail', async ({ email, password }, { rejectWithValue }) => {
  try {
    const session = await authApi.loginWithEmail(email, password);
    await tokenStorage.save(session);
    return session;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const resetPassword = createAsyncThunk<void, string, Cfg>(
  'auth/resetPassword',
  async (newPassword, { getState, rejectWithValue }) => {
    const token = getState().auth.otpFlow?.resetToken;
    if (!token) {
      return rejectWithValue({ message: 'Reset session expired. Try again.' });
    }
    try {
      await authApi.resetPassword(token, newPassword);
    } catch (e) {
      return rejectWithValue(toApiError(e));
    }
  },
);

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
      state.errorCode = null;
    },
    clearNotice(state) {
      state.notice = null;
    },
    clearOtpFlow(state) {
      state.otpFlow = null;
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
      .addCase(sendLoginOtp.fulfilled, (state, { payload }) => {
        state.otpFlow = payload;
      })
      .addCase(sendRegisterOtp.fulfilled, (state, { payload }) => {
        state.otpFlow = payload;
      })
      .addCase(sendResetOtp.fulfilled, (state, { payload }) => {
        state.otpFlow = payload;
      })
      .addCase(verifyOtp.fulfilled, (state, { payload }) => {
        if (payload.session) {
          state.user = payload.session.user;
          state.status = 'signedIn'; // RootNavigator apne aap App stack dikhayega
          state.otpFlow = null;
        } else if (payload.resetToken && state.otpFlow) {
          state.otpFlow.resetToken = payload.resetToken;
        }
      })
      .addCase(loginWithEmail.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = 'signedIn';
      })
      .addCase(resetPassword.fulfilled, state => {
        state.otpFlow = null;
        state.notice = 'Password updated. Please login with your new password.';
      })
      .addCase(signOut.fulfilled, () => ({
        ...initialState,
        status: 'signedOut' as const,
      }))
      // ── common loading / error ──
      .addMatcher(
        a =>
          a.type.startsWith('auth/') &&
          a.type.endsWith('/pending') &&
          !a.type.includes('restoreSession'),
        state => {
          state.loading = true;
          state.error = null;
          state.errorCode = null;
          state.notice = null;
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
          const p = (action as { payload?: ApiError }).payload;
          state.error = p?.message ?? 'Something went wrong. Please try again.';
          state.errorCode = p?.code ?? null;
        },
      );
  },
});

export const { clearError, clearNotice, clearOtpFlow } = slice.actions;
export default slice.reducer;
