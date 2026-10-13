// src/theme/colors.ts

import { ColorPalette } from './types/theme.types';

// export const lightColors: ColorPalette = {
//   success: '#16a34a',
//   error: '#dc2626',
//   warning: '#d97706',
//   info: '#2563eb',
//   textMuted: '#78665C',
//   border: '#E4DDD3',

//   appBackground: '#fcf9f4',
//   headerBackground: '#fcf9f4',
//   headerContent: '#9d4300',
//   bottomTabBar: '#251913',
//   bottomTabIcon: '#BA9E91',
//   bottomTabIconActive: '#582200',
//   bottomTabIconBg: '#F97316',
//   cardBg: '#F0EDE9',
//   cardBgVariant: '#2d1e16',
//   primary: '#f97316',
//   textPrimary: '#9D4300',
//   textSecondary: '#31302D',
// };


export const lightColors: ColorPalette = {
  // semantic
  success: '#5FA77A', // skySlate.green
  error: '#D97878', // skySlate.red
  warning: '#d97706', // skySlate me nahi tha, purana rakha
  info: '#2563eb', // skySlate me nahi tha, purana rakha
  textMuted: '#71818C', // skySlate.textMuted
  border: '#DCE7EE', // skySlate.border

  // header / background
  appBackground: '#FFFFFF', // skySlate.bg
  headerBackground: '#FFFFFF',
  headerContent: '#263640', // skySlate.textPrimary (screens me header icons/title yahi the)

  // bottom tab
  bottomTabBar: '#FFFFFF',
  bottomTabIcon: '#71818C',
  bottomTabIconActive: '#263640', // skyblue pill ke upar dark icon
  bottomTabIconBg: '#87CEEB', // skyblue

  // cards
  cardBg: '#FFFFFF', // skySlate.surface
  cardBgVariant: '#F0F6FA', // skySlate.surfaceHigh

  // brand / text
  primary: '#87CEEB', // 'skyblue' ka hex (named color ki jagah hex safe hai)
  textPrimary: '#263640',
  textSecondary: '#71818C',
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