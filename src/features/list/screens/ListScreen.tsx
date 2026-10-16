// src/features/list/screens/ListScreen.tsx  (apna path rakhna)

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Mock Data ────────────────────────────────────────────────────────────
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
];

const FILTERS = ['All', 'Monthly', 'Weekly', 'Festival', 'Drafts'];

// ─── Main Component ───────────────────────────────────────────────────────
const ListScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeFilter, setActiveFilter] = useState('All');

  const filteredLists = MOCK_LISTS.filter(list => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Drafts') return list.status === 'Draft';
    return list.category === activeFilter;
  });

  const renderFilterChip = (filter: string) => {
    const isActive = activeFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        activeOpacity={0.8}
        onPress={() => setActiveFilter(filter)}
        style={[styles.chip, isActive && styles.chipActive]}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderListCard = ({ item }: { item: SavedList }) => {
    const isDraft = item.status === 'Draft';

    return (
      <TouchableOpacity activeOpacity={0.85} style={styles.card}>
        {/* Left Icon Area */}
        <View style={styles.cardIconWrap}>
          <Icon
            name={
              isDraft ? 'file-document-edit-outline' : 'calendar-check-outline'
            }
            size={24}
            color={colors.primary}
          />
        </View>

        {/* Content Area */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.cardMetaRow}>
            <Icon name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={styles.cardMetaText}>{item.date}</Text>
            <View style={styles.dot} />
            <Text style={styles.cardMetaText}>{item.itemCount} Items</Text>
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

        {/* Right Arrow */}
        <View style={styles.cardArrow}>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Icon name="basket-off-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Lists Found</Text>
      <Text style={styles.emptySub}>
        {activeFilter === 'All'
          ? "You haven't created any shopping lists yet."
          : `No lists found for '${activeFilter}'.`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ═════════════════════════════ App Header ═════════════════════════════ */}
      <AppHeader title="Saved Lists" />

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={item => item}
          renderItem={({ item }) => renderFilterChip(item)}
          contentContainerStyle={styles.filtersScroll}
        />
      </View>

      {/* List content */}
      <FlatList
        data={filteredLists}
        keyExtractor={item => item.id}
        renderItem={renderListCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

// ─── Styles (theme se) ────────────────────────────────────────────────────
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },
    filtersContainer: {
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.appBackground,
    },
    filtersScroll: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    chip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.cardBgVariant,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
    chipTextActive: {
      color: colors.onPrimary,
    },
    listContent: {
      padding: spacing.lg,
      gap: spacing.md,
      paddingBottom: 100, // bottom tab bar ke liye extra jagah
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