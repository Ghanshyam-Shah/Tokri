// src/features/catalog/constants/productFormDefaults.ts
// AddItem / EditItem ke common constants.

export interface Category {
  id: string;
  label: string;
  labelHindi: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

export const UNITS = ['kg', 'g', 'L', 'ml', 'pcs'];
