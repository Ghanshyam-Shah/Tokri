
import React, { useMemo, useState, } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import CollapsibleFilterBar from '../../../shared/components/filterBar/CollapsibleFilterBar';
import { useCollapsibleBar } from '../../../shared/hooks/useCollapsibleBar';
import EmptyState from '../../../shared/components/states/EmptyState';

type Theme = ReturnType<typeof useTheme>['theme'];

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


// ─── Main Component ─────────────────────────────────────────────────────

const ListScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');


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
  const { barHeight, barTranslateY, onBarLayout, handleScroll } =
    useCollapsibleBar();
    
  const emptySubtitle = searchQuery.trim()
    ? `No lists found for '${searchQuery.trim()}'.`
    : activeFilter === 'all'
      ? "You haven't created any shopping lists yet."
      : `No lists found for '${activeFilter}'.`;

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

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <AppHeader title="Saved Lists" />

      <View style={styles.body}>
        {/* Search bar + category chips */}
        <CollapsibleFilterBar
          translateY={barTranslateY}
          onLayout={onBarLayout}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search lists / सूची खोजें..."
          chips={FILTERS}
          selectedChipId={activeFilter}
          onSelectChip={setActiveFilter}
        />

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
          ListEmptyComponent={
            <EmptyState
              icon="basket-off-outline"
              title="No Lists Found"
              subtitle={emptySubtitle}
            />
          }
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
  });
};

export default ListScreen;
