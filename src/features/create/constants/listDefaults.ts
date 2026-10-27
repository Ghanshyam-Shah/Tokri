// src/features/create/constants/listDefaults.ts
// List screen ke constants + fallback data.

import { ListItemParam } from '../../../navigation/types/navigationTypes';

// Layout constant (theme se independent)
export const H_PADDING = 16;

// Route se aane wale items ka hi type (imageUrl optional)
export type SelectedP = ListItemParam;

// ─── Categories (CreateListScreen jaisi) ──────────────────────────────────────
export interface Category {
  id: string;
  label: string;
  labelHindi: string;
}
export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

// ─── Default / fallback items ──────────────────────────────────────────────
// Sirf tab use hota hai jab route.params.items na mile. Navigation wire hone
// ke baad delete kar sakte ho.
export const DEFAULT_ITEMS: SelectedP[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    unit: '1kg',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    quantity: 2,
    categoryId: 'vegetables',
  },
  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    unit: '5kg',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    quantity: 1,
    note: 'India Gate brand lena',
    categoryId: 'grains',
  },
  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    quantity: 3,
    categoryId: 'dairy',
  },
  {
    id: '9',
    name: 'Turmeric Powder',
    nameHindi: 'हल्दी पाउडर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
    quantity: 1,
    categoryId: 'spices',
  },
  {
    id: '6',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    unit: '1kg',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    quantity: 2,
    categoryId: 'vegetables',
  },
  {
    id: '10',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    unit: '5kg',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    quantity: 1,
    note: 'India Gate brand lena',
    categoryId: 'grains',
  },
  {
    id: '11',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    quantity: 3,
    categoryId: 'dairy',
  },
  {
    id: '12',
    name: 'Turmeric Powder',
    nameHindi: 'हल्दी पाउडर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
    quantity: 1,
    categoryId: 'spices',
  },
];
