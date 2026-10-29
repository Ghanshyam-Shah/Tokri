
/**
 * Builds selected products from a source list, template, or history entry.
 *
 * Source items currently use dummy product IDs, while the catalog uses
 * real product IDs from Supabase. Products are matched by name until
 * source lists are migrated to use real catalog product IDs.
 *
 * TODO: Remove this helper once lists, templates, and history use
 * real catalog product IDs.
 */

import { Product, SelectedProduct } from '../../Data/types';
import {
  PRODUCTS as DUMMY_PRODUCTS,
  SOURCE_ITEMS,
} from '../../Data/DummyData';

export const buildSelectedFromCatalog = (
  sourceId: string | undefined,
  catalog: Product[],
): Record<string, SelectedProduct> => {
  const selectedProducts: Record<string, SelectedProduct> = {};

  if (!sourceId) {
    return selectedProducts;
  }

  const sourceItems = SOURCE_ITEMS[sourceId] ?? [];

  sourceItems.forEach(({ productId, quantity, note }) => {
    const dummyProduct = DUMMY_PRODUCTS.find(
      product => product.id === productId,
    );

    if (!dummyProduct) {
      return;
    }

    const catalogProduct = catalog.find(
      product => product.name === dummyProduct.name,
    );

    if (!catalogProduct) {
      return;
    }

    selectedProducts[catalogProduct.id] = {
      ...catalogProduct,
      quantity,
      note,
    };
  });

  return selectedProducts;
};
