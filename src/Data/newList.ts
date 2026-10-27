// src/Data/newList.ts
// NewListScreen: list types, old lists, templates

import { ListTypeOption, ListSource } from './types';
import { SAVED_LISTS } from './lists';

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

// Old Lists = SAVED_LISTS ki pehli 3 completed lists (alag se dobara nahi likhi)
export const OLD_LISTS: ListSource[] = SAVED_LISTS.filter(
  list => list.status === 'Completed',
)
  .slice(0, 3)
  .map(list => ({
    id: list.id,
    name: list.name,
    itemCount: list.itemCount,
    meta: list.date,
  }));

export const MY_TEMPLATES: ListSource[] = [
  {
    id: 'tpl-1',
    name: 'Monthly Basic Ration',
    itemCount: 28,
    meta: 'Mera template',
  },
  {
    id: 'tpl-2',
    name: 'Party Snacks',
    itemCount: 12,
    meta: 'Mera template',
  },
];
