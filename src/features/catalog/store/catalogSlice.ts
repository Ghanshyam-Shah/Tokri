// src/features/catalog/store/catalogSlice.ts
// Catalog ka Redux state: products + categories (Supabase se)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '../../../Data/types';
import {
  CatalogProduct,
  fetchCategories,
  fetchProducts,
} from '../services/catalogService';

interface CatalogState {
  products: CatalogProduct[];
  categories: Category[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  status: 'idle',
  error: null,
};

export const loadCatalog = createAsyncThunk(
  'catalog/load',
  async (_: void, { rejectWithValue }) => {
    try {
      const [categories, products] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      return { categories, products };
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Could not load catalog');
    }
  },
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCatalog.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.status = 'ready';
        state.categories = action.payload.categories;
        state.products = action.payload.products;
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) ?? 'Could not load catalog';
      });
  },
});

export default catalogSlice.reducer;
