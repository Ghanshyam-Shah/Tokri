// src/theme/spacing.ts
// 4px base grid — design system se liya gaya

import { SpacingScale } from './types/theme.types';

export const spacing: SpacingScale = {
  xs: 4, // xs: 4px  (design: xs)
  sm: 8, // sm: 8px  (design: sm / xs)
  md: 12, // md: 12px (design: sm)
  lg: 16, // lg: 16px (design: md / gutter)
  xl: 20, // xl: 20px (design: container-margin)
  xxl: 24, // xxl: 24px (design: lg)
  xxxl: 32, // xxxl: 32px (design: xl)
  huge: 48, // touch-target minimum height
  giant: 64,
};
