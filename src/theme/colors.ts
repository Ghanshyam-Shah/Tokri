// // src/theme/colors.ts

// import { ColorPalette } from './types/theme.types';

// export const lightColors: ColorPalette = {
//   // semantic
//   success: '#5FA77A',
//   error: '#D97878',
//   warning: '#d97706',
//   info: '#2563eb',
//   textMuted: '#71818C',
//   border: '#DCE7EE',

//   // header / background
//   appBackground: '#FFFFFF',
//   headerBackground: '#FFFFFF',
//   headerContent: '#263640',

//   // bottom tab
//   bottomTabBar: '#FFFFFF',
//   bottomTabIcon: '#71818C',
//   bottomTabIconActive: '#263640', // skyblue pill ke upar dark icon (pehle #87CEEB tha = invisible)
//   bottomTabIconBg: '#87CEEB',

//   // cards
//   cardBg: '#FFFFFF',
//   cardBgVariant: '#F0F6FA',

//   // brand / text
//   primary: '#87CEEB',
//   textPrimary: '#263640',
//   textSecondary: '#71818C',

//   // ── naye tokens ──
//   onPrimary: '#FFFFFF',
//   primaryMuted: '#EAF4FA',
//   overlay: 'rgba(0,0,0,0.5)',
//   photoScrim: 'rgba(0,0,0,0.32)',
//   photoBadgeBg: 'rgba(0,0,0,0.55)',
//   onDark: '#FFFFFF',
//   whatsapp: '#25D366',
//   themeToggleSun: '#FCD34D',
//   themeToggleMoon: '#818CF8',
// };

// export const darkColors: ColorPalette = {
//   success: '#4ade80',
//   error: '#f87171',
//   warning: '#fbbf24',
//   info: '#60a5fa',
//   textMuted: '#BA9E91',
//   border: '#3a2a20',

//   appBackground: '#1c110b',
//   headerBackground: '#1c110b',
//   headerContent: '#ffb690',
//   bottomTabBar: '#FCF9F4',
//   bottomTabIcon: '#78665C',
//   bottomTabIconActive: '#582200',
//   bottomTabIconBg: '#F97316',
//   cardBg: '#291D16',
//   cardBgVariant: '#2d1e16',
//   primary: '#f97316',
//   textPrimary: '#FFB690',
//   textSecondary: '#F6DED3',

//   // ── naye tokens ──
//   onPrimary: '#582200',
//   primaryMuted: '#2d1800',
//   overlay: 'rgba(0,0,0,0.6)',
//   photoScrim: 'rgba(0,0,0,0.32)',
//   photoBadgeBg: 'rgba(0,0,0,0.55)',
//   onDark: '#FFFFFF',
//   whatsapp: '#25D366',
//   themeToggleSun: '#FCD34D',
//   themeToggleMoon: '#818CF8',
// };



import { ColorPalette } from './types/theme.types';

/* ═════════════════════════════════ Light Theme Colors ═════════════════════════════════ */

export const lightColors: ColorPalette = {
  // semantic
  success: '#5FA77A',
  error: '#D97878',
  warning: '#d97706',
  info: '#2563eb',
  textMuted: '#71818C',
  border: '#DCE7EE',

  // header / background
  appBackground: '#FFFFFF',
  headerBackground: '#FFFFFF',
  headerContent: '#263640',

  // bottom tab
  bottomTabBar: '#FFFFFF',
  bottomTabIcon: '#71818C',
  bottomTabIconActive: '#263640',
  bottomTabIconBg: '#87CEEB',

  // cards
  cardBg: '#FFFFFF',
  cardBgVariant: '#F0F6FA',

  // brand / text
  primary: '#87CEEB',
  textPrimary: '#263640',
  textSecondary: '#71818C',

  // additional tokens
  onPrimary: '#FFFFFF',
  primaryMuted: '#EAF4FA',
  overlay: 'rgba(0,0,0,0.5)',
  photoScrim: 'rgba(0,0,0,0.32)',
  photoBadgeBg: 'rgba(0,0,0,0.55)',
  onDark: '#FFFFFF',
  whatsapp: '#25D366',
  themeToggleSun: '#FCD34D',
  themeToggleMoon: '#818CF8',
};

/* ═════════════════════════════════ Dark Theme Colors ═════════════════════════════════ */

export const darkColors: ColorPalette = {
  // semantic
  success: '#5FA77A',
  error: '#D97878',
  warning: '#d97706',
  info: '#2563eb',
  textMuted: '#71818C',
  border: '#3D5968',

  // header / background
  appBackground: '#263640',
  headerBackground: '#263640',
  headerContent: '#FFFFFF',

  // bottom tab
  bottomTabBar: '#263640',
  bottomTabIcon: '#BACDD6',
  // bottomTabIconActive: '#263640',    abhi ke liye comment he
  bottomTabIconActive: '#BACDD6',   // ye abhi ke liye lagaya he
  bottomTabIconBg: '#87CEEB',

  // cards
  cardBg: '#304550',
  cardBgVariant: '#3A5260',

  // brand / text
  primary: '#87CEEB',
  textPrimary: '#FFFFFF',
  textSecondary: '#BACDD6',

  // additional tokens
  onPrimary: '#263640',
  primaryMuted: '#344F5D',
  overlay: 'rgba(0,0,0,0.65)',
  photoScrim: 'rgba(0,0,0,0.4)',
  photoBadgeBg: 'rgba(0,0,0,0.65)',
  onDark: '#FFFFFF',
  whatsapp: '#25D366',
  themeToggleSun: '#FCD34D',
  themeToggleMoon: '#818CF8',
};
