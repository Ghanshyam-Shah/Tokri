// src/Data/types.ts

// ═══════════════════════════════════════════════════════════════════
// CATALOG
// ═══════════════════════════════════════════════════════════════════

// ─── CategoryId ───────────────────────────────────────────────────
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

// ─── Category ─────────────────────────────────────────────────────
export interface Category {
  id: CategoryId;
  label: string;
  labelHindi: string;
  icon: string;
}

// ─── Product ──────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════
// LISTS (Saved Lists, History, New List — sab yahin se)
// ═══════════════════════════════════════════════════════════════════

export type ListStatus = 'Draft' | 'Completed';
export type ListCategory = 'Monthly' | 'Weekly' | 'Festival' | 'Custom';

/** Har list ka common summary. Baaki list-types isi par bante hain. */
export interface ListSummary {
  id: string;
  name: string;
  date: string;
  itemCount: number;
  preview: string;
}

/** CreateListScreen me chuna hua product (qty + note ke saath) */
export interface SelectedProduct extends Product {
  quantity: number;
  note?: string;
}

/** Saved Lists screen */
export interface SavedList extends ListSummary {
  category: ListCategory;
  status: ListStatus;
}

/** History screen */
export type HistoryItem = ListSummary;

export interface HistorySection {
  title: string;
  data: HistoryItem[];
}

/** Chips ke liye generic option (ChipItem se match karta hai) */
export interface FilterOption {
  id: string;
  label: string;
  labelHindi: string;
}

// ═══════════════════════════════════════════════════════════════════
// NEW LIST FORM
// ═══════════════════════════════════════════════════════════════════

export type ListType = 'monthly' | 'weekly' | 'festival' | 'custom';

export interface ListTypeOption {
  id: ListType;
  label: string;
  labelHindi: string;
  icon: string;
}

/** "Use template" section: Old Lists aur My Templates dono ka item */
export interface ListSource {
  id: string;
  name: string;
  itemCount: number;
  meta: string;
}

// Old list / template ke andar ke items (id se product dhundhte hain)
export interface SourceItem {
  productId: string;
  quantity: number;
  note?: string;
}