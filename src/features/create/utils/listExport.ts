// src/features/create/utils/listExport.ts
// Export ke chhote helpers (permission, file uri, file name, PDF html)

import { Platform, PermissionsAndroid } from 'react-native';
import { lightColors } from '../../../theme/colors';
import { SelectedP } from '../constants/listDefaults';

// Android 9 aur purane: gallery me save karne ke liye runtime permission chahiye.
// Android 10+ par permission nahi lagti.
export const ensureAndroidSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || Number(Platform.Version) >= 29) return true;
  const res = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  return res === PermissionsAndroid.RESULTS.GRANTED;
};

export const toFileUri = (path: string) =>
  path.startsWith('file://') ? path : `file://${path}`;

// "My List: May/2025" -> "My List May2025" (file name me safe)
export const safeFileName = (name: string) =>
  name.replace(/[^\w\- ]+/g, '').trim() || 'list';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Export / download ki taareekh: "28 Oct 2026"
export const formatExportDate = (d: Date = new Date()) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

// PDF html me user ka text safe rakhne ke liye ( & < > " )
const escapeHtml = (t: string) =>
  t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Share ke liye plain text
export const buildPlainText = (
  items: SelectedP[],
  listName: string,
  description?: string,
) => {
  const lines = items.map((it, idx) => {
    const notePart = it.note ? `  (${it.note})` : '';
    return `${idx + 1}. ${it.name} / ${it.nameHindi} — ${it.quantity} × ${it.unit}${notePart}`;
  });
  const desc = description?.trim() ? `${description.trim()}\n` : '';
  return `🛒 ${listName}\n${formatExportDate()} • ${items.length} items\n${desc}\n${lines.join('\n')}\n\nTotal items: ${items.length}`;
};

// PDF ek document hai (UI nahi), isliye uske colors theme se nahi aate
export const buildPdfHtml = (
  items: SelectedP[],
  listName: string,
  description?: string,
) => {
  const pdfCell = `padding:8px;border-bottom:1px solid ${lightColors.border};`;
  const pdfHead = `padding:8px;text-align:left;`;

  const rowsHtml = items
    .map(
      (it, idx) => `
  <tr>
    <td style="${pdfCell}">${idx + 1}</td>
    <td style="${pdfCell}">${escapeHtml(it.name)} (${escapeHtml(it.nameHindi)})</td>
    <td style="${pdfCell}">${it.unit}</td>
    <td style="${pdfCell}">${it.quantity}</td>
    <td style="${pdfCell}">${escapeHtml(it.note ?? '')}</td>
  </tr>`,
    )
    .join('');

  return `
  <html><body style="font-family:sans-serif;padding:16px;color:${lightColors.textPrimary};">
    <h2 style="margin:0 0 4px 0;">${escapeHtml(listName)}</h2>
    <div style="color:${lightColors.textMuted};font-size:13px;margin-bottom:${description?.trim() ? '8px' : '16px'};">${items.length} items &bull; ${formatExportDate()}</div>
    ${description?.trim() ? `<p style="margin:0 0 16px 0;font-size:14px;">${escapeHtml(description.trim())}</p>` : ''}
    <table style="width:100%;border-collapse:collapse;">
      <tr style="background:${lightColors.cardBgVariant};">
        <th style="${pdfHead}">#</th>
        <th style="${pdfHead}">Item</th>
        <th style="${pdfHead}">Unit</th>
        <th style="${pdfHead}">Qty</th>
        <th style="${pdfHead}">Note</th>
      </tr>
      ${rowsHtml}
    </table>
  </body></html>`;
};
