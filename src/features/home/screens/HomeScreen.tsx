// src/features/home/screens/HomeScreen.tsx

import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { useAppSelector } from '../../../app/store/hooks';
import { ACTIVE_LISTS, HISTORY_SECTIONS } from '../../../Data/DummyData';
import { ActiveList, HistoryItem } from '../../../Data/types';

type Theme = ReturnType<typeof useTheme>['theme'];

const H_PADDING = 20;

// Home tab ke andar se tab / app-stack screens par jaana hai, isliye loose nav type.
// (navigate() parent navigators tak bubble ho jata hai.)
type Nav = NavigationProp<ParamListBase>;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
};

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    content: {
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxl,
      gap: spacing.xl,
    },

    // Greeting
    greetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: H_PADDING,
    },
    greetSmall: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    greetName: {
      fontSize: typography.xl + 4,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    greetSummary: {
      marginTop: 2,
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarTxt: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },

    // Create CTA
    cta: {
      marginHorizontal: H_PADDING,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.lg + 2,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.primary,
      ...shadows.sm,
    },
    ctaTitle: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.onPrimary,
    },
    ctaSub: {
      marginTop: 4,
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.onPrimary,
      opacity: 0.85,
    },
    ctaIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.onPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Quick actions
    quickRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: H_PADDING,
    },
    quickItem: { flex: 1, alignItems: 'center', gap: spacing.sm },
    quickIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickLabel: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },

    // Section header
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: H_PADDING,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    seeAll: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.primary,
    },

    // Active list cards
    listsContent: { paddingHorizontal: H_PADDING, gap: spacing.md },
    listCard: {
      width: 200,
      padding: spacing.md + 2,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listName: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
    },
    listMeta: {
      marginTop: 4,
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    track: {
      marginTop: spacing.md,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.cardBgVariant,
      overflow: 'hidden',
    },
    fill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
    due: {
      marginTop: spacing.md - 2,
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },

    // History rows
    historyList: { paddingHorizontal: H_PADDING, gap: spacing.md - 2 },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.lg - 2,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyName: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
    },
    historyMeta: {
      marginTop: 2,
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    reuseBtn: {
      height: 36,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reuseTxt: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
    },
  });
};

// ═══════════════════════════════════════════════════════════════════
// SMALL PIECES
// ═══════════════════════════════════════════════════════════════════
const SectionHeader = ({
  title,
  onSeeAll,
  s,
}: {
  title: string;
  onSeeAll: () => void;
  s: ReturnType<typeof createStyles>;
}) => (
  <View style={s.sectionRow}>
    <Text style={s.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Text style={s.seeAll}>See all</Text>
    </TouchableOpacity>
  </View>
);

const QuickAction = ({
  icon,
  label,
  onPress,
  s,
  color,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  s: ReturnType<typeof createStyles>;
  color: string;
}) => (
  <TouchableOpacity style={s.quickItem} onPress={onPress} activeOpacity={0.8}>
    <View style={s.quickIcon}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <Text style={s.quickLabel}>{label}</Text>
  </TouchableOpacity>
);

// ═══════════════════════════════════════════════════════════════════
// SCREEN
// ═══════════════════════════════════════════════════════════════════
const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const s = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<Nav>();
  const user = useAppSelector(st => st.auth.user);

  const firstName = user?.name?.trim().split(' ')[0] || 'there';

  const itemsLeft = ACTIVE_LISTS.reduce((n, l) => n + (l.total - l.bought), 0);
  const recentHistory: HistoryItem[] = HISTORY_SECTIONS.flatMap(
    sec => sec.data,
  ).slice(0, 2);

  // ── navigation ──
  const goCreate = () => navigation.navigate('CreateTab');
  const openList = (l: ActiveList) =>
    navigation.navigate('CreateListScreen', {
      listId: l.id,
      listName: l.name,
      startDate: new Date().toISOString(),
      sourceId: l.sourceId,
    });
  const reuse = (h: HistoryItem) =>
    navigation.navigate('CreateListScreen', {
      listName: h.name,
      startDate: new Date().toISOString(),
      sourceId: h.id,
    });

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <AppHeader title="Home" />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={s.greetRow}>
          <View>
            <Text style={s.greetSmall}>{greeting()}</Text>
            <Text style={s.greetName}>{firstName}</Text>
            <Text style={s.greetSummary}>
              {ACTIVE_LISTS.length} active lists · {itemsLeft} items left to buy
            </Text>
          </View>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Create new list */}
        <TouchableOpacity style={s.cta} onPress={goCreate} activeOpacity={0.9}>
          <View style={{ flex: 1 }}>
            <Text style={s.ctaTitle}>Create new list</Text>
            <Text style={s.ctaSub}>From scratch, an old list or a template</Text>
          </View>
          <View style={s.ctaIcon}>
            <Icon name="plus" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Quick actions */}
        <View style={s.quickRow}>
          <QuickAction
            s={s}
            color={colors.textPrimary}
            icon="file-document-outline"
            label="Templates"
            onPress={goCreate}
          />
          <QuickAction
            s={s}
            color={colors.textPrimary}
            icon="view-grid-outline"
            label="Catalog"
            onPress={() => navigation.navigate('CatalogTab')}
          />
          <QuickAction
            s={s}
            color={colors.textPrimary}
            icon="history"
            label="History"
            onPress={() => navigation.navigate('HistoryTab')}
          />
          <QuickAction
            s={s}
            color={colors.textPrimary}
            icon="plus-circle-outline"
            label="Add item"
            onPress={() => navigation.navigate('AddItem')}
          />
        </View>

        {/* Active lists */}
        <View>
          <SectionHeader
            s={s}
            title="Active lists"
            onSeeAll={() => navigation.navigate('ListTab')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.listsContent}
          >
            {ACTIVE_LISTS.map(l => (
              <TouchableOpacity
                key={l.id}
                style={s.listCard}
                activeOpacity={0.85}
                onPress={() => openList(l)}
              >
                <Text style={s.listName} numberOfLines={1}>
                  {l.name}
                </Text>
                <Text style={s.listMeta}>
                  {l.bought} of {l.total} bought
                </Text>
                <View style={s.track}>
                  <View
                    style={[
                      s.fill,
                      { width: `${Math.round((l.bought / l.total) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={s.due}>{l.due}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent history */}
        <View>
          <SectionHeader
            s={s}
            title="Recent history"
            onSeeAll={() => navigation.navigate('HistoryTab')}
          />
          <View style={s.historyList}>
            {recentHistory.map(h => (
              <View key={h.id} style={s.historyRow}>
                <View style={s.historyIcon}>
                  <Icon name="history" size={20} color={colors.textPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.historyName} numberOfLines={1}>
                    {h.name}
                  </Text>
                  <Text style={s.historyMeta}>
                    {h.date} · {h.itemCount} items
                  </Text>
                </View>
                <TouchableOpacity
                  style={s.reuseBtn}
                  activeOpacity={0.8}
                  onPress={() => reuse(h)}
                >
                  <Icon name="refresh" size={14} color={colors.primary} />
                  <Text style={s.reuseTxt}>Reuse</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;