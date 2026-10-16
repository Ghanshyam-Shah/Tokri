// src/features/catalog/hooks/useCollapsibleBar.ts
//
// Scroll karne par search+chips bar upar chhup jata hai, upar scroll karne par
// wapas aata hai. Bar absolute overlay hai, isliye list ko `paddingTop: barHeight`
// dena zaroori hai (screen me diya hua hai).

import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export const useCollapsibleBar = (initialHeight = 116) => {
  const [barHeight, setBarHeight] = useState(initialHeight);
  const barTranslateY = useRef(new Animated.Value(0)).current;
  const barHidden = useRef(false);
  const lastOffset = useRef(0);

  const onBarLayout = useCallback((e: LayoutChangeEvent) => {
    setBarHeight(e.nativeEvent.layout.height);
  }, []);

  const showBar = useCallback(() => {
    if (!barHidden.current) return;
    barHidden.current = false;
    Animated.timing(barTranslateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY]);

  const hideBar = useCallback(() => {
    if (barHidden.current) return;
    barHidden.current = true;
    Animated.timing(barTranslateY, {
      toValue: -barHeight,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY, barHeight]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const diff = y - lastOffset.current;

      if (y <= 4) {
        showBar();
      } else if (diff > 2 && y > barHeight) {
        hideBar();
      } else if (diff < -2) {
        showBar();
      }

      lastOffset.current = y;
    },
    [barHeight, showBar, hideBar],
  );

  return { barHeight, barTranslateY, onBarLayout, handleScroll };
};