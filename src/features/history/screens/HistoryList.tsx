// src/features/history/screens/HistoryList.tsx
//
// History ki ek purani list ka read-only view. Neeche sirf "Reuse list" button.

import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import AppHeader from '../../../shared/components/headers/AppHeader';
import CollapsibleFilterBar from '../../../shared/components/filterBar/CollapsibleFilterBar';
import EmptyState from '../../../shared/components/states/EmptyState';
import ListItemRow from '../../../shared/components/product/ListItemRow';
import { useCollapsibleBar } from '../../../shared/hooks/useCollapsibleBar';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { CATEGORIES, buildSelectedFromSource } from '../../../Data/DummyData';
import { SelectedProduct } from '../../../Data/types';
import { borderRadius } from '../../../theme';

type RouteProps = RouteProp<AppStackParamList, 'HistoryList'>;
type NavProp = NativeStackNavigationProp<AppStackParamList, 'HistoryList'>;
type Theme = ReturnType<typeof useTheme>['theme'];

const H_PADDING = 16;

const HistoryList: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);

  const { listId, listName } = route.params;

  // History entry ke items (SOURCE_ITEMS se)
  const items = useMemo(
    () => Object.values(buildSelectedFromSource(listId)),
    [listId],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter(i => {
      const catOk =
        selectedCategory === 'all' || i.categoryId === selectedCategory;
      const srchOk =
        !q || i.name.toLowerCase().includes(q) || i.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [items, selectedCategory, searchQuery]);

  const { barHeight, barTranslateY, onBarLayout, handleScroll } =
    useCollapsibleBar();

  // Reuse: CreateListScreen khulegi, items pre-filled
  const handleReuse = useCallback(() => {
    navigation.navigate('CreateListScreen', {
      listName,
      startDate: new Date().toISOString(),
      sourceId: listId,
    });
  }, [navigation, listName, listId]);

  const renderItem = useCallback(
    ({ item }: { item: SelectedProduct }) => <ListItemRow item={item} />,
    [],
  );

  const noItems = items.length === 0;

  return (
    <View style={s.root}>
      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        <AppHeader
          title={listName}
          leftAction="back"
          showThemeToggle={false}
        />

        <View style={s.body}>
          <CollapsibleFilterBar
            translateY={barTranslateY}
            onLayout={onBarLayout}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search this list..."
            chips={CATEGORIES}
            selectedChipId={selectedCategory}
            onSelectChip={setSelectedCategory}
          />

          <FlatList
            data={filteredItems}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={[
              s.listContent,
              { paddingTop: barHeight, paddingBottom: 16 },
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                icon="basket-off-outline"
                title={noItems ? 'No items in this list' : 'Nothing found'}
                subtitle={
                  noItems
                    ? 'This list has no saved items.'
                    : 'Try another search or category'
                }
              />
            }
          />
        </View>

        {/* ── Bottom bar: sirf Reuse ── */}
        <View style={s.bar}>
          <TouchableOpacity
            onPress={handleReuse}
            disabled={noItems}
            activeOpacity={0.9}
            style={[s.reuseBtn, noItems && s.reuseDisabled]}
          >
            <Icon name="refresh" size={20} color={theme.colors.onPrimary} />
            <Text style={s.reuseTxt}>Reuse list</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, shadows, typography, fontFamilies } = theme;
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    safeArea: { flex: 1, backgroundColor: colors.appBackground },
    body: { flex: 1 },
    listContent: { paddingHorizontal: H_PADDING },
    bar: {
      paddingHorizontal: H_PADDING,
      paddingVertical: spacing.xs + 2,
      backgroundColor: colors.appBackground,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    reuseBtn: {
      height: 46,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      ...shadows.sm,
    },
    reuseDisabled: { opacity: 0.4 },
    reuseTxt: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.onPrimary,
    },
  });
};

export default HistoryList;