// src/theme/typography.ts
// Montserrat  → English headings (h1, h2, h3)
// Noto Sans   → English body, labels
// Noto Sans Devanagari → Hindi / bilingual text

import { TypographyScale, FontWeights, FontFamilies } from './types/theme.types';

export const typography: TypographyScale = {
  xs: 12,  // label-sm / badge text
  sm: 14,  // body-sm / secondary text
  md: 16,  // body-md / standard text
  lg: 18,  // title-sm / list item names
  xl: 20,  // h3 / section titles
  xxl: 24,  // h2 / screen headings
  xxxl: 32,  // h1 / display headings
  display: 40,  // hero / splash text
};

export const fontWeights: FontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// ── Font Linking (React Native CLI) ──────────────────────────────────────────
// android/app/src/main/assets/fonts/ folder mein ye files dalni hain:
//   Montserrat-SemiBold.ttf
//   Montserrat-Bold.ttf
//   NotoSans-Regular.ttf
//   NotoSans-Medium.ttf
//   NotoSansDevanagari-Regular.ttf   ← Hindi ke liye
//
// iOS: Info.plist mein UIAppFonts array mein add karo
// Then run: npx react-native-asset  (agar react-native.config.js setup ho)

export const fontFamilies: FontFamilies = {
  regular: 'NotoSans-Regular',           // English body text
  medium: 'NotoSans-Medium',            // English medium weight
  semiBold: 'Montserrat-SemiBold',        // English headings
  bold: 'Montserrat-Bold',            // English bold headings
  // ✅ FIX 4: Hindi/Devanagari font add kiya
  hindi: 'NotoSansDevanagari-Regular', // Hindi text — हिन्दी नाम, सब्जियां etc.
};