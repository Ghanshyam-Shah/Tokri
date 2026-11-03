// src/features/savedLists/utils/listMappers.ts
// Supabase ki ListRow ko screens ke purane types me badalta hai
// (SavedList, HistorySection, ListSource), taaki UI ka design wahi rahe.

import {
  HistorySection,
  ListSource,
  SavedList,
  ListCategory,
} from '../../../Data/types';
import { ListRow } from '../services/listsService';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "12 May 2025" */
export const formatListDate = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')} ${
    MONTHS[d.getMonth()]
  } ${d.getFullYear()}`;
};

// Draft ki date = banne ki, Completed ki date = complete hone ki
const shownDate = (r: ListRow) =>
  formatListDate(r.status === 'completed' ? r.completedAt ?? r.createdAt : r.createdAt);

const CATEGORY: Record<ListRow['listType'], ListCategory> = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  festival: 'Festival',
  custom: 'Custom',
};

export const toSavedList = (r: ListRow): SavedList => ({
  id: r.id,
  name: r.name,
  date: shownDate(r),
  itemCount: r.itemCount,
  preview: r.preview,
  category: CATEGORY[r.listType] ?? 'Custom',
  status: r.status === 'completed' ? 'Completed' : 'Draft',
});

/** Completed lists, mahine ke hisaab se (naye pehle) */
export const toHistorySections = (rows: ListRow[]): HistorySection[] => {
  const done = rows
    .filter(r => r.status === 'completed' && !r.isTemplate)
    .map(r => ({ r, when: new Date(r.completedAt ?? r.createdAt) }))
    .sort((a, b) => b.when.getTime() - a.when.getTime());

  const sections: HistorySection[] = [];
  done.forEach(({ r, when }) => {
    const title = `${MONTHS_FULL[when.getMonth()]} ${when.getFullYear()}`;
    let sec = sections.find(s => s.title === title);
    if (!sec) {
      sec = { title, data: [] };
      sections.push(sec);
    }
    sec.data.push({
      id: r.id,
      name: r.name,
      date: formatListDate(r.completedAt ?? r.createdAt),
      itemCount: r.itemCount,
      preview: r.preview,
    });
  });
  return sections;
};

/** New List screen ke "Old Lists" / "My Templates" cards */
export const toListSource = (r: ListRow, meta?: string): ListSource => ({
  id: r.id,
  name: r.name,
  itemCount: r.itemCount,
  meta: meta ?? shownDate(r),
});
