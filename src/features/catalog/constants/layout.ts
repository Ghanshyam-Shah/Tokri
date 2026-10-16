// src/features/catalog/constants/layout.ts
import { Dimensions } from 'react-native';

export const H_PADDING = 16;
export const CARD_GAP = 12;

const { width: SCREEN_W } = Dimensions.get('window');
export const CARD_W = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;
export const IMAGE_H = CARD_W * 0.82;