import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';

// ─── Theme ────────────────────────────────────────────────────────────────
const DARK = {
  bg: '#F8FAFC', // Slightly off-white for better contrast with cards
  surface: '#FFFFFF',
  surfaceHigh: '#F0F6FA',
  border: '#E2E8F0',
  primary: '#0EA5E9', // Sky blue - rich and vibrant
  primaryMuted: '#E0F2FE',
  textPrimary: '#0F172A',
  textMuted: '#64748B',
  chipBorder: '#CBD5E1',
  green: '#10B981',
  orange: '#F59E0B',
};

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
  const navigation = useNavigation();
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
            name={isDraft ? 'file-document-edit-outline' : 'calendar-check-outline'}
            size={24}
            color={DARK.primary}
          />
        </View>

        {/* Content Area */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.cardMetaRow}>
            <Icon name="calendar-outline" size={12} color={DARK.textMuted} />
            <Text style={styles.cardMetaText}>{item.date}</Text>
            <View style={styles.dot} />
            <Text style={styles.cardMetaText}>{item.itemCount} Items</Text>
            {isDraft && (
              <>
                <View style={styles.dot} />
                <Text style={[styles.cardMetaText, { color: DARK.orange, fontWeight: '600' }]}>
                  Draft
                </Text>
              </>
            )}
          </View>
          <Text style={styles.cardPreview} numberOfLines={1}>
            {item.preview}
          </Text>
        </View>

        {/* Right Arrow */}
        <View style={styles.cardArrow}>
          <Icon name="chevron-right" size={20} color={DARK.chipBorder} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Icon name="basket-off-outline" size={48} color={DARK.primary} />
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
      <StatusBar barStyle="dark-content" backgroundColor={DARK.bg} />
      
      <AppHeader
        title="Saved Lists"
        leftIcon="menu"
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK.bg,
  },
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DARK.border,
    backgroundColor: DARK.surface,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: DARK.bg,
    borderWidth: 1,
    borderColor: DARK.border,
  },
  chipActive: {
    backgroundColor: DARK.primary,
    borderColor: DARK.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: DARK.textMuted,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DARK.border,
    shadowColor: DARK.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: DARK.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardMetaText: {
    fontSize: 12,
    color: DARK.textMuted,
    marginLeft: 4,
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: DARK.chipBorder,
    marginHorizontal: 8,
  },
  cardPreview: {
    fontSize: 13,
    color: DARK.textMuted,
  },
  cardArrow: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DARK.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DARK.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: DARK.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ListScreen;
