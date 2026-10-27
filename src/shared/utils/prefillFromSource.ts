// src/shared/utils/prefillFromSource.ts
//
// Old List / Template / History abhi dummy data hain (SOURCE_ITEMS dummy product ids use karta hai).
// Catalog ab Supabase se aata hai (uuid ids), isliye dummy product ko NAAM se
// real catalog product se milate hain. Lists dynamic hone par ye file hat jayegi.

import { Product, SelectedProduct } from '../../Data/types';
import { PRODUCTS as DUMMY_PRODUCTS, SOURCE_ITEMS } from '../../Data/DummyData';

export const buildSelectedFromCatalog = (
  sourceId: string | undefined,
  catalog: Product[],
): Record<string, SelectedProduct> => {
  const result: Record<string, SelectedProduct> = {};
  if (!sourceId) return result;

  (SOURCE_ITEMS[sourceId] ?? []).forEach(({ productId, quantity, note }) => {
    const dummy = DUMMY_PRODUCTS.find(p => p.id === productId);
    const real = dummy && catalog.find(p => p.name === dummy.name);
    if (real) result[real.id] = { ...real, quantity, note };
  });
  return result;
};
