import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import catalogReducer from '../../features/catalog/store/catalogSlice';
// reducer: { ... } ke andar:


// Naye slices yahin add honge (lists, etc.).
// redux-persist baad me: sirf lists/theme whitelist me, auth NAHI (token Keychain me hai).
export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;