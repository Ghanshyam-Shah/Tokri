// src/theme/borderRadius.ts
// Design: "Soft Utility" — 16px primary radius, 8px for small elements

import { BorderRadiusScale } from './types/theme.types';

export const borderRadius: BorderRadiusScale = {
  xs: 4, // 0.25rem — micro elements
  sm: 8, // 0.5rem  — checkboxes, tags, chips
  md: 12, // 0.75rem — input fields
  lg: 16, // 1rem    — cards, buttons, main containers ← PRIMARY
  xl: 20, // 1.5rem  — bottom sheets, modals
  xxl: 24, // large modals
  full: 999, // pill buttons, chips (rounded-full)
};