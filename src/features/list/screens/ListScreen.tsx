
import React, { useMemo, useState, } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import CollapsibleFilterBar from '../../../shared/components/filterBar/CollapsibleFilterBar';
import { useCollapsibleBar } from '../../../shared/hooks/useCollapsibleBar';
import EmptyState from '../../../shared/components/states/EmptyState';
import { LIST_FILTERS } from '../../../Data/DummyData';
import { SavedList } from '../../../Data/types';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import { useAppDispatch } from '../../../app/store/hooks';
import { useLists } from '../../savedLists/hooks/useLists';
import { toSavedList } from '../../savedLists/utils/listMappers';
import { loadLists } from '../../savedLists/store/listsSlice';
import { deleteList, saveAsTemplate } from '../../savedLists/services/listsService';

type Theme = ReturnType<typeof useTheme>['theme'];
type NavProp = NativeStackNavigationProp<AppStackParamList>;

// ─── Main Component ─────────────────────────────────────────────────────

const ListScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  // Saved lists Supabase se (templates yahan nahi dikhte)
  const { all, loading, error, refresh } = useLists();
  const savedLists = useMemo(() => all.map(toSavedList), [all]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');


  // Search + category filtering
  const filteredLists = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return savedLists.filter(list => {
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
  }, [savedLists, searchQuery, activeFilter]);

  // Catalog jaisa collapsible search + chips bar
  const { barHeight, barTranslateY, onBarLayout, handleScroll } =
    useCollapsibleBar();
    
  const emptySubtitle = searchQuery.trim()
    ? `No lists found for '${searchQuery.trim()}'.`
    : activeFilter === 'all'
      ? "You haven't created any shopping lists yet."
      : `No lists found for '${activeFilter}'.`;

  // Tap: list kholo (wahi list update hoti hai)
  const openList = (id: string) => {
    const row = all.find(r => r.id === id);
    if (!row) return;
    navigation.navigate('CreateListScreen', {
      listId: row.id,
      listName: row.name,
      description: row.description || undefined,
      listType: row.listType,
      startDate: row.startDate ?? undefined,
    });
  };

  // Lamba dabao: template banao / delete
  const openMenu = (item: SavedList) => {
    Alert.alert(item.name, undefined, [
      {
        text: 'Save as template',
        onPress: async () => {
          try {
            await saveAsTemplate(item.id);
            dispatch(loadLists());
            Alert.alert('Template save ho gaya ✅', 'New List → My Templates me milega.');
          } catch {
            Alert.alert('Template save nahi hua', 'Internet check karke dobara try karein.');
          }
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          Alert.alert('List delete karein?', `"${item.name}" hamesha ke liye hat jayegi.`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteList(item.id);
                  dispatch(loadLists());
                } catch {
                  Alert.alert('Delete nahi hui', 'Dobara try karein.');
                }
              },
            },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderListCard = ({ item }: { item: SavedList }) => {
    const isDraft = item.status === 'Draft';



    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => openList(item.id)}
        onLongPress={() => openMenu(item)}
      >
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

{/* dont remove this line of code */}
          {/* <Text style={styles.cardPreview} numberOfLines={1}>
            {item.preview}
          </Text> */}
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
          chips={LIST_FILTERS}
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
          refreshing={loading && savedLists.length > 0}
          onRefresh={refresh}
          progressViewOffset={barHeight}
          ListEmptyComponent={
            loading ? (
              <EmptyState
                icon="timer-sand"
                title="Loading..."
                subtitle="Aapki lists la rahe hain."
              />
            ) : error ? (
              <EmptyState
                icon="cloud-off-outline"
                title="Lists load nahi huin"
                subtitle="Internet check karke neeche kheench kar dobara try karein."
              />
            ) : (
              <EmptyState
                icon="basket-off-outline"
                title="No Lists Found"
                subtitle={emptySubtitle}
              />
            )
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
