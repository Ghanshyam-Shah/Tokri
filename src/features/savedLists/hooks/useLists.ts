// src/features/savedLists/hooks/useLists.ts
//
// const { drafts, completed, templates, loading, error, refresh } = useLists();
// Pehli baar use hote hi lists Supabase se aati hain.

import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { loadLists } from '../store/listsSlice';

export const useLists = () => {
  const dispatch = useAppDispatch();
  const { rows, status, error } = useAppSelector(s => s.lists);

  useEffect(() => {
    if (status === 'idle') dispatch(loadLists());
  }, [status, dispatch]);

  const refresh = useCallback(() => dispatch(loadLists()), [dispatch]);

  const split = useMemo(() => {
    const normal = rows.filter(r => !r.isTemplate);
    return {
      all: normal,
      drafts: normal.filter(r => r.status !== 'completed'),
      completed: normal.filter(r => r.status === 'completed'),
      templates: rows.filter(r => r.isTemplate),
    };
  }, [rows]);

  return {
    ...split,
    loading: status === 'idle' || status === 'loading',
    error,
    refresh,
  };
};
