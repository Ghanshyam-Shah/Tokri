// src/theme/shadows.ts
// Light mode: warm saffron-tinted shadows
// Dark mode:  tonal elevation + saffron glow on active

import { ShadowScale } from './types/theme.types';

// ── Light mode ─────────────────────────────────────────────────────────────
export const lightShadows: ShadowScale = {
  none: {
    // ✅ FIX 2: 'transparent' → '#00000000' — Android crash avoid karne ke liye
    shadowColor: '#00000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#9d4300', // saffron tint — warm paper feel
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#9d4300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#9d4300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#9d4300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
};

// ── Dark mode ──────────────────────────────────────────────────────────────
// Depth = surface color shifts, not shadows
// Active/focused = saffron glow (lg, xl)
export const darkShadows: ShadowScale = {
  none: {
    // ✅ FIX 2: 'transparent' → '#00000000'
    shadowColor: '#00000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    // Saffron glow — active states
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};