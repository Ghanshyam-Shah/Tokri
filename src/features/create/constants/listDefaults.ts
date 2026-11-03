// src/features/create/constants/listDefaults.ts
// List screen ke constants.

import { ListItemParam } from '../../../navigation/types/navigationTypes';

// Layout constant (theme se independent)
export const H_PADDING = 16;

// Route se aane wale items ka hi type (imageUrl optional)
export type SelectedP = ListItemParam;

// Category chip ka type (catalog ki Category isse compatible hai)
export interface Category {
  id: string;
  label: string;
  labelHindi: string;
}
