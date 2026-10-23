// src/features/list/screens/List.tsx
//
// FINAL LIST SCREEN — CreateListScreen ke "Continue" ke baad.
//
// ⚠️ Native packages (4 bottom actions ke liye):
//   npm install react-native-view-shot        (Save as Image)
//   npm install react-native-html-to-pdf       (Save as PDF)
//   (WhatsApp share built-in Linking se hota hai; WhatsApp installed hona chahiye.)
// Dono ke liye native rebuild (pod install / gradle sync) zaroori hai.
//
// Header: shared AppHeader (back + list name + receipt icon with count badge)
// Search + chips ViewShot ke BAHAR hain, taaki "Save as Image" sirf cards capture kare.
// Colors/fonts/spacing: sab useTheme() se.

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  Image,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Linking,
  Share,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Feather';
// import Icon2 from 'react-native-vector-icons/FontAwesome6';




import AppHeader from '../../../shared/components/headers/AppHeader';
import BottomSheet from '../../../shared/components/sheets/BottomSheet';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { lightColors } from '../../../theme/colors';
// Optional native modules — install na hon to ye 2 lines comment kar do,
// screen Save-as-Image / Save-as-PDF ke bina chalegi.
import ViewShot from 'react-native-view-shot';
import { generatePDF } from 'react-native-html-to-pdf';
import { AppStackParamList, ListItemParam, } from '../../../navigation/types/navigationTypes';

type RouteProps = RouteProp<AppStackParamList, 'List'>;
type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Layout constants (theme se independent) ──────────────────────────────────
const H_PADDING = 16;


// Route se aane wale items ka hi type (imageUrl optional)
type SelectedP = ListItemParam;

// ─── Categories (CreateListScreen jaisi) ──────────────────────────────────────
interface Category {
  id: string;
  label: string;
  labelHindi: string;
}
const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

// ─── Default / fallback items ──────────────────────────────────────────────
// Sirf tab use hota hai jab route.params.items na mile. Navigation wire hone
// ke baad delete kar sakte ho.
const DEFAULT_ITEMS: SelectedP[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    unit: '1kg',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    quantity: 2,
    categoryId: 'vegetables',
  },
  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    unit: '5kg',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    quantity: 1,
    note: 'India Gate brand lena',
    categoryId: 'grains',
  },
  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    quantity: 3,
    categoryId: 'dairy',
  },
  {
    id: '9',
    name: 'Turmeric Powder',
    nameHindi: 'हल्दी पाउडर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
    quantity: 1,
    categoryId: 'spices',
  },
  {
    id: '6',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    unit: '1kg',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    quantity: 2,
    categoryId: 'vegetables',
  },
  {
    id: '10',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    unit: '5kg',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    quantity: 1,
    note: 'India Gate brand lena',
    categoryId: 'grains',
  },
  {
    id: '11',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    quantity: 3,
    categoryId: 'dairy',
  },
  {
    id: '12',
    name: 'Turmeric Powder',
    nameHindi: 'हल्दी पाउडर',
    unit: '200g',
    imageUrl:
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
    quantity: 1,
    categoryId: 'spices',
  },
];

// ═══════════════════════════════════════════════════════════════════
// STYLES (theme se)
// ═══════════════════════════════════════════════════════════════════
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } = theme;

  const onPrimary = colors.onPrimary; // primary ke upar ka text/icon
  const primaryMuted = colors.primaryMuted; // primary 6-digit hex hona chahiye

  return {
    // ── Category chips ──
    ch: StyleSheet.create({
      scrollStyle: { flexGrow: 0, flexShrink: 0 },
      row: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: H_PADDING,
        paddingVertical: spacing.xs,
      },
      chip: {
        flexShrink: 0,
        paddingHorizontal: spacing.md + 2,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
      },
      active: { backgroundColor: colors.primary, borderColor: colors.primary },
      inactive: { borderColor: colors.border },
      text: { fontSize: typography.xs + 1, fontFamily: fontFamilies.medium },
    }),

    // ── List row ──
    row: StyleSheet.create({
      card: {
        backgroundColor: colors.cardBg,
        borderRadius: borderRadius.lg - 2,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        marginBottom: spacing.sm + 2,
      },
      topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
      },
      thumbWrap: { width: 52, height: 52 },
      thumb: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md - 2,
        backgroundColor: colors.cardBgVariant,
      },
      noteBadge: {
        position: 'absolute',
        top: -4,
        left: -4,
        width: 18,
        height: 18,
        borderRadius: 6,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      name: {
        fontSize: typography.sm,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
      },
      hindi: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.hindi ?? fontFamilies.regular,
        color: colors.textMuted,
        marginTop: 2,
      },
      qtyPill: {
        backgroundColor: primaryMuted,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 5,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
      },
      qtyPillTxt: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.bold,
        color: colors.primary,
      },
      bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: 7,
        paddingVertical: 7,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
      },
      notePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
        backgroundColor: primaryMuted,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
      },
      noteText: {
        fontSize: typography.xs - 2,
        fontFamily: fontFamilies.medium,
        color: colors.primary,
      },
    }),

    // ── Edit modal ──
    em: StyleSheet.create({
      overlay: { flex: 1, justifyContent: 'flex-end' },
      backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.overlay,
      },
      sheet: {
        backgroundColor: colors.cardBg,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        paddingBottom: Platform.OS === 'ios' ? 36 : spacing.xxl,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
      handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: spacing.md + 2,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md + 2,
      },
      headerTitle: {
        fontSize: typography.md,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
      },
      productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.cardBgVariant,
        borderRadius: borderRadius.md,
      },
      thumb: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md - 2,
        backgroundColor: colors.appBackground,
      },
      pName: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
      },
      pHindi: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.regular,
        color: colors.textMuted,
        marginTop: 2,
      },
      label: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.semiBold,
        color: colors.textMuted,
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
      },
      qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        marginBottom: spacing.xl,
      },
      qBtn: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md - 2,
        alignItems: 'center',
        justifyContent: 'center',
      },
      qBtnMinus: { backgroundColor: colors.cardBgVariant },
      qBtnPlus: { backgroundColor: colors.primary },
      qCount: {
        fontSize: typography.xl,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
        minWidth: 32,
        textAlign: 'center',
      },
      unitTag: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.regular,
        color: colors.textMuted,
        marginLeft: spacing.xs,
      },
      noteInput: {
        backgroundColor: colors.cardBgVariant,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md - 2,
        padding: spacing.md,
        fontSize: typography.sm,
        fontFamily: fontFamilies.regular,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
        minHeight: 64,
        textAlignVertical: 'top',
      },
      actionsRow: { flexDirection: 'row', gap: spacing.sm + 2 },
      removeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1.5,
        borderColor: colors.error,
      },
      removeTxt: {
        fontSize: typography.sm,
        fontFamily: fontFamilies.bold,
        color: colors.error,
      },
      saveBtn: {
        flex: 1,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      saveTxt: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.bold,
        color: onPrimary,
      },
      btnIcon: { marginRight: 6 },
    }),

    // ── Export bar ──
    // ── Bottom bar (Save as draft + Download) ──
    xb: StyleSheet.create({
      wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: H_PADDING,
        paddingVertical: spacing.xs + 2,
        backgroundColor: colors.appBackground,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        gap: spacing.sm + 2,
      },
      btn: {
        flex: 1,
        height: 46,
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
      },
      draftBtn: { borderWidth: 1.5, borderColor: colors.primary },
      downloadBtn: { backgroundColor: colors.primary, ...shadows.sm },
      btnDisabled: { opacity: 0.4 },
      draftTxt: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.semiBold,
        color: colors.primary,
      },
      downloadTxt: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.semiBold,
        color: onPrimary,
      },
    }),

    // ── Download sheet ──
    dl: StyleSheet.create({
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md + 2,
        borderRadius: borderRadius.lg - 2,
        backgroundColor: colors.cardBg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm + 2,
      },
      optionIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: primaryMuted,
        alignItems: 'center',
        justifyContent: 'center',
      },
      optionTitle: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
      },
      optionSub: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.regular,
        color: colors.textMuted,
        marginTop: 2,
      },
    }),

    // ── Screen ──
    s: StyleSheet.create({
      root: { flex: 1, backgroundColor: colors.appBackground },
      safeArea: { flex: 1, backgroundColor: colors.appBackground },
      body: { flex: 1 },

      // absolute overlay: hide hone par gap nahi bachta; FlatList ka
      // paddingTop (=barHeight) neeche jagah reserve karta hai.
      collapsibleBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: colors.appBackground,
        paddingBottom: spacing.sm,
      },
      searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: H_PADDING,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        backgroundColor: colors.cardBgVariant,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        height: 44,
      },
      searchIcon: { marginRight: spacing.sm },
      searchInput: {
        flex: 1,
        fontSize: typography.sm,
        fontFamily: fontFamilies.regular,
        color: colors.textPrimary,
        paddingVertical: 0,
      },
      // ViewShot ko solid background do, warna saved image transparent aayegi
      captureArea: { flex: 1, backgroundColor: colors.appBackground },
      listContent: { paddingHorizontal: H_PADDING },
      emptyWrap: {
        alignItems: 'center',
        paddingVertical: spacing.giant,
        gap: spacing.sm + 2,
      },
      emptyTxt: {
        color: colors.textPrimary,
        fontFamily: fontFamilies.semiBold,
        fontSize: typography.sm,
      },
    }),
  };
};

// Theme ke hisaab se styles cache (har row apni stylesheet nahi banata)
const stylesCache = new WeakMap<Theme, ReturnType<typeof createStyles>>();
const useStyles = () => {
  const { theme } = useTheme();
  let st = stylesCache.get(theme);
  if (!st) {
    st = createStyles(theme);
    stylesCache.set(theme, st);
  }
  return { theme, ...st };
};

// ═══════════════════════════════════════════════════════════════════
// Category Chips
// ═══════════════════════════════════════════════════════════════════
const CategoryChips = React.memo(
  ({
    categories,
    selected,
    onSelect,
  }: {
    categories: Category[];
    selected: string;
    onSelect: (id: string) => void;
  }) => {
    const { theme, ch } = useStyles();
    const { colors } = theme;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={ch.row}
        style={ch.scrollStyle}
      >
        {categories.map(cat => {
          const active = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.8}
              style={[ch.chip, active ? ch.active : ch.inactive]}
            >
              <Text
                style={[
                  ch.text,
                  { color: active ? colors.onPrimary : colors.textMuted },
                ]}
                numberOfLines={1}
              >
                {cat.label} / {cat.labelHindi}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// Row item — column list, ek product per row
// ═══════════════════════════════════════════════════════════════════
const ListRow = React.memo(
  ({ item, onEdit }: { item: SelectedP; onEdit: (id: string) => void }) => {
    const { theme, row } = useStyles();
    const { colors } = theme;

    return (
      <View style={row.card}>
        <View style={row.topRow}>
          <View style={row.thumbWrap}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={row.thumb} />
            ) : (
              <View
                style={[
                  row.thumb,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <Icon name="image-outline" size={22} color={colors.textMuted} />
              </View>
            )}
            {!!item.note && (
              <View style={row.noteBadge}>
                <Icon
                  name="note-text-outline"
                  size={11}
                  color={colors.onPrimary}
                />
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={row.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={row.hindi} numberOfLines={1}>
              {item.nameHindi} • {item.unit}
            </Text>
            {item.note ? (
              <View style={row.notePill}>
                <Icon
                  name="file-document-outline"
                  size={12}
                  color={colors.primary}
                />
                <Text style={row.noteText} numberOfLines={1}>
                  {item.note}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={row.qtyPill}>
            <Text style={row.qtyPillTxt}>Qty {item.quantity}</Text>
          </View>
          <View style={row.bottomRow}>
            <TouchableOpacity
              onPress={() => onEdit(item.id)}
              activeOpacity={0.8}
              style={row.editBtn}
            >
              <Icon name="pencil-outline" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// Edit modal — quantity + note
// ═══════════════════════════════════════════════════════════════════
const EditItemModal = React.memo(
  ({
    visible,
    item,
    onClose,
    onSave,
    onRemove,
  }: {
    visible: boolean;
    item: SelectedP | null;
    onClose: () => void;
    onSave: (qty: number, note: string) => void;
    onRemove: () => void;
  }) => {
    const { theme, em } = useStyles();
    const { colors } = theme;

    const [qty, setQty] = useState(item?.quantity ?? 1);
    const [ntxt, setNtxt] = useState(item?.note ?? '');

    useEffect(() => {
      setQty(item?.quantity ?? 1);
      setNtxt(item?.note ?? '');
    }, [item?.id]);

    if (!item) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={em.overlay}
        >
          <TouchableOpacity
            style={em.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={em.sheet}>
            <View style={em.handle} />
            <View style={em.headerRow}>
              <Text style={em.headerTitle}>Edit Item</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={em.productRow}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={em.thumb} />
              ) : (
                <View
                  style={[
                    em.thumb,
                    { alignItems: 'center', justifyContent: 'center' },
                  ]}
                >
                  <Icon name="image-outline" size={22} color={colors.textMuted} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={em.pName}>{item.name}</Text>
                <Text style={em.pHindi}>
                  {item.nameHindi} • {item.unit}
                </Text>
              </View>
            </View>

            <Text style={em.label}>Quantity / मात्रा</Text>
            <View style={em.qtyRow}>
              <TouchableOpacity
                onPress={() => setQty(q => Math.max(1, q - 1))}
                style={[em.qBtn, em.qBtnMinus]}
              >
                <Icon name="minus" size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={em.qCount}>{qty}</Text>
              <TouchableOpacity
                onPress={() => setQty(q => q + 1)}
                style={[em.qBtn, em.qBtnPlus]}
              >
                <Icon name="plus" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
              <Text style={em.unitTag}>{item.unit} each</Text>
            </View>

            <Text style={em.label}>Note / टिप्पणी</Text>
            <TextInput
              value={ntxt}
              onChangeText={t => setNtxt(t.slice(0, 120))}
              placeholder="e.g. Patanjali brand lena..."
              placeholderTextColor={colors.textMuted}
              style={em.noteInput}
              multiline
            />

            <View style={em.actionsRow}>
              <TouchableOpacity
                onPress={onRemove}
                activeOpacity={0.85}
                style={em.removeBtn}
              >
                <Icon
                  name="trash-can-outline"
                  size={16}
                  color={colors.error}
                  style={em.btnIcon}
                />
                <Text style={em.removeTxt}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSave(qty, ntxt)}
                activeOpacity={0.85}
                style={em.saveBtn}
              >
                <Icon
                  name="check-circle-outline"
                  size={18}
                  color={colors.onPrimary}
                  style={em.btnIcon}
                />
                <Text style={em.saveTxt}>Done / हो गया</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// Bottom action bar — 4 buttons, icon + label
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// Bottom bar — Save as draft + Download
// ═══════════════════════════════════════════════════════════════════
const ExportBar = React.memo(
  ({
    onSaveDraft,
    onDownload,
    disabled,
  }: {
    onSaveDraft: () => void;
    onDownload: () => void;
    disabled: boolean;
  }) => {
    const { theme, xb } = useStyles();
    const { colors } = theme;

    return (
      <View style={xb.wrap}>
        <TouchableOpacity
          onPress={onSaveDraft}
          activeOpacity={0.85}
          style={[xb.btn, xb.draftBtn]}
        >
          <Text style={xb.draftTxt}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDownload}
          disabled={disabled}
          activeOpacity={0.9}
          style={[xb.btn, xb.downloadBtn, disabled && xb.btnDisabled]}
        >
          {/* <Icon2 name="download" size={20} color={colors.onPrimary} /> */}
          <Icon2 name="download" size={20} color={colors.onPrimary} style={{ transform: [{ scaleX: -1 }] }} />

          {/* <Icon2 name="person-walking-luggage" size={20} color={colors.onPrimary} style={{ transform: [{ scaleX: -1 }] }}/> */}

          <Text style={xb.downloadTxt}>Download</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// Download sheet — Save as PDF / Save as Image
// ═══════════════════════════════════════════════════════════════════
const DownloadSheet = React.memo(
  ({
    visible,
    onClose,
    onDismissed,
    onPdf,
    onImage,
  }: {
    visible: boolean;
    onClose: () => void;
    onDismissed: () => void;
    onPdf: () => void;
    onImage: () => void;
  }) => {
    const { theme, dl } = useStyles();
    const { colors } = theme;

    return (
      <BottomSheet
        visible={visible}
        onClose={onClose}
        onDismissed={onDismissed}
        title="Download"
        subtitle="Choose a format"
      >
        <TouchableOpacity style={dl.option} onPress={onPdf} activeOpacity={0.85}>
          <View style={dl.optionIcon}>
            <Icon name="file-pdf-box" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={dl.optionTitle}>Save as PDF</Text>
            <Text style={dl.optionSub}>
              A printable list with quantities and notes
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={dl.option}
          onPress={onImage}
          activeOpacity={0.85}
        >
          <View style={dl.optionIcon}>
            <Icon name="image-outline" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={dl.optionTitle}>Save as Image</Text>
            <Text style={dl.optionSub}>A picture of your list, easy to share</Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </BottomSheet>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const List: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { theme, s } = useStyles();
  const { colors } = theme;

  const listName = route.params?.listName ?? 'Meri List';
  const initialItems: SelectedP[] = route.params?.items ?? DEFAULT_ITEMS;

  const [items, setItems] = useState<Record<string, SelectedP>>(
    Object.fromEntries(initialItems.map(i => [i.id, i])),
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  // header receipt icon ka state. Abhi is screen me preview modal render nahi
  // hota, to icon dabane par kuch dikhega nahi (handleOpenPreview dekho).
  const [, setPreviewVisible] = useState(false);

  // ── search + category filter ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const itemList = useMemo(() => Object.values(items), [items]);
  const itemCount = itemList.length;

  // jo render hota hai — search + category se filtered
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return itemList.filter(i => {
      const catOk =
        selectedCategory === 'all' || i.categoryId === selectedCategory;
      const srchOk =
        !q || i.name.toLowerCase().includes(q) || i.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [itemList, selectedCategory, searchQuery]);

  const captureRef = useRef<React.ComponentRef<typeof ViewShot>>(null);

  // ── item handlers ──
  const handleDelete = useCallback((id: string) => {
    Alert.alert('Item hatana hai?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setItems(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
      },
    ]);
  }, []);

  const handleEdit = useCallback((id: string) => setEditingId(id), []);

  const handleEditSave = useCallback(
    (qty: number, note: string) => {
      if (!editingId) return;
      setItems(prev => ({
        ...prev,
        [editingId]: {
          ...prev[editingId],
          quantity: qty,
          note: note.trim() || undefined,
        },
      }));
      setEditingId(null);
    },
    [editingId],
  );

  // Remove button edit modal ke andar — sheet band karke wahi confirm dialog
  const handleEditRemove = useCallback(() => {
    if (!editingId) return;
    const id = editingId;
    setEditingId(null);
    handleDelete(id);
  }, [editingId, handleDelete]);

  // header receipt icon
  // TODO: yahan preview modal / koi action wire karna hai. Abhi sirf state set hota hai.
  // header receipt icon
  // TODO: ...
  const handleOpenPreview = useCallback(() => setPreviewVisible(true), []);
  // ── export handlers ──
  // NOTE: exports POORI list (itemList) use karte hain, filtered nahi —
  // search sirf item dhundhne ke liye hai, export se items na girein.
  const buildPlainText = useCallback(() => {
    const lines = itemList.map((it, idx) => {
      const notePart = it.note ? `  (${it.note})` : '';
      return `${idx + 1}. ${it.name} / ${it.nameHindi} — ${it.quantity} × ${it.unit
        }${notePart}`;
    });
    return `🛒 ${listName}\n\n${lines.join('\n')}\n\nTotal items: ${itemCount}`;
  }, [itemList, listName, itemCount]);

  const handleSaveDraft = useCallback(() => {
    // TODO: `items` ko AsyncStorage / backend me persist karo
    Alert.alert('Draft Save Ho Gaya! ✅', `${itemCount} items save ho gaye.`);
  }, [itemCount]);

  // const handleShareWhatsapp = useCallback(async () => {
  //   if (itemCount === 0) return;
  //   const text = buildPlainText();
  //   const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
  //   try {
  //     const supported = await Linking.canOpenURL(url);
  //     if (supported) {
  //       await Linking.openURL(url);
  //     } else {
  //       // WhatsApp na ho to native share sheet
  //       await Share.share({ message: text });
  //     }
  //   } catch {
  //     Alert.alert(
  //       'Share nahi ho paya',
  //       'WhatsApp installed hai ki nahi check kar lein.',
  //     );
  //   }
  // }, [itemCount, buildPlainText]);
  // Header share icon: phone ki share sheet, plain text list ke saath
  // (WhatsApp, SMS, email wagairah sab isi me aate hain)
  const handleShare = useCallback(async () => {
    if (itemCount === 0) return;
    try {
      await Share.share({ message: buildPlainText(), title: listName });
    } catch {
      Alert.alert('Could not share', 'Please try again.');
    }
  }, [itemCount, buildPlainText, listName]);

  const handleSaveAsPDF = useCallback(async () => {
    if (itemCount === 0) return;
    try {
      // PDF ek document hai (UI nahi), isliye uske colors theme se nahi aate
      const pdfCell = `padding:8px;border-bottom:1px solid ${lightColors.border};`;
      const pdfHead = `padding:8px;text-align:left;`;

      const rowsHtml = itemList
        .map(
          (it, idx) => `
  <tr>
    <td style="${pdfCell}">${idx + 1}</td>
    <td style="${pdfCell}">${it.name} (${it.nameHindi})</td>
    <td style="${pdfCell}">${it.unit}</td>
    <td style="${pdfCell}">${it.quantity}</td>
    <td style="${pdfCell}">${it.note ?? ''}</td>
  </tr>`,
        )
        .join('');

      const html = `
  <html><body style="font-family:sans-serif;padding:16px;color:${lightColors.textPrimary};">
    <h2>${listName}</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr style="background:${lightColors.cardBgVariant};">
        <th style="${pdfHead}">#</th>
        <th style="${pdfHead}">Item</th>
        <th style="${pdfHead}">Unit</th>
        <th style="${pdfHead}">Qty</th>
        <th style="${pdfHead}">Note</th>
      </tr>
      ${rowsHtml}
    </table>
  </body></html>`;

      const pdf = await generatePDF({
        html,
        fileName: `list-${Date.now()}`,
        base64: false,
      });

      if (pdf.filePath) {
        Alert.alert('PDF Ban Gaya ✅', pdf.filePath, [
          { text: 'OK' },
          { text: 'Share', onPress: () => Share.share({ url: pdf.filePath! }) },
        ]);
      }
    } catch (err) {
      Alert.alert(
        'PDF nahi ban paya',
        'react-native-html-to-pdf install + native rebuild check karein.',
      );
    }
  }, [itemList, listName, itemCount]);

  const handleSaveAsImage = useCallback(async () => {
    if (itemCount === 0) return;
    try {
      const uri = await captureRef.current?.capture?.();
      if (uri) {
        Alert.alert('Image Ban Gayi ✅', uri, [
          { text: 'OK' },
          { text: 'Share', onPress: () => Share.share({ url: uri }) },
        ]);
      }
    } catch (err) {
      Alert.alert(
        'Image nahi ban payi',
        'react-native-view-shot install + native rebuild check karein.',
      );
    }
  }, [itemCount]);
  // ── Download sheet ──
  const [downloadVisible, setDownloadVisible] = useState(false);
  const pendingDownload = useRef<'pdf' | 'image' | null>(null);

  // Pehle sheet band hogi, phir kaam chalega (iOS par sheet ke upar Alert nahi rukta)
  const chooseDownload = useCallback((type: 'pdf' | 'image') => {
    pendingDownload.current = type;
    setDownloadVisible(false);
  }, []);

  const handleDownloadDismissed = useCallback(() => {
    const type = pendingDownload.current;
    pendingDownload.current = null;
    if (type === 'pdf') handleSaveAsPDF();
    else if (type === 'image') handleSaveAsImage();
  }, [handleSaveAsPDF, handleSaveAsImage]);
  const renderItem = useCallback(
    ({ item }: { item: SelectedP }) => (
      <ListRow item={item} onEdit={handleEdit} />
    ),
    [handleEdit],
  );

  const editingItem = editingId ? items[editingId] : null;

  // ═══ collapsible search + chips bar ═══
  const [barHeight, setBarHeight] = useState(116);
  const barTranslateY = useRef(new Animated.Value(0)).current;
  const barHidden = useRef(false);
  const lastOffset = useRef(0);

  const showBar = useCallback(() => {
    if (!barHidden.current) return;
    barHidden.current = false;
    Animated.timing(barTranslateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY]);

  const hideBar = useCallback(() => {
    if (barHidden.current) return;
    barHidden.current = true;
    Animated.timing(barTranslateY, {
      toValue: -barHeight,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY, barHeight]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const diff = y - lastOffset.current;

      if (y <= 4) {
        showBar();
      } else if (diff > 2 && y > barHeight) {
        hideBar();
      } else if (diff < -2) {
        showBar();
      }

      lastOffset.current = y;
    },
    [barHeight, showBar, hideBar],
  );

  return (
    <View style={s.root}>
      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        {/* ═════════════════════════════ App Header ═════════════════════════════ */}
        <AppHeader
          title={listName}

          leftAction="back"
          rightIcon="share-outline"
          onRightPress={handleShare}
          showThemeToggle={false}
        />

        {/* Body: collapsible search/chips overlay + list */}
        <View style={s.body}>
          <Animated.View
            onLayout={e => setBarHeight(e.nativeEvent.layout.height)}
            style={[
              s.collapsibleBar,
              { transform: [{ translateY: barTranslateY }] },
            ]}
          >
            <View style={s.searchWrap}>
              <Icon
                name="magnify"
                size={20}
                color={colors.textMuted}
                style={s.searchIcon}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search this list..."
                placeholderTextColor={colors.textMuted}
                style={s.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.75}
                >
                  <Icon
                    name="close-circle"
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>

            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </Animated.View>

          {/* Sirf item cards ViewShot ke andar — "Save as Image" me search/chips nahi aate */}
          <ViewShot
            ref={captureRef}
            style={s.captureArea}
            options={{ format: 'png', quality: 0.95 }}
          >
            <FlatList
              data={filteredItems}
              keyExtractor={i => i.id}
              renderItem={renderItem}
              contentContainerStyle={[
                s.listContent,
                // { paddingTop: barHeight, paddingBottom: BOTTOM_BAR_H + 16 },  //92 
                { paddingTop: barHeight, paddingBottom: 24 },

              ]}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={s.emptyWrap}>
                  <Icon
                    name="basket-off-outline"
                    size={48}
                    color={colors.textMuted}
                  />
                  <Text style={s.emptyTxt}>
                    {itemCount === 0 ? 'List khali hai' : 'Kuch nahi mila'}
                  </Text>
                </View>
              }
            />
          </ViewShot>
        </View>

        <ExportBar
          onSaveDraft={handleSaveDraft}
          onDownload={() => setDownloadVisible(true)}
          disabled={itemCount === 0}
        />


        <DownloadSheet
          visible={downloadVisible}
          onClose={() => setDownloadVisible(false)}
          onDismissed={handleDownloadDismissed}
          onPdf={() => chooseDownload('pdf')}
          onImage={() => chooseDownload('image')}
        />
        <EditItemModal
          visible={!!editingItem}
          item={editingItem}
          onClose={() => setEditingId(null)}
          onSave={handleEditSave}
          onRemove={handleEditRemove}
        />

      </SafeAreaView>
    </View>
  );
};

export default List;