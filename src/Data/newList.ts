// src/Data/newList.ts
// NewListScreen: list types (Old Lists / Templates ab Supabase se aate hain)

import { ListTypeOption } from './types';

export const LIST_TYPES: ListTypeOption[] = [
  {
    id: 'monthly',
    label: 'Monthly Ration',
    labelHindi: 'मासिक राशन',
    icon: 'calendar-month',
  },
  {
    id: 'weekly',
    label: 'Weekly',
    labelHindi: 'साप्ताहिक',
    icon: 'calendar-week',
  },
  {
    id: 'festival',
    label: 'Festival',
    labelHindi: 'त्योहार',
    icon: 'star-crescent',
  },
  { id: 'custom', label: 'Custom', labelHindi: 'कस्टम', icon: 'tune-variant' },
];
