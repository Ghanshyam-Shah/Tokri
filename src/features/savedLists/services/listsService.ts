// src/features/savedLists/services/listsService.ts
//
// Lists Supabase me:
//   lists       -> list ka header (naam, description, type, status, date)
//   list_items  -> items ki snapshot copy (product badle/hate to list na bigde)
// Screens ko DB ke column names nahi dikhte.

import { supabase, ensureSession } from '../../../lib/supabase';
import { ListItemParam } from '../../../navigation/types/navigationTypes';
import { CatalogProduct } from '../../catalog/services/catalogService';

export type DbListStatus = 'draft' | 'active' | 'completed';
export type DbListType = 'monthly' | 'weekly' | 'festival' | 'custom';

// Lists screens ke liye summary (items ke bina)
export interface ListRow {
  id: string;
  name: string;
  description: string;
  listType: DbListType;
  status: DbListStatus;
  isTemplate: boolean;
  startDate: string | null; // 'YYYY-MM-DD'
  createdAt: string;
  completedAt: string | null;
  itemCount: number;
  preview: string; // "Milk, Rice, Atta +2"
}

export interface SaveListInput {
  id?: string; // nahi diya -> nayi list
  name: string;
  description?: string;
  listType?: DbListType;
  startDate?: string; // ISO ya 'YYYY-MM-DD'
  status: 'draft' | 'completed';
  items: ListItemParam[];
}

// ─── helpers ────────────────────────────────────────────────────────────────
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v?: string | null): v is string => !!v && UUID_RE.test(v);

const toDateOnly = (iso?: string): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

interface ItemRow {
  id: string;
  product_id: string | null;
  user_product_id: string | null;
  name: string;
  name_hindi: string | null;
  unit: string | null;
  image_url: string | null;
  category_id: string | null;
  quantity: number;
  note: string | null;
  position: number | null;
}

const PREVIEW_COUNT = 3;
const makePreview = (names: string[]) => {
  const first = names.slice(0, PREVIEW_COUNT).join(', ');
  const more = names.length - PREVIEW_COUNT;
  return more > 0 ? `${first} +${more}` : first;
};

// ─── Read ───────────────────────────────────────────────────────────────────
export const fetchLists = async (): Promise<ListRow[]> => {
  await ensureSession();
  const { data, error } = await supabase
    .from('lists')
    .select(
      'id,name,description,list_type,status,is_template,start_date,created_at,completed_at,list_items(name,position)',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((r: any): ListRow => {
    const items: { name: string; position: number | null }[] =
      r.list_items ?? [];
    const names = [...items]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(i => i.name);
    return {
      id: r.id,
      name: r.name,
      description: r.description ?? '',
      listType: r.list_type,
      status: r.status,
      isTemplate: !!r.is_template,
      startDate: r.start_date,
      createdAt: r.created_at,
      completedAt: r.completed_at,
      itemCount: items.length,
      preview: makePreview(names),
    };
  });
};

// Ek list ke items (Old List / Template / History se pre-fill ke liye)
export const fetchListItems = async (
  listId: string,
): Promise<ListItemParam[]> => {
  await ensureSession();
  const { data, error } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId)
    .order('position', { ascending: true });
  if (error) throw error;

  return ((data ?? []) as ItemRow[]).map(r => ({
    // catalog ki id wapas (taaki CreateListScreen me wahi product "selected" dikhe)
    id: r.product_id ?? r.user_product_id ?? r.id,
    name: r.name,
    nameHindi: r.name_hindi ?? '',
    unit: r.unit ?? '',
    imageUrl: r.image_url ?? undefined,
    categoryId: r.category_id ?? undefined,
    quantity: r.quantity,
    note: r.note ?? undefined,
  }));
};

// ─── Write ──────────────────────────────────────────────────────────────────
const toItemRows = (
  listId: string,
  items: ListItemParam[],
  catalog: CatalogProduct[],
) => {
  const byId = new Map(catalog.map(p => [p.id, p]));
  return items.map((it, idx) => {
    const p = byId.get(it.id);
    return {
      list_id: listId,
      product_id: p?.source === 'default' ? p.id : null,
      user_product_id: p?.source === 'user' ? p.id : null,
      name: it.name,
      name_hindi: it.nameHindi || null,
      unit: it.unit || null,
      image_url: it.imageUrl || null,
      category_id: it.categoryId ?? p?.categoryId ?? null,
      quantity: Math.max(1, it.quantity),
      note: it.note?.trim() || null,
      position: idx,
    };
  });
};

/**
 * Nayi list banao ya purani update karo. List ki id wapas milti hai.
 * - 'completed' kabhi wapas 'draft' nahi hoti (draft save se status nahi badalta).
 * - Items pehle naye insert hote hain, phir purane hatte hain, taaki beech me
 *   fail hone par list khali na ho jaye.
 */
export const saveList = async (
  input: SaveListInput,
  catalog: CatalogProduct[],
): Promise<string> => {
  await ensureSession();

  const description = input.description?.trim().slice(0, 150) || null;
  const completedNow = input.status === 'completed';
  let listId = input.id;

  if (isUuid(listId)) {
    const patch: Record<string, unknown> = {
      name: input.name,
      description,
    };
    if (completedNow) {
      patch.status = 'completed';
      patch.completed_at = new Date().toISOString();
    }
    const { error } = await supabase.from('lists').update(patch).eq('id', listId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from('lists')
      .insert({
        name: input.name,
        description,
        list_type: input.listType ?? 'monthly',
        start_date: toDateOnly(input.startDate),
        status: input.status,
        completed_at: completedNow ? new Date().toISOString() : null,
      })
      .select('id')
      .single();
    if (error) throw error;
    listId = data.id as string;
  }

  const rows = toItemRows(listId as string, input.items, catalog);
  let keepIds: string[] = [];
  if (rows.length > 0) {
    const { data, error } = await supabase
      .from('list_items')
      .insert(rows)
      .select('id');
    if (error) throw error;
    keepIds = (data ?? []).map((r: { id: string }) => r.id);
  }

  let del = supabase.from('list_items').delete().eq('list_id', listId as string);
  if (keepIds.length > 0) del = del.not('id', 'in', `(${keepIds.join(',')})`);
  const { error: delErr } = await del;
  if (delErr) throw delErr;

  return listId as string;
};

// Template = list ki copy (is_template = true). Original list waisi hi rehti hai.
export const saveAsTemplate = async (
  listId: string,
  name?: string,
): Promise<string> => {
  await ensureSession();
  const { data: src, error: e1 } = await supabase
    .from('lists')
    .select('name,description,list_type')
    .eq('id', listId)
    .single();
  if (e1) throw e1;

  const { data: created, error: e2 } = await supabase
    .from('lists')
    .insert({
      name: name?.trim() || src.name,
      description: src.description,
      list_type: src.list_type,
      status: 'draft',
      is_template: true,
    })
    .select('id')
    .single();
  if (e2) throw e2;

  const { data: items, error: e3 } = await supabase
    .from('list_items')
    .select(
      'product_id,user_product_id,name,name_hindi,unit,image_url,category_id,quantity,note,position',
    )
    .eq('list_id', listId);
  if (e3) throw e3;

  if (items && items.length > 0) {
    const { error: e4 } = await supabase
      .from('list_items')
      .insert(items.map(i => ({ ...i, list_id: created.id })));
    if (e4) throw e4;
  }
  return created.id as string;
};

export const deleteList = async (listId: string): Promise<void> => {
  await ensureSession();
  const { error } = await supabase.from('lists').delete().eq('id', listId);
  if (error) throw error;
};
