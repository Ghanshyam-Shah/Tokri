// src/features/catalog/hooks/useCatalog.ts
//
// Screens me:  const { products, categories, loading, error, refresh } = useCatalog();
// Pehli baar use hote hi catalog Supabase se aa jata hai.

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { loadCatalog } from '../store/catalogSlice';

export const useCatalog = () => {
  const dispatch = useAppDispatch();
  const { products, categories, status, error } = useAppSelector(
    s => s.catalog,
  );

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [status, dispatch]);

  const refresh = useCallback(() => dispatch(loadCatalog()), [dispatch]);

  return {
    products,
    categories,
    loading: status === 'idle' || status === 'loading',
    error,
    refresh,
  };
};
