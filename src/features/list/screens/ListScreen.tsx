
import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

const H_PADDING = 16;

type ListStatus = 'Draft' | 'Completed';
type ListCategory = 'Monthly' | 'Weekly' | 'Festival' | 'Custom';

interface SavedList {
  id: string;
  name: string;
  date: string;
  itemCount: number;
  preview: string;
  category: ListCategory;
  status: ListStatus;
}

const MOCK_LISTS: SavedList[] = [
  {
    id: '1',
    name: 'May 2025 Groceries',
    date: '12 May 2025',
    itemCount: 34,
    preview: 'Tomatoes, Rice, Paneer, Milk, Dal...',
    category: 'Monthly',
    status: 'Completed',
  },
  {
    id: '2',
    name: 'Weekend Party Snacks',
    date: '08 May 2025',
    itemCount: 12,
    preview: 'Chips, Coke, Cookies, Namkeen...',
    category: 'Custom',
    status: 'Draft',
  },
  {
    id: '3',
    name: 'Diwali Special',
    date: '01 Nov 2024',
    itemCount: 45,
    preview: 'Ghee, Sugar, Dry Fruits, Maida...',
    category: 'Festival',
    status: 'Completed',
  },
  {
    id: '4',
    name: 'Weekly Veggies',
    date: '28 Apr 2025',
    itemCount: 8,
    preview: 'Onion, Potato, Cabbage, Carrot...',
    category: 'Weekly',
    status: 'Completed',
  },
  {
    id: '5',
    name: 'May 2025 Groceries',
    date: '12 May 2025',
    itemCount: 34,
    preview: 'Tomatoes, Rice, Paneer, Milk, Dal...',
    category: 'Monthly',
    status: 'Completed',
  },
  {
    id: '6',
    name: 'Weekend Party Snacks',
    date: '08 May 2025',
    itemCount: 12,
    preview: 'Chips, Coke, Cookies, Namkeen...',
    category: 'Custom',
    status: 'Draft',
  },
  {
    id: '7',
    name: 'Diwali Special',
    date: '01 Nov 2024',
    itemCount: 45,
    preview: 'Ghee, Sugar, Dry Fruits, Maida...',
    category: 'Festival',
    status: 'Completed',
  },
  {
    id: '8',
    name: 'Weekly Veggies',
    date: '28 Apr 2025',
    itemCount: 8,
    preview: 'Onion, Potato, Cabbage, Carrot...',
    category: 'Weekly',
    status: 'Completed',
  },
];

const FILTERS = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'Monthly', label: 'Monthly', labelHindi: 'मासिक' },
  { id: 'Weekly', label: 'Weekly', labelHindi: 'साप्ताहिक' },
  { id: 'Festival', label: 'Festival', labelHindi: 'त्योहार' },
  { id: 'Drafts', label: 'Drafts', labelHindi: 'ड्राफ्ट' },
];

// ─── Category Chips: Catalog jaisi styling ──────────────────────────────

const FilterChips = React.memo(
  ({
    selected,
    onSelect,
  }: {
    selected: string;
    onSelect: (id: string) => void;
  }) => {
    const { theme } = useTheme();
    const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

    const styles = useMemo(
      () =>
        StyleSheet.create({
          scrollStyle: {
            flexGrow: 0,
            flexShrink: 0,
          },
          row: {
            flexDirection: 'row',
            gap: spacing.sm,
            paddingHorizontal: H_PADDING,
            paddingVertical: spacing.xs,
          },
          chip: {
            flexShrink: 0,
            paddingHorizontal: spacing.md + 2,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
            borderWidth: 1,
          },
          active: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
          inactive: {
            borderColor: colors.border,
          },
          text: {
            fontSize: typography.xs + 1,
            fontFamily: fontFamilies.medium,
          },
        }),
      [colors, spacing, borderRadius, typography, fontFamilies],
    );

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scrollStyle}
      >
        {FILTERS.map(filter => {
          const active = selected === filter.id;

          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onSelect(filter.id)}
              activeOpacity={0.8}
              style={[
                styles.chip,
                active ? styles.active : styles.inactive,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: active
                      ? colors.onPrimary
                      : colors.textMuted,
                  },
                ]}
                numberOfLines={1}
              >
                {filter.label} / {filter.labelHindi}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  },
);

// ─── Main Component ─────────────────────────────────────────────────────

const ListScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [barHeight, setBarHeight] = useState(116);

  const barTranslateY = useRef(new Animated.Value(0)).current;
  const barHidden = useRef(false);
  const lastOffset = useRef(0);

  // Search + category filtering
  const filteredLists = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return MOCK_LISTS.filter(list => {
      const categoryMatches =
        activeFilter === 'all' ||
        (activeFilter === 'Drafts'
          ? list.status === 'Draft'
          : list.category === activeFilter);

      const searchMatches =
        list.name.toLowerCase().includes(query) ||
        list.preview.toLowerCase().includes(query) ||
        list.category.toLowerCase().includes(query) ||
        list.date.toLowerCase().includes(query) ||
        list.status.toLowerCase().includes(query);

      return categoryMatches && searchMatches;
    });
  }, [searchQuery, activeFilter]);

  // Catalog jaisa collapsible search + chips bar
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
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
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

  const renderListCard = ({ item }: { item: SavedList }) => {
    const isDraft = item.status === 'Draft';

    return (
      <TouchableOpacity activeOpacity={0.85} style={styles.card}>
        <View style={styles.cardIconWrap}>
          <Icon
            name={
              isDraft
                ? 'file-document-edit-outline'
                : 'calendar-check-outline'
            }
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.cardMetaRow}>
            <Icon
              name="calendar-outline"
              size={12}
              color={colors.textMuted}
            />
            <Text style={styles.cardMetaText}>{item.date}</Text>

            <View style={styles.dot} />

            <Text style={styles.cardMetaText}>
              {item.itemCount} Items
            </Text>

            {isDraft && (
              <>
                <View style={styles.dot} />
                <Text style={styles.draftText}>Draft</Text>
              </>
            )}
          </View>

          <Text style={styles.cardPreview} numberOfLines={1}>
            {item.preview}
          </Text>
        </View>

        <View style={styles.cardArrow}>
          <Icon
            name="chevron-right"
            size={20}
            color={colors.textMuted}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Icon
          name="basket-off-outline"
          size={48}
          color={colors.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>No Lists Found</Text>

      <Text style={styles.emptySub}>
        {searchQuery.trim()
          ? `No lists found for '${searchQuery.trim()}'.`
          : activeFilter === 'all'
            ? "You haven't created any shopping lists yet."
            : `No lists found for '${activeFilter}'.`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <AppHeader title="Saved Lists" />

      <View style={styles.body}>
        {/* Search bar + category chips */}
        <Animated.View
          onLayout={event =>
            setBarHeight(event.nativeEvent.layout.height)
          }
          style={[
            styles.collapsibleBar,
            { transform: [{ translateY: barTranslateY }] },
          ]}
        >
          <View style={styles.searchWrap}>
            <Icon
              name="magnify"
              size={20}
              color={colors.textMuted}
              style={styles.searchIcon}
            />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search lists / सूची खोजें..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                activeOpacity={0.75}
              >
                <Icon
                  name="close-circle"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          <FilterChips
            selected={activeFilter}
            onSelect={setActiveFilter}
          />
        </Animated.View>

        {/* Saved lists */}
        <FlatList
          data={filteredLists}
          keyExtractor={item => item.id}
          renderItem={renderListCard}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: barHeight,
              paddingBottom: 100,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────

const createStyles = (theme: Theme) => {
  const {
    colors,
    spacing,
    borderRadius,
    shadows,
    typography,
    fontFamilies,
  } = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },

    body: {
      flex: 1,
    },

    // Same collapsible bar styling as CatalogScreen
    collapsibleBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: colors.appBackground,
      paddingBottom: spacing.sm,
    },

    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: H_PADDING,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      height: 44,
    },

    searchIcon: {
      marginRight: spacing.sm,
    },

    searchInput: {
      flex: 1,
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      paddingVertical: 0,
    },

    listContent: {
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },

    cardIconWrap: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg - 2,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md + 2,
    },

    cardContent: {
      flex: 1,
    },

    cardTitle: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
    },

    cardMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    cardMetaText: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textMuted,
      marginLeft: spacing.xs,
    },

    draftText: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.semiBold,
      color: colors.warning,
      marginLeft: spacing.xs,
    },

    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginHorizontal: spacing.sm,
    },

    cardPreview: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },

    cardArrow: {
      marginLeft: spacing.md,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.cardBgVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      paddingHorizontal: spacing.xxxl,
    },

    emptyIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },

    emptyTitle: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },

    emptySub: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
};

export default ListScreen;
