// src/shared/utils/makeUseStyles.ts
//
// Theme-based styles ka cache. Har theme ke liye stylesheet sirf ek baar banti hai
// (FlatList ki har row apni stylesheet nahi banati).
//
// Use:
//   const createStyles = (theme: AppTheme) => StyleSheet.create({ ... });
//   const useStyles = makeUseStyles(createStyles);
//   const { theme, styles } = useStyles();

import { useTheme } from '../../app/providers/ThemeProvider';

export type AppTheme = ReturnType<typeof useTheme>['theme'];

export const makeUseStyles = <T extends object>(
  create: (theme: AppTheme) => T,
) => {
  const cache = new WeakMap<AppTheme, T>();

  return () => {
    const { theme } = useTheme();
    let styles = cache.get(theme);
    if (!styles) {
      styles = create(theme);
      cache.set(theme, styles);
    }
    return { theme, styles };
  };
};
