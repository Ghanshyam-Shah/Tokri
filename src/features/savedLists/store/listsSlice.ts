// src/features/savedLists/store/listsSlice.ts
// Saved lists ka Redux state (Old Lists, History, Templates, Home sab yahin se)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from '../../auth/store/authSlice';
import { ListRow, fetchLists } from '../services/listsService';

interface ListsState {
  rows: ListRow[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const initialState: ListsState = { rows: [], status: 'idle', error: null };

export const loadLists = createAsyncThunk<
  ListRow[],
  void,
  { rejectValue: string }
>('lists/load', async (_, { rejectWithValue }) => {
  try {
    return await fetchLists();
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Could not load lists.');
  }
});

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadLists.pending, s => {
        s.status = s.rows.length === 0 ? 'loading' : s.status;
        s.error = null;
      })
      .addCase(loadLists.fulfilled, (s, a) => {
        s.rows = a.payload;
        s.status = 'ready';
      })
      .addCase(loadLists.rejected, (s, a) => {
        s.status = 'error';
        s.error = a.payload ?? 'Could not load lists.';
      })
      .addCase(signOut.fulfilled, () => initialState);
  },
});

export default listsSlice.reducer;
