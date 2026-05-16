// features/catalog/types/catalog.types.ts

// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  categoryId: string;
  unit: string;
  price: number;
  imageUrl?: string; // ← 'image' nahi, 'imageUrl'
  isTopPick?: boolean;
  createdAt: number;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export type CategoryId =
  | 'all'
  | 'vegetables'
  | 'dairy'
  | 'grains'
  | 'spices'
  | 'snacks'
  | 'personal_care'
  | 'beverages'
  | 'cleaning';

export interface Category {
  id: CategoryId;
  label: string; // English — "Vegetables"
  labelHindi: string; // Hindi   — "सब्ज़ियां"
  icon: string; // MaterialCommunityIcons name
}

// ─── Static Category List ─────────────────────────────────────────────────────
// Yeh poori app mein use hoga — CatalogScreen, AddEditProductScreen, filters
export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी', icon: 'view-grid' },
  {
    id: 'vegetables',
    label: 'Vegetables',
    labelHindi: 'सब्ज़ियां',
    icon: 'carrot',
  },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी', icon: 'cow' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज', icon: 'barley' },
  {
    id: 'spices',
    label: 'Spices',
    labelHindi: 'मसाले',
    icon: 'shaker-outline',
  },
  {
    id: 'snacks',
    label: 'Snacks',
    labelHindi: 'स्नैक्स',
    icon: 'food-variant',
  },
  {
    id: 'beverages',
    label: 'Beverages',
    labelHindi: 'पेय पदार्थ',
    icon: 'cup-water',
  },
  {
    id: 'personal_care',
    label: 'Personal Care',
    labelHindi: 'पर्सनल केयर',
    icon: 'bottle-tonic-outline',
  },
  { id: 'cleaning', label: 'Cleaning', labelHindi: 'सफाई', icon: 'broom' },
];
