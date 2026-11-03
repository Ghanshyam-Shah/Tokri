// src/Data/lists.ts
// Saved lists (ListScreen) ke filter chips.
// Lists ka data ab Supabase se aata hai (features/savedLists).

import { FilterOption } from './types';

export const LIST_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'Monthly', label: 'Monthly', labelHindi: 'मासिक' },
  { id: 'Weekly', label: 'Weekly', labelHindi: 'साप्ताहिक' },
  { id: 'Festival', label: 'Festival', labelHindi: 'त्योहार' },
  { id: 'Drafts', label: 'Drafts', labelHindi: 'ड्राफ्ट' },
];
