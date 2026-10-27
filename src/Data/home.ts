// src/Data/home.ts
// HomeScreen: active lists

import { ActiveList } from './types';

export const ACTIVE_LISTS: ActiveList[] = [
  { id: 'al-1', name: 'Monthly Ration', bought: 8, total: 12, due: 'Due 25 Oct', sourceId: '1' },
  { id: 'al-2', name: 'Weekend Party', bought: 2, total: 9, due: 'Due 26 Oct', sourceId: 'tpl-2' },
  { id: 'al-3', name: 'Weekly Veggies', bought: 5, total: 8, due: 'Due 28 Oct', sourceId: '4' },
];