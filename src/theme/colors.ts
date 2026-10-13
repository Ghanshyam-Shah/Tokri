// src/theme/colors.ts
// Light → "Kitchen Notebook Modern"
// Dark  → "KiranaList Dark Mode"

import { ColorPalette } from './types/theme.types';

export const lightColors: ColorPalette = {
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',
  textMuted: '#78665C',
  border: '#E4DDD3',

  appBackground: '#fcf9f4',
  headerBackground: '#fcf9f4',
  headerContent: '#9d4300',
  bottomTabBar: '#251913',
  bottomTabIcon: '#BA9E91',
  bottomTabIconActive: '#582200',
  bottomTabIconBg: '#F97316',
  cardBg: '#F0EDE9',
  cardBgVariant: '#2d1e16',
  primary: '#f97316',
  textPrimary: '#9D4300',
  textSecondary: '#31302D',
};

export const darkColors: ColorPalette = {
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
  textMuted: '#BA9E91',
  border: '#3a2a20',

  appBackground: '#1c110b',
  headerBackground: '#1c110b',
  headerContent: '#ffb690',
  bottomTabBar: '#FCF9F4',
  bottomTabIcon: '#78665C',
  bottomTabIconActive: '#582200',
  bottomTabIconBg: '#F97316',
  cardBg: '#291D16',
  cardBgVariant: '#2d1e16',
  primary: '#f97316',
  textPrimary: '#FFB690',
  textSecondary: '#F6DED3',
};