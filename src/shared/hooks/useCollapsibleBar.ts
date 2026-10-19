// src/shared/hooks/useCollapsibleBar.ts
//
// Scroll karne par search/chips bar upar slide hoke chhup jaye, upar scroll
// karte hi wapas aa jaye.
//
// Usage:
//   const { barHeight, barTranslateY, onBarLayout, handleScroll } =
//     useCollapsibleBar();
//   <CollapsibleFilterBar translateY={barTranslateY} onLayout={onBarLayout} ... />
//   <FlatList
//     onScroll={handleScroll}
//     scrollEventThrottle={16}
//     contentContainerStyle={{ paddingTop: barHeight }}
//   />

import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const ANIM_DURATION = 220;
const SHOW_AT_TOP = 4; // itna ya kam scroll => bar hamesha dikhe
const SCROLL_DELTA = 2; // itna hilne par hi direction maano

export const useCollapsibleBar = (initialHeight = 116) => {
  const [barHeight, setBarHeight] = useState(initialHeight);

  const barTranslateY = useRef(new Animated.Value(0)).current;
  const barHidden = useRef(false);
  const lastOffset = useRef(0);

  const showBar = useCallback(() => {
    if (!barHidden.current) return;
    barHidden.current = false;
    Animated.timing(barTranslateY, {
      toValue: 0,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY]);

  const hideBar = useCallback(() => {
    if (barHidden.current) return;
    barHidden.current = true;
    Animated.timing(barTranslateY, {
      toValue: -barHeight,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY, barHeight]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const diff = y - lastOffset.current;

      if (y <= SHOW_AT_TOP) {
        showBar();
      } else if (diff > SCROLL_DELTA && y > barHeight) {
        hideBar();
      } else if (diff < -SCROLL_DELTA) {
        showBar();
      }

      lastOffset.current = y;
    },
    [barHeight, showBar, hideBar],
  );

  const onBarLayout = useCallback((e: LayoutChangeEvent) => {
    setBarHeight(e.nativeEvent.layout.height);
  }, []);

  return { barHeight, barTranslateY, onBarLayout, handleScroll };
};