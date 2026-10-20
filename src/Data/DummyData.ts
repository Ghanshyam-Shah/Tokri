// src/Data/DummyData.ts
// Demo data. Real API/state aane par is file ko replace karna.

import {
  Category,
  Product,
  SavedList,
  HistorySection,
  FilterOption,
  ListTypeOption,
  ListSource,
} from './types';

// ═══════════════════════════════════════════════════════════════════
// CATALOG
// ═══════════════════════════════════════════════════════════════════

// ─── Category ─────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी', icon: 'view-grid' },
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां', icon: 'carrot' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी', icon: 'cow' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज', icon: 'barley' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले', icon: 'shaker-outline' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स', icon: 'food-variant' },
  { id: 'personal_care', label: 'Personal Care', labelHindi: 'पर्सनल केयर', icon: 'bottle-tonic-outline' },
  { id: 'beverages', label: 'Beverages', labelHindi: 'पेय पदार्थ', icon: 'cup-water' },
  { id: 'cleaning', label: 'Cleaning', labelHindi: 'सफाई', icon: 'broom' },
];

// ─── Product ──────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    price: 40,
    unit: '1kg',
    categoryId: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Organic Milk',
    nameHindi: 'जैविक दूध',
    price: 68,
    unit: '1L',
    categoryId: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    price: 450,
    unit: '5kg',
    categoryId: 'grains',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Toor Dal',
    nameHindi: 'अरहर दाल',
    price: 120,
    unit: '1kg',
    categoryId: 'grains',
    imageUrl: 'https://images.unsplash.com/photo-1599909631565-9921aaabb4a7?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '5',
    name: 'Yellow Bell Pepper',
    nameHindi: 'पीली शिमला मिर्च',
    price: 45,
    unit: '250g',
    categoryId: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '6',
    name: 'Penne Pasta',
    nameHindi: 'पास्ता',
    price: 95,
    unit: '500g',
    categoryId: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    price: 85,
    unit: '200g',
    categoryId: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '8',
    name: 'Carrots',
    nameHindi: 'गाजर',
    price: 35,
    unit: '500g',
    categoryId: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
    {
    id: '9',
    name: 'Turmeric Powder',
    nameHindi: 'हल्दी पाउडर',
    price: 55,
    unit: '200g',
    categoryId: 'spices',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '10',
    name: 'Coriander Seeds',
    nameHindi: 'धनिया',
    price: 30,
    unit: '100g',
    categoryId: 'spices',
    imageUrl: 'https://images.unsplash.com/photo-1506368083636-6defb67639b2?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
];

// ═══════════════════════════════════════════════════════════════════
// SAVED LISTS (ListScreen)
// ═══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════
// HISTORY (HistoryScreen)
// ═══════════════════════════════════════════════════════════════════

export const HISTORY_SECTIONS: HistorySection[] = [
  {
    title: 'August 2025',
    data: [
      {
        id: 'h891',
        name: 'Weekly Restock',
        date: '14 Aug 2025',
        itemCount: 18,
        preview: 'Milk, Bread, Eggs, Butter, Cheese...',
      },
      {
        id: 'h762',
        name: 'Party Supplies',
        date: '02 Aug 2025',
        itemCount: 32,
        preview: 'Cold Drinks, Chips, Namkeen, Disposables...',
      },
    ],
  },
  {
    title: 'July 2025',
    data: [
      {
        id: 'h873',
        name: 'Monthly Groceries',
        date: '28 Jul 2025',
        itemCount: 45,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Tea...',
      },
      {
        id: 'h04',
        name: 'Quick Veggies',
        date: '15 Jul 2025',
        itemCount: 6,
        preview: 'Tomato, Onion, Potato, Chilli...',
      },
    ],
  },
  {
    title: 'June 2025',
    data: [
      {
        id: 'h55',
        name: 'Monthly Groceries',
        date: '29 Jun 2025',
        itemCount: 42,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Spices...',
      },
    ],
  },
  // Neeche ke 3 sections: scroll test ke liye upar ki copy (id alag)
  {
    title: 'August 2025',
    data: [
      {
        id: 'h18',
        name: 'Weekly Restock',
        date: '14 Aug 2025',
        itemCount: 18,
        preview: 'Milk, Bread, Eggs, Butter, Cheese...',
      },
      {
        id: 'h12',
        name: 'Party Supplies',
        date: '02 Aug 2025',
        itemCount: 32,
        preview: 'Cold Drinks, Chips, Namkeen, Disposables...',
      },
    ],
  },
  {
    title: 'July 2025',
    data: [
      {
        id: 'h33',
        name: 'Monthly Groceries',
        date: '28 Jul 2025',
        itemCount: 45,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Tea...',
      },
      {
        id: 'h43',
        name: 'Quick Veggies',
        date: '15 Jul 2025',
        itemCount: 6,
        preview: 'Tomato, Onion, Potato, Chilli...',
      },
    ],
  },
  {
    title: 'June 2025',
    data: [
      {
        id: 'h9',
        name: 'Monthly Groceries',
        date: '29 Jun 2025',
        itemCount: 42,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Spices...',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// NEW LIST FORM (NewListScreen)
// ═══════════════════════════════════════════════════════════════════

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