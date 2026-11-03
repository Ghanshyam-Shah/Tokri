// src/shared/utils/prefillFromSource.ts
//
// Saved list (Supabase) ke items ko CreateListScreen ke selection me badalna.

import { Product, SelectedProduct } from '../../Data/types';
import { ListItemParam } from '../../navigation/types/navigationTypes';

/**
 * Supabase me saved list ke items -> CreateListScreen ka selection.
 * Product ab bhi catalog me hai to wahi use hota hai (taaki card "selected" dikhe),
 * hata diya gaya ho to list me save hui snapshot se bana dete hain.
 */
export const buildSelectedFromItems = (
  items: ListItemParam[],
  catalog: Product[],
): Record<string, SelectedProduct> => {
  const result: Record<string, SelectedProduct> = {};
  items.forEach(it => {
    const real = catalog.find(p => p.id === it.id);
    result[it.id] = real
      ? { ...real, quantity: it.quantity, note: it.note }
      : {
          id: it.id,
          name: it.name,
          nameHindi: it.nameHindi,
          categoryId: it.categoryId ?? '',
          unit: it.unit,
          price: 0,
          imageUrl: it.imageUrl,
          isTopPick: false,
          createdAt: 0,
          quantity: it.quantity,
          note: it.note,
        };
  });
  return result;
};
