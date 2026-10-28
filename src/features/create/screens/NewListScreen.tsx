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
import DateTimePicker from '@react-native-community/datetimepicker';

import ChipGroup from '../../../shared/components/chips/ChipGroup';
import SegmentedTabs, {
  SegmentTab,
} from '../../../shared/components/tabs/SegmentedTabs';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { LIST_TYPES, OLD_LISTS, MY_TEMPLATES } from '../../../Data/DummyData';
import { ListType, ListSource } from '../../../Data/types';

// ─── Navigation type ──────────────────────────────────────────────────────────
type NavProp = NativeStackNavigationProp<AppStackParamList>;
type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Types ────────────────────────────────────────────────────────────────────
type SourceTab = 'old' | 'templates';

const SOURCE_TABS: SegmentTab[] = [
  { id: 'old', label: 'Old Lists', icon: 'history' },
  { id: 'templates', label: 'My Templates', icon: 'bookmark-outline' },
];

const SOURCES: Record<SourceTab, ListSource[]> = {
  old: OLD_LISTS,
  templates: MY_TEMPLATES,
};

const EMPTY_TEXT: Record<SourceTab, string> = {
  old: 'Abhi koi purani list nahi hai.',
  templates: 'Abhi koi template save nahi hua.',
};

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-IN', {
    month: 'short',
  })} ${d.getFullYear()}`;

const isToday = (d: Date) => {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
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

        <Text style={sec.hi}>{hi}</Text>
      </View>
    );
  },
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const NewListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // primary ke upar ka text/icon (light me white, dark me dark)
  const onPrimary = colors.onPrimary;

  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [listType, setListType] = useState<ListType>('monthly');

  // Start date: default = aaj ki date
  const [startDate, setStartDate] = useState<Date>(() => new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Template section: tab + selected item (ek hi select hota hai)
  const [sourceTab, setSourceTab] = useState<SourceTab>('old');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const sourceItems = SOURCES[sourceTab];

  // ── Handlers ──
  // Date chun li (Android: OK dabane par, iOS: calendar me din chunne par)
  const handleDateValueChange = useCallback(
    (_event: unknown, date: Date) => {
      setShowPicker(false);
      setStartDate(date);
    },
    [],
  );

  // Bina chune band kiya (Android: Cancel / bahar tap)
  const handleDateDismiss = useCallback(() => {
    setShowPicker(false);
  }, []);

  // tab badalne par purana selection hata do (dusre tab ka item hidden rehta)
  const handleSourceTabChange = useCallback((id: string) => {
    setSourceTab(id as SourceTab);
    setSelectedSourceId(null);
  }, []);

  const handleToggleSource = useCallback((id: string) => {
    setSelectedSourceId(prev => (prev === id ? null : id));
  }, []);

  const handleCreate = useCallback(() => {
    if (!listName.trim()) {
      Alert.alert('Naam zaroori hai', 'List ka naam daalein pehle.');
      return;
    }
    navigation.navigate('CreateListScreen', {
      listId: String(Date.now()),
      listName: listName.trim(),
      description: description.trim() || undefined,
      startDate: startDate.toISOString(),
      sourceId: selectedSourceId ?? undefined,
    });
  }, [listName, description, startDate, selectedSourceId, navigation]);

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
              hi=""
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
            <View style={styles.descBlock}>
              <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
                Description <Text style={styles.fieldLabelEn}>/ Optional</Text>
              </Text>
              <TextInput
                value={description}
                onChangeText={t => setDescription(t.slice(0, 150))}
                placeholder="e.g. Diwali ke liye, ghar ka saaman..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={150}
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.descInput,
                  { borderColor: description ? colors.primary : colors.border },
                ]}
              />
              <Text style={styles.descCount}>{description.length}/150</Text>
            </View>

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

          {/* ════ SECTION 2 — SHURU KI TAAREEKH ════ */}
          <View style={styles.section}>
            <SectionLabel
              icon="calendar-outline"
              en="START DATE"
              hi=" "
            />

            <TouchableOpacity
              style={styles.dateBox}
              activeOpacity={0.75}
              onPress={() => setShowPicker(true)}
            >
              <Icon
                name="calendar-start"
                size={16}
                color={colors.primary}
                style={styles.dateIcon}
              />
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>

              {isToday(startDate) && (
                <View style={styles.todayTag}>
                  <Text style={styles.todayTagText}>Today</Text>
                </View>
              )}

              <Icon
                name="chevron-down"
                size={18}
                color={colors.textMuted}
                style={styles.dateChevron}
              />
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onValueChange={handleDateValueChange}
                onDismiss={handleDateDismiss}
                themeVariant={isDark ? 'dark' : 'light'}
                accentColor={colors.primary}
              />
            )}
          </View>

          {/* ════ SECTION 3 — TEMPLATE ════ */}
          <View style={styles.section}>
            <SectionLabel icon="content-copy" en="USE TEMPLATE" hi="" />

            <SegmentedTabs
              tabs={SOURCE_TABS}
              selectedId={sourceTab}
              onSelect={handleSourceTabChange}
              containerStyle={styles.tabs}
            />

            {sourceItems.length === 0 ? (
              <Text style={styles.emptyText}>{EMPTY_TEXT[sourceTab]}</Text>
            ) : (
              <View style={styles.sourceList}>
                {sourceItems.map(item => {
                  const selected = selectedSourceId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleToggleSource(item.id)}
                      activeOpacity={0.8}
                      style={[
                        styles.templateCard,
                        {
                          backgroundColor: selected
                            ? colors.primaryMuted
                            : colors.cardBgVariant,
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                    >
                      <View style={styles.templateInfo}>
                        <Text style={styles.templateName}>{item.name}</Text>
                        <Text style={styles.templateMeta}>
                          {item.itemCount} items • {item.meta}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.useBtn,
                          {
                            backgroundColor: selected
                              ? colors.primary
                              : 'transparent',
                            borderColor: selected
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.useBtnText,
                            { color: selected ? onPrimary : colors.textMuted },
                          ]}
                        >
                          {selected ? 'Used ✓' : 'Use'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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

    // // ── Scroll ──
    // scroll: { flex: 1 },
    // content: {
    // paddingHorizontal: spacing.lg,
    // paddingTop: spacing.lg + 2,
    // paddingBottom: spacing.sm,
    // },
    // bottomSpacer: { height: spacing.lg },

    // // ── Section card ──
    // section: {
    // backgroundColor: colors.cardBg,
    // borderRadius: borderRadius.lg,
    // padding: spacing.lg,
    // marginBottom: spacing.md,
    // borderWidth: 1,
    // borderColor: colors.border,
    // ...shadows.sm,
    // },

    // ── Scroll ──
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: spacing.lg,
      // paddingTop: spacing.lg + 2,
      paddingBottom: spacing.sm,
    },
    bottomSpacer: { height: spacing.lg },

    // ── Section card ──
    section: {
      // backgroundColor: colors.cardBg,
      // borderRadius: borderRadius.lg,
      // padding: spacing.lg,
      // marginBottom: spacing.md,
      // borderWidth: 1,
      // borderColor: colors.border,
      // ...shadows.sm,
      paddingVertical: spacing.lg,
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
    descInput: {
      height: undefined,        // fixed input height hatao
      minHeight: 84,
      paddingTop: spacing.sm + 2,
      paddingBottom: spacing.sm + 2,
    },
    descCount: {
      alignSelf: 'flex-end',
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    descBlock: { marginBottom: spacing.xs },
    // ── Start date ──
    dateBox: {
      height: 48,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    dateIcon: { marginRight: spacing.sm },
    dateText: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },
    todayTag: {
      marginLeft: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primaryMuted,
    },
    todayTagText: {
      fontSize: typography.xs - 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.primary,
    },
    dateChevron: { marginLeft: 'auto' },

    // ── Template section ──
    tabs: { marginBottom: spacing.md },
    sourceList: { gap: spacing.sm },
    emptyText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: spacing.lg,
    },
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