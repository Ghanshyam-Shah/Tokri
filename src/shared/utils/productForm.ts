// src/features/catalog/utils/productForm.ts
// AddItem / EditItem ke form helpers (validation + unit parsing)

export interface FormError {
  title: string;
  message: string;
}

interface FormValues {
  name: string;
  nameHindi: string;
  selectedCategory: string | null;
  price: string;
  quantity: string;
}

// Pehli galti return karta hai, sab theek ho to null
export const validateProductForm = ({
  name,
  nameHindi,
  selectedCategory,
  price,
  quantity,
}: FormValues): FormError | null => {
  if (!name.trim()) {
    return { title: 'Name zaroori hai', message: 'Product ka naam daalein pehle.' };
  }
  if (!nameHindi.trim()) {
    return {
      title: 'Hindi name zaroori hai',
      message: 'Product ka Hindi naam daalein pehle.',
    };
  }
  if (!selectedCategory) {
    return { title: 'Category zaroori hai', message: 'Ek category select karein.' };
  }
  if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
    return { title: 'Price zaroori hai', message: 'Product ki sahi price daalein.' };
  }
  if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    return {
      title: 'Quantity zaroori hai',
      message: 'Product ki sahi quantity daalein.',
    };
  }
  return null;
};

// "500g" -> { qty: "500", unitType: "g" }; parse na ho to 1/kg
export const parseUnit = (unitStr: string): { qty: string; unitType: string } => {
  const match = unitStr.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (match) return { qty: match[1], unitType: match[2] };
  return { qty: '1', unitType: 'kg' };
};
