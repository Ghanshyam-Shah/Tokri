// src/features/history/screens/HistoryScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';
import SearchBar from '../../../shared/components/searchBar/SearchBar';
import EmptyState from '../../../shared/components/states/EmptyState';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { HISTORY_SECTIONS } from '../../../Data/DummyData';
import { HistoryItem, HistorySection } from '../../../Data/types';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';

type Theme = ReturnType<typeof useTheme>['theme'];
type NavProp = NativeStackNavigationProp<AppStackParamList>;

// ─── Main Component ───────────────────────────────────────────────────────
const HistoryScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');

  // Search ke hisaab se sections filter (khali sections hata do)
  const filteredHistory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return HISTORY_SECTIONS.map(section => ({
      ...section,
      data: section.data.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.preview.toLowerCase().includes(q),
      ),
    })).filter(section => section.data.length > 0);
  }, [searchQuery]);

  const handleReuse = (item: HistoryItem) => {
    navigation.navigate('CreateListScreen', {
      listName: item.name,
      startDate: new Date().toISOString(),
      sourceId: item.id,
    });
  };

  const renderHistoryCard = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <View style={styles.cardIconWrap}>
        <Icon name="history" size={24} color={colors.primary} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardMetaRow}>
          <Icon name="check-circle-outline" size={14} color={colors.success} />
          <Text style={styles.cardMetaText}>{item.date}</Text>
          <View style={styles.dot} />
          <Text style={styles.cardMetaText}>{item.itemCount} Items</Text>
        </View>
        {/* <Text style={styles.cardPreview} numberOfLines={1}>
          {item.preview}
        </Text> */}
      </View>

      {/* Re-use Action */}
      {/* <TouchableOpacity
        style={styles.reuseBtn}
        activeOpacity={0.7}
        onPress={() => handleReuse(item)}
      > */}
      <TouchableOpacity
        style={styles.cardArrow}
        onPress={() =>
          navigation.navigate('HistoryList', {
            listId: item.id,
            listName: item.name,
          })
        }
      >
        <Icon
          name="chevron-right"
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
      {/* </TouchableOpacity> */}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: HistorySection;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ═════════════════ App Header ═════════════════ */}
      <AppHeader title="History" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search old lists / पुरानी सूची खोजें..."
        />
      </View>

      {/* Timeline List */}
      <SectionList
        sections={filteredHistory}
        keyExtractor={item => item.id}
        renderItem={renderHistoryCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-off-outline"
            title={searchQuery.trim() ? 'No Results Found' : 'No History Yet'}
            subtitle={
              searchQuery.trim()
                ? `We couldn't find any lists matching "${searchQuery.trim()}".`
                : 'Your completed lists will appear here. Re-use them anytime!'
            }
          />
        }
      />
    </SafeAreaView>
  );
};

// ─── Styles (theme se bante hain, theme badalne par apne aap update) ───────
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.appBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: 100,
    },
    sectionHeader: {
      backgroundColor: colors.appBackground, // sticky header ke liye zaroori
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: 14,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    cardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
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
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginHorizontal: spacing.sm,
    },
    cardPreview: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    reuseBtn: {
      marginLeft: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: colors.primaryMuted,
      borderRadius: borderRadius.sm + 2,
      borderWidth: 1,
      borderColor: colors.border,
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
    reuseText: {
      fontSize: 11,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
      marginTop: 2,
    },
  });
};

export default HistoryScreen;