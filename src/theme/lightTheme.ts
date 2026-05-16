import { AppTheme } from './types/theme.types';
import { lightColors } from './colors';
import { typography, fontWeights, fontFamilies } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { lightShadows } from './shadows';

export const lightTheme: AppTheme = {
  dark: false,
  colors: lightColors,
  typography,
  fontWeights,
  fontFamilies,
  spacing,
  borderRadius,
  shadows: lightShadows,
};
