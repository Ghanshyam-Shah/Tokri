// src/features/list/screens/NewListScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  CreateStackParamList,
  ListStackParamList,
} from '../../../navigation/types/navigationTypes';
import AppHeader from '../../../shared/components/headers/AppHeader';

// ─── Navigation type ──────────────────────────────────────────────────────────
type NavProp = NativeStackNavigationProp<CreateStackParamList, 'NewListScreen'>;

// ─── Same pattern as CatalogScreen ───────────────────────────────────────────
const DARK = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHigh: '#F0F6FA',
  border: '#DCE7EE',
  primary: 'skyblue',
  primaryMuted: '#EAF4FA',
  textPrimary: '#263640',
  textMuted: '#71818C',
  chipBorder: '#D5E2E9',
  searchBg: '#F3F7F7',
  green: '#70A185',
  red: '#D17F83',
  accent: '#91A8A8',
  inputBg: '#F3F7F7',
};

const H_PADDING = 16;

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

// ─── SectionLabel — same bilingual style as CategoryChips section ─────────────
const SectionLabel = React.memo(
  ({ icon, en, hi }: { icon: string; en: string; hi: string }) => (
    <View style={sec.row}>
      <Icon name={icon} size={14} color={DARK.primary} />
      <Text style={sec.en}>{en}</Text>
      <Text style={sec.slash}>/</Text>
      <Text style={sec.hi}>{hi}</Text>
    </View>
  ),
);

const sec = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  en: {
    fontSize: 11,
    fontWeight: '700',
    color: DARK.primary,
    letterSpacing: 0.8,
  },
  slash: { fontSize: 11, color: DARK.textMuted, opacity: 0.5 },
  hi: { fontSize: 12, fontWeight: '600', color: DARK.primary },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const NewListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

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
    navigation.navigate('CreateListScreen', { listId: '123' });
  }, [listName, navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ── Header — same as CatalogHeader style ── */}

        <AppHeader
          title="Product Details"
          leftIcon="arrow-left"
          onLeftPress={() => navigation.goBack()}
        />

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

            {/* List name input */}
            {/* <Text style={styles.fieldLabel}>
              List ka naam <Text style={styles.fieldLabelEn}>/ List name</Text>
            </Text> */}
            <TextInput
              value={listName}
              onChangeText={setListName}
              placeholder="e.g. May 2025 ki List..."
              placeholderTextColor={DARK.textMuted}
              style={[
                styles.input,
                { borderColor: listName ? DARK.primary : DARK.border },
              ]}
            />

            {/* List type */}
            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              Type chuno <Text style={styles.fieldLabelEn}>/ List type</Text>
            </Text>
            <View style={styles.chipsWrap}>
              {LIST_TYPES.map(opt => {
                const selected = listType === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setListType(opt.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.chip,
                      selected ? styles.chipActive : styles.chipInactive,
                    ]}
                  >
                    <Icon
                      name={opt.icon}
                      size={13}
                      color={selected ? '#fff' : DARK.textMuted}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? '#fff' : DARK.textMuted },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
                    color={DARK.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.dateText}>{from}</Text>
                </TouchableOpacity>
              </View>

              <Icon
                name="arrow-right"
                size={16}
                color={DARK.textMuted}
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
                    color={DARK.primary}
                    style={{ marginRight: 6 }}
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
                    ? DARK.primaryMuted
                    : DARK.inputBg,
                  borderColor: useTemplate ? DARK.primary : DARK.border,
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
                    backgroundColor: useTemplate ? DARK.primary : 'transparent',
                    borderColor: useTemplate ? DARK.primary : DARK.chipBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.useBtnText,
                    { color: useTemplate ? '#fff' : DARK.textMuted },
                  ]}
                >
                  {useTemplate ? 'Used ✓' : 'Use'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 16 }} />
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
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnPrimaryText}>Create List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─── Styles — same scale as CatalogScreen ────────────────────────────────────
const HEADER_H = Platform.OS === 'ios' ? 52 : 58;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK.bg,
  },
  safeArea: {
    flex: 1,
    backgroundColor: DARK.bg,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: H_PADDING,
    paddingTop: 18,
    paddingBottom: 8,
  },

  // ── Section card ──
  section: {
    backgroundColor: DARK.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DARK.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },

  // ── Field label ──
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: DARK.textMuted,
    marginBottom: 8,
  },
  fieldLabelEn: {
    fontSize: 11,
    fontWeight: '400',
    color: DARK.textMuted,
  },

  // ── Input ──
  input: {
    height: 48,
    backgroundColor: DARK.inputBg,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    color: DARK.textPrimary,
  },

  // ── Chips — same as CategoryChips ──
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  chipActive: {
    backgroundColor: DARK.primary,
    borderColor: DARK.primary,
  },
  chipInactive: {
    borderColor: DARK.chipBorder,
    backgroundColor: DARK.inputBg,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Date row ──
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dateField: { flex: 1 },
  dateArrow: { marginBottom: 12 },
  dateBox: {
    height: 44,
    backgroundColor: DARK.inputBg,
    borderWidth: 1,
    borderColor: DARK.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 13,
    color: DARK.textPrimary,
    fontWeight: '500',
  },

  // ── Template card ──
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  templateInfo: { flex: 1 },
  templateName: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK.textPrimary,
    marginBottom: 3,
  },
  templateMeta: {
    fontSize: 12,
    color: DARK.textMuted,
  },
  useBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  useBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Footer ──
  // ── Footer ──
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DARK.border,
    gap: 10,
  },

  btnPrimary: {
    flex: 1,
    height: 48,
    backgroundColor: DARK.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DARK.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  btnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: DARK.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK.textMuted,
  },
});

export default NewListScreen;
