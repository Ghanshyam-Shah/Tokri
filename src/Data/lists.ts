// src/Data/lists.ts
// Saved lists (ListScreen) + filter chips

import { SavedList, FilterOption } from './types';

export const SAVED_LISTS: SavedList[] = [
  {
    id: '1',
    name: 'May 2025 Groceries',
    date: '12 May 2025',
    itemCount: 34,
    preview: 'Tomatoes, Rice, Paneer, Milk, Dal...',
    category: 'Monthly',
    status: 'Completed',
  },
  {
    id: '2',
    name: 'Weekend Party Snacks',
    date: '08 May 2025',
    itemCount: 12,
    preview: 'Chips, Coke, Cookies, Namkeen...',
    category: 'Custom',
    status: 'Draft',
  },
  {
    id: '3',
    name: 'Diwali Special',
    date: '01 Nov 2024',
    itemCount: 45,
    preview: 'Ghee, Sugar, Dry Fruits, Maida...',
    category: 'Festival',
    status: 'Completed',
  },
  {
    id: '4',
    name: 'Weekly Veggies',
    date: '28 Apr 2025',
    itemCount: 8,
    preview: 'Onion, Potato, Cabbage, Carrot...',
    category: 'Weekly',
    status: 'Completed',
  },
  // 5–8: scroll test ke liye upar wali lists ki copy (id alag)
  {
    id: '5',
    name: 'May 2025 Groceries',
    date: '12 May 2025',
    itemCount: 34,
    preview: 'Tomatoes, Rice, Paneer, Milk, Dal...',
    category: 'Monthly',
    status: 'Completed',
  },
  {
    id: '6',
    name: 'Weekend Party Snacks',
    date: '08 May 2025',
    itemCount: 12,
    preview: 'Chips, Coke, Cookies, Namkeen...',
    category: 'Custom',
    status: 'Draft',
  },
  {
    id: '7',
    name: 'Diwali Special',
    date: '01 Nov 2024',
    itemCount: 45,
    preview: 'Ghee, Sugar, Dry Fruits, Maida...',
    category: 'Festival',
    status: 'Completed',
  },
  {
    id: '8',
    name: 'Weekly Veggies',
    date: '28 Apr 2025',
    itemCount: 8,
    preview: 'Onion, Potato, Cabbage, Carrot...',
    category: 'Weekly',
    status: 'Completed',
  },
  
];

// ListScreen ke filter chips
export const LIST_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'Monthly', label: 'Monthly', labelHindi: 'मासिक' },
  { id: 'Weekly', label: 'Weekly', labelHindi: 'साप्ताहिक' },
  { id: 'Festival', label: 'Festival', labelHindi: 'त्योहार' },
  { id: 'Drafts', label: 'Drafts', labelHindi: 'ड्राफ्ट' },
];
