// src/features/catalog/services/catalogService.ts
//
// Catalog = default products + user ke badlav (overlay), Supabase se.
//   products       -> default catalog (sabke liye, sirf padhna)
//   user_products  -> user ke naye products / default ke edit / hide
// Screens ko DB ke column names nahi dikhte: yahan `Product` / `Category` type me badal dete hain.

import { supabase, ensureSession } from '../../../lib/supabase';
import { Product, Category } from '../../../Data/types';

// Product + ye pata ki wo default hai ya user ka, aur uska override row (agar hai)
export interface CatalogProduct extends Product {
  source: 'default' | 'user';
  userProductId?: string; // user_products.id (user ka naya product ya default ka override)
}

// Add / Edit form se aane wala data
export interface ProductInput {
  name: string;
  nameHindi: string;
  unit: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  isTopPick: boolean;
}

// ─── DB row types ──────────────────────────────────────────────────────────
interface CategoryRow {
  id: string;
  label: string;
  label_hindi: string | null;
  icon: string | null;
}
interface ProductRow {
  id: string;
  name: string;
  name_hindi: string | null;
  unit: string;
  price: number | string;
  category_id: string | null;
  image_url: string | null;
  is_top_pick: boolean;
  created_at: string;
}
interface UserProductRow {
  id: string;
  product_id: string | null;
  name: string | null;
  name_hindi: string | null;
  unit: string | null;
  price: number | string | null;
  category_id: string | null;
  image_url: string | null;
  is_top_pick: boolean | null;
  hidden: boolean;
  created_at: string;
}

// "All" chip DB me nahi hota, UI ka hai
const ALL_CATEGORY = {
  id: 'all',
  label: 'All',
  labelHindi: 'सभी',
  icon: 'view-grid',
} as Category;

// ─── Read ──────────────────────────────────────────────────────────────────
export const fetchCategories = async (): Promise<Category[]> => {
  await ensureSession();
  const { data, error } = await supabase
    .from('categories')
    .select('id,label,label_hindi,icon')
    .order('sort_order', { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as CategoryRow[];
  return [
    ALL_CATEGORY,
    ...rows.map(
      r =>
        ({
          id: r.id,
          label: r.label,
          labelHindi: r.label_hindi ?? r.label,
          icon: r.icon ?? 'tag-outline',
        } as Category),
    ),
  ];
};

export const fetchProducts = async (): Promise<CatalogProduct[]> => {
  await ensureSession();
  const [prodRes, userRes] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: true }),
    supabase.from('user_products').select('*'),
  ]);
  if (prodRes.error) throw prodRes.error;
  if (userRes.error) throw userRes.error;

  const defaults = (prodRes.data ?? []) as ProductRow[];
  const mine = (userRes.data ?? []) as UserProductRow[];

  // default product id -> user ka override row
  const overrides = new Map<string, UserProductRow>();
  mine.forEach(r => {
    if (r.product_id) overrides.set(r.product_id, r);
  });

  const fromDefaults: CatalogProduct[] = defaults
    .filter(p => !overrides.get(p.id)?.hidden)
    .map(p => {
      const o = overrides.get(p.id);
      return {
        id: p.id,
        name: o?.name ?? p.name,
        nameHindi: o?.name_hindi ?? p.name_hindi ?? '',
        price: Number(o?.price ?? p.price),
        unit: o?.unit ?? p.unit,
        categoryId: o?.category_id ?? p.category_id ?? '',
        imageUrl: o?.image_url ?? p.image_url ?? '',
        isTopPick: o?.is_top_pick ?? p.is_top_pick,
        createdAt: Date.parse(p.created_at),
        source: 'default',
        userProductId: o?.id,
      } as CatalogProduct;
    });

  const fromUser: CatalogProduct[] = mine
    .filter(r => !r.product_id && !r.hidden)
    .map(r => ({
      id: r.id,
      name: r.name ?? '',
      nameHindi: r.name_hindi ?? '',
      price: Number(r.price ?? 0),
      unit: r.unit ?? '',
      categoryId: r.category_id ?? '',
      imageUrl: r.image_url ?? '',
      isTopPick: r.is_top_pick ?? false,
      createdAt: Date.parse(r.created_at),
      source: 'user',
      userProductId: r.id,
    } as CatalogProduct));

  return [...fromUser, ...fromDefaults];
};

// ─── Write (AddItem / EditItem / delete) ───────────────────────────────────
const toRow = (i: ProductInput) => ({
  name: i.name,
  name_hindi: i.nameHindi,
  unit: i.unit,
  price: i.price,
  category_id: i.categoryId,
  image_url: i.imageUrl || null,
  is_top_pick: i.isTopPick,
});

// AddItem: user ka naya product
export const createProduct = async (input: ProductInput): Promise<void> => {
  await ensureSession();
  const { error } = await supabase.from('user_products').insert(toRow(input));
  if (error) throw error;
};

// EditItem: user ka apna product -> seedha update.
// Default product -> user ke liye override row (naya ya purana update).
export const updateProduct = async (
  product: CatalogProduct,
  input: ProductInput,
): Promise<void> => {
  await ensureSession();
  const row = toRow(input);
  const oldImage = product.imageUrl;

  if (product.userProductId) {
    const { error } = await supabase
      .from('user_products')
      .update(row)
      .eq('id', product.userProductId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_products')
      .insert({ ...row, product_id: product.id });
    if (error) throw error;
  }

  // photo badli ya hata di -> purani photo Storage se hatao (agar kahin use nahi ho rahi)
  if (oldImage && oldImage !== input.imageUrl) await removeImageIfUnused(oldImage);
};

// Delete: user ka apna product -> row hatao.
// Default product -> sirf is user ke liye hide (baaki users ko dikhta rahega).
export const deleteProduct = async (product: CatalogProduct): Promise<void> => {
  await ensureSession();

  if (product.source === 'user') {
    const { error } = await supabase
      .from('user_products')
      .delete()
      .eq('id', product.id);
    if (error) throw error;
    // product gaya -> uski photo bhi (agar kisi list me use nahi ho rahi)
    await removeImageIfUnused(product.imageUrl);
    return;
  }

  if (product.userProductId) {
    const { error } = await supabase
      .from('user_products')
      .update({ hidden: true })
      .eq('id', product.userProductId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_products')
      .insert({ product_id: product.id, hidden: true });
    if (error) throw error;
  }
};

// ─── Categories (AddItem ka "Add Category") ────────────────────────────────
// User ki apni category: categories table me user_id ke saath save hoti hai.
export const createCategory = async (label: string): Promise<string> => {
  const user = await ensureSession();
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: user.id,
      label,
      label_hindi: label,
      icon: 'tag-outline',
      sort_order: 100,
    })
    .select('id')
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
};

// ─── Product photo -> Supabase Storage ─────────────────────────────────────
// Image picker se local file ( file:///... ) milti hai; use bucket me upload karke
// public URL milta hai, wahi products table me save hota hai.
export const isLocalUri = (uri: string) => !!uri && !/^https?:\/\//i.test(uri);

export const uploadProductImage = async (localUri: string): Promise<string> => {
  const user = await ensureSession();

  const res = await fetch(localUri);
  const buffer = await res.arrayBuffer();

  const isPng = /\.png(\?|$)/i.test(localUri);
  const ext = isPng ? 'png' : 'jpg';
  const path = `${user.id}/${Date.now()}.${ext}`; // pehla folder = user id (storage policy)

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType: isPng ? 'image/png' : 'image/jpeg' });
  if (error) throw error;

  return supabase.storage.from('product-images').getPublicUrl(path).data
    .publicUrl;
};

// Form ka imageUri -> DB ke liye url: khali ho to '', local ho to upload, http ho to wahi
export const resolveImageUrl = async (uri: string | null): Promise<string> => {
  if (!uri) return '';
  return isLocalUri(uri) ? uploadProductImage(uri) : uri;
};

// ─── Photo cleanup (Storage me bachi photos) ───────────────────────────────
// Photo tabhi hatti hai jab koi bhi cheez use use na kar rahi ho:
//   user_products.image_url (products) aur list_items.image_url (lists ki snapshot).
// Shak ho (query fail) to photo NAHI hatti.
const BUCKET = 'product-images';

// public URL -> bucket ke andar ka path ("<user_id>/<time>.jpg"). Bucket ka nahi to null
// (jaise default products ke unsplash links).
const pathFromUrl = (url?: string | null): string | null => {
  if (!url) return null;
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return null;
  return decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
};

const isImageUsed = async (url: string): Promise<boolean> => {
  const [a, b] = await Promise.all([
    supabase
      .from('user_products')
      .select('id', { count: 'exact', head: true })
      .eq('image_url', url),
    supabase
      .from('list_items')
      .select('id', { count: 'exact', head: true })
      .eq('image_url', url),
  ]);
  if (a.error || b.error) return true; // doubt me file mat hatao
  return (a.count ?? 0) > 0 || (b.count ?? 0) > 0;
};

export const removeImageIfUnused = async (
  url?: string | null,
): Promise<void> => {
  try {
    const path = pathFromUrl(url);
    if (!url || !path) return;
    if (await isImageUsed(url)) return;
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // cleanup fail ho to koi baat nahi, agli sweep me hat jayegi
  }
};

// Purani bachi photos (jaise upload ke baad save fail ho gaya) ek baar saaf karo.
// Sirf 24 ghante se purani files, taaki abhi upload hui photo na hate.
const SWEEP_MAX = 50;
const DAY_MS = 24 * 60 * 60 * 1000;
let sweptFor: string | null = null;

export const sweepOrphanImagesOnce = async (): Promise<number> => {
  try {
    const user = await ensureSession();
    if (sweptFor === user.id) return 0;
    sweptFor = user.id;

    const { data: files, error } = await supabase.storage
      .from(BUCKET)
      .list(user.id, { limit: 100 });
    if (error || !files) return 0;

    const old = files
      .filter(f => f.name && f.created_at && Date.now() - Date.parse(f.created_at) > DAY_MS)
      .slice(0, SWEEP_MAX);

    const orphans: string[] = [];
    for (const f of old) {
      const path = `${user.id}/${f.name}`;
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      if (!(await isImageUsed(url))) orphans.push(path);
    }
    if (orphans.length > 0) {
      await supabase.storage.from(BUCKET).remove(orphans);
    }
    return orphans.length;
  } catch {
    return 0;
  }
};
