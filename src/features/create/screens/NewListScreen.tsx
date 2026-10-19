// src/features/list/screens/NewListScreen.tsx

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChipGroup from '../../../shared/components/chips/ChipGroup';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';

// ─── Navigation type ──────────────────────────────────────────────────────────
type NavProp = NativeStackNavigationProp<AppStackParamList>;
type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Types ────────────────────────────────────────────────────────────────────
type ListType = 'monthly' | 'weekly' | 'festival' | 'custom';

interface ListTypeOption {
  id: ListType;
  label: string;
  labelHindi: string;
  icon: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LIST_TYPES: ListTypeOption[] = [
  {
    id: 'monthly',
    label: 'Monthly Ration',
    labelHindi: 'मासिक राशन',
    icon: 'calendar-month',
  },
  {
    id: 'weekly',
    label: 'Weekly',
    labelHindi: 'साप्ताहिक',
    icon: 'calendar-week',
  },
  {
    id: 'festival',
    label: 'Festival',
    labelHindi: 'त्योहार',
    icon: 'star-crescent',
  },
  { id: 'custom', label: 'Custom', labelHindi: 'कस्टम', icon: 'tune-variant' },
];

const LAST_LIST = {
  name: 'April 2025 ki List',
  itemCount: 34,
  label: 'Pichli list se',
};

const getMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-IN', {
      month: 'short',
    })} ${d.getFullYear()}`;
  return { from: fmt(first), to: fmt(last) };
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────
const SectionLabel = React.memo(
  ({ icon, en, hi }: { icon: string; en: string; hi: string }) => {
    const { theme } = useTheme();
    const { colors, typography, fontFamilies, spacing } = theme;

    const sec = useMemo(
      () =>
        StyleSheet.create({
          row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs + 2,
            marginBottom: spacing.md + 2,
          },
          en: {
            fontSize: typography.xs,
            fontFamily: fontFamilies.bold,
            color: colors.primary,
            letterSpacing: 0.8,
          },
          slash: {
            fontSize: typography.xs,
            fontFamily: fontFamilies.regular,
            color: colors.textMuted,
            opacity: 0.5,
          },
          hi: {
            fontSize: typography.xs,
            fontFamily: fontFamilies.semiBold,
            color: colors.primary,
          },
        }),
      [colors, typography, fontFamilies, spacing],
    );

    return (
      <View style={sec.row}>
        <Icon name={icon} size={14} color={colors.primary} />
        <Text style={sec.en}>{en}</Text>
        <Text style={sec.slash}>/</Text>
        <Text style={sec.hi}>{hi}</Text>
      </View>
    );
  },
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const NewListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // primary ke upar ka text/icon (light me white, dark me dark)
  const onPrimary = colors.onPrimary;

  const [listName, setListName] = useState('');
  const [listType, setListType] = useState<ListType>('monthly');
  const [useTemplate, setUseTemplate] = useState(false);

  const { from, to } = getMonthRange();

  // ── Handlers ──
  const handleCreate = useCallback(() => {
    if (!listName.trim()) {
      Alert.alert('Naam zaroori hai', 'List ka naam daalein pehle.');
      return;
    }
    navigation.navigate('CreateListScreen', {
      listId: String(Date.now()),
      listName: listName.trim(),
    });
  }, [listName, navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* ═════════════════════════════ App Header ═════════════════════════════ */}
        <AppHeader title="New List" />

        {/* ── Scrollable Form ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ════ SECTION 1 — PEHCHAAN ════ */}
          <View style={styles.section}>
            <SectionLabel
              icon="pencil-outline"
              en="LIST NAME"
              hi="LIST KA NAAM"
            />

            <TextInput
              value={listName}
              onChangeText={setListName}
              placeholder="e.g. May 2025 ki List..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                { borderColor: listName ? colors.primary : colors.border },
              ]}
            />

            {/* List type */}
            <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
              Type chuno <Text style={styles.fieldLabelEn}>/ List type</Text>
            </Text>
            <ChipGroup
              items={LIST_TYPES}
              selectedId={listType}
              onSelect={id => setListType(id as ListType)}
              variant="filled"
            />
          </View>

          {/* ════ SECTION 2 — TAAREEKH ════ */}
          <View style={styles.section}>
            <SectionLabel icon="calendar-outline" en="DATE" hi="तारीख" />

            <View style={styles.dateRow}>
              {/* Shuru */}
              <View style={styles.dateField}>
                <Text style={styles.fieldLabel}>
                  From <Text style={styles.fieldLabelEn}>/ Shuru</Text>
                </Text>
                <TouchableOpacity style={styles.dateBox} activeOpacity={0.75}>
                  <Icon
                    name="calendar-start"
                    size={14}
                    color={colors.primary}
                    style={styles.dateIcon}
                  />
                  <Text style={styles.dateText}>{from}</Text>
                </TouchableOpacity>
              </View>

              <Icon
                name="arrow-right"
                size={16}
                color={colors.textMuted}
                style={styles.dateArrow}
              />

              {/* Khatam */}
              <View style={styles.dateField}>
                <Text style={styles.fieldLabel}>
                  To <Text style={styles.fieldLabelEn}>/ Khatam</Text>
                </Text>
                <TouchableOpacity style={styles.dateBox} activeOpacity={0.75}>
                  <Icon
                    name="calendar-end"
                    size={14}
                    color={colors.primary}
                    style={styles.dateIcon}
                  />
                  <Text style={styles.dateText}>{to}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ════ SECTION 3 — TEMPLATE ════ */}
          <View style={styles.section}>
            <SectionLabel icon="content-copy" en="USE TEMPLATE" hi="टेम्पलेट" />

            <TouchableOpacity
              onPress={() => setUseTemplate(p => !p)}
              activeOpacity={0.8}
              style={[
                styles.templateCard,
                {
                  backgroundColor: useTemplate
                    ? colors.primaryMuted
                    : colors.cardBgVariant,
                  borderColor: useTemplate ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{LAST_LIST.name}</Text>
                <Text style={styles.templateMeta}>
                  {LAST_LIST.itemCount} items • {LAST_LIST.label}
                </Text>
              </View>
              <View
                style={[
                  styles.useBtn,
                  {
                    backgroundColor: useTemplate
                      ? colors.primary
                      : 'transparent',
                    borderColor: useTemplate ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.useBtnText,
                    { color: useTemplate ? onPrimary : colors.textMuted },
                  ]}
                >
                  {useTemplate ? 'Used ✓' : 'Use'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* ── Sticky Footer Buttons ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.75}
            style={styles.btnSecondary}
          >
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreate}
            activeOpacity={0.85}
            style={styles.btnPrimary}
          >
            <Icon
              name="plus-circle-outline"
              size={20}
              color={onPrimary}
              style={styles.btnIcon}
            />
            <Text style={styles.btnPrimaryText}>Create List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─── Styles (theme se) ────────────────────────────────────────────────────────
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  const onPrimary = colors.onPrimary;
  const inputBg = colors.cardBgVariant;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    safeArea: { flex: 1, backgroundColor: colors.appBackground },

    // ── Scroll ──
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg + 2,
      paddingBottom: spacing.sm,
    },
    bottomSpacer: { height: spacing.lg },

    // ── Section card ──
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },

    // ── Field label ──
    fieldLabel: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },
    fieldLabelSpaced: { marginTop: spacing.md + 2 },
    fieldLabelEn: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },

    // ── Input ──
    input: {
      height: spacing.huge,
      backgroundColor: inputBg,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md + 2,
      fontSize: typography.sm,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },

    // ── Date row ──
    dateRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
    },
    dateField: { flex: 1 },
    dateArrow: { marginBottom: spacing.md },
    dateBox: {
      height: 44,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md - 2,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm + 2,
    },
    dateIcon: { marginRight: 6 },
    dateText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },

    // ── Template card ──
    templateCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md + 2,
      borderWidth: 1.5,
      borderRadius: borderRadius.md - 2,
    },
    templateInfo: { flex: 1 },
    templateName: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: 3,
    },
    templateMeta: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    useBtn: {
      paddingHorizontal: spacing.md + 2,
      paddingVertical: 7,
      borderRadius: borderRadius.sm,
      borderWidth: 1.5,
    },
    useBtnText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
    },

    // ── Footer ──
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.appBackground,
      gap: spacing.sm + 2,
    },
    btnPrimary: {
      flex: 1,
      height: spacing.huge,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.md,
    },
    btnIcon: { marginRight: spacing.sm },
    btnPrimaryText: {
      color: onPrimary,
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      letterSpacing: 0.3,
    },
    btnSecondary: {
      flex: 1,
      height: spacing.huge,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnSecondaryText: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
  });
};

export default NewListScreen;