export interface ColorPalette {
  success: string;
  error: string;
  warning: string;
  info: string;
  textMuted: string;
  border: string;   // <- new
  appBackground: string;
  headerBackground: string;
  headerContent: string;

  bottomTabBar: string;
  bottomTabIcon: string;
  bottomTabIconActive: string;
  bottomTabIconBg: string;
  cardBg: string;
  cardBgVariant: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;

  onPrimary: string;        // primary ke upar ka text/icon
  primaryMuted: string;     // primary ka halka tint (chips, pills, selected bg)
  overlay: string;          // modal backdrop
  photoScrim: string;       // photo ke upar dark overlay (selected card)
  photoBadgeBg: string;     // photo ke upar chhota badge
  onDark: string;           // dark scrim/brand surface ke upar white icon
  whatsapp: string;         // WhatsApp brand green
  themeToggleSun: string;   // header toggle: light mode me sun
  themeToggleMoon: string;  // header toggle: dark mode me moon
}

export interface TypographyScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  display: number;
}

export interface FontWeights {
  regular: '400';
  medium: '500';
  semiBold: '600';
  bold: '700';
  extraBold: '800';
}

export interface FontFamilies {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  hindi?: string;
}

export interface SpacingScale {
  xs: number; // 4
  sm: number; // 8
  md: number; // 12
  lg: number; // 16
  xl: number; // 20
  xxl: number; // 24
  xxxl: number; // 32
  huge: number; // 48
  giant: number; // 64
}

export interface BorderRadiusScale {
  xs: number; // 4
  sm: number; // 8
  md: number; // 12
  lg: number; // 16
  xl: number; // 20
  xxl: number; // 24
  full: number; // 999
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowScale {
  none: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
}

export interface AppTheme {
  dark: boolean;
  colors: ColorPalette;
  typography: TypographyScale;
  fontWeights: FontWeights;
  fontFamilies: FontFamilies;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
}

