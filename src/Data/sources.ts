// src/Data/sources.ts
// Items inside old lists / templates / history (pre-fill CreateListScreen)

import { SelectedProduct, SourceItem } from './types';
import { PRODUCTS } from './catalog';

const MONTHLY: SourceItem[] = [
  { productId: '1', quantity: 2 },
  { productId: '2', quantity: 4, note: 'Full cream' },
  { productId: '3', quantity: 1, note: 'India Gate brand lena' },
  { productId: '4', quantity: 2 },
  { productId: '9', quantity: 1 },
];

const PARTY: SourceItem[] = [
  { productId: '6', quantity: 3 },
  { productId: '7', quantity: 2 },
  { productId: '10', quantity: 1 },
];

const VEGGIES: SourceItem[] = [
  { productId: '1', quantity: 2 },
  { productId: '5', quantity: 1 },
  { productId: '8', quantity: 2 },
];

export const SOURCE_ITEMS: Record<string, SourceItem[]> = {
  // Old Lists (SAVED_LISTS)
  '1': MONTHLY,
  '3': [
    { productId: '3', quantity: 2 },
    { productId: '4', quantity: 1 },
    { productId: '9', quantity: 2 },
    { productId: '10', quantity: 1 },
  ],
  '4': VEGGIES,

  // My Templates
  'tpl-1': MONTHLY,
  'tpl-2': PARTY,

  // History (Reuse)
  h891: [
    { productId: '2', quantity: 3 },
    { productId: '7', quantity: 1 },
  ],
  h762: PARTY,
  h873: MONTHLY,
  h04: VEGGIES,
  h55: MONTHLY,
  h18: [
    { productId: '2', quantity: 3 },
    { productId: '7', quantity: 1 },
  ],
  h12: PARTY,
  h33: MONTHLY,
  h43: VEGGIES,
  h9: MONTHLY,
};

/** sourceId -> CreateListScreen ke selectedProducts ka format */
export const buildSelectedFromSource = (
  sourceId?: string,
): Record<string, SelectedProduct> => {
  const result: Record<string, SelectedProduct> = {};
  if (!sourceId) return result;

  (SOURCE_ITEMS[sourceId] ?? []).forEach(({ productId, quantity, note }) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      result[product.id] = { ...product, quantity, note };
    }
  });
  return result;
};
