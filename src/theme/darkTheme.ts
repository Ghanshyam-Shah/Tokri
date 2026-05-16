// src/theme/darkTheme.ts
// "KiranaList Dark Mode" — deep charcoal-brown + saffron accents

import { AppTheme } from './types/theme.types';
import { darkColors } from './colors';
import { typography, fontWeights, fontFamilies } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { darkShadows } from './shadows';

export const darkTheme: AppTheme = {
  dark: true,
  colors: darkColors,
  typography,
  fontWeights,
  fontFamilies,
  spacing,
  borderRadius,
  shadows: darkShadows,
};
