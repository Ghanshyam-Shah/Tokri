// features/catalog/types/catalog.types.ts


// ─── CategoryId ─────────────────────────────────────────────────────────────────
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

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: CategoryId;
  label: string;
  labelHindi: string;
  icon: string;
}


// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  categoryId: CategoryId;
  unit: string;
  price: number;
  imageUrl?: string;
  isTopPick?: boolean;
  createdAt: number;
}