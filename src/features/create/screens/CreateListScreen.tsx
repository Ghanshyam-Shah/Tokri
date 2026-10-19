// src/features/list/screens/CreateListScreen.tsx

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import CollapsibleFilterBar from '../../../shared/components/filterBar/CollapsibleFilterBar';
import { useCollapsibleBar } from '../../../shared/hooks/useCollapsibleBar';
import EmptyState from '../../../shared/components/states/EmptyState';
import {CATEGORIES} from '../../../Data/DummyData'
import {Category} from '../../../Data/types'

import ProductCard, {
  CARD_GAP,
  GRID_H_PADDING,
} from '../../../shared/components/product/ProductCard';

// ─── Nav types ────────────────────────────────────────────────────────────────
type RouteProps = RouteProp<AppStackParamList, 'CreateListScreen'>;
type NavProp = NativeStackNavigationProp<
  AppStackParamList,
  'CreateListScreen'
>;
type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Layout constants (theme se independent) ──────────────────────────────────
const H_PADDING = 16;
const BOTTOM_BAR_H = 78;

// ─── Types ────────────────────────────────────────────────────────────────────
// interface Category {
//   id: string;
//   label: string;
//   labelHindi: string;
// }
interface Product {
  id: string;
  name: string;
  nameHindi: string;
  unit: string;
  categoryId: string;
  imageUrl: string;
  isTopPick: boolean;
}
interface SelectedP extends Product {
  quantity: number;
  note?: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────
// const CATEGORIES: Category[] = [
//   { id: 'all', label: 'All', labelHindi: 'सभी' },
//   { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
//   { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
//   { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
//   { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
//   { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
// ];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    unit: '1kg',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    isTopPick: true,
  },
  {
    id: '2',
    name: 'Organic Milk',
    nameHindi: 'जैविक दूध',
    unit: '1L',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    isTopPick: false,
  },
  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    unit: '5kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    isTopPick: true,
  },
  {
    id: '4',
    name: 'Toor Dal',
    nameHindi: 'अरहर दाल',
    unit: '1kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1599909631565-9921aaabb4a7?w=400&q=80',
    isTopPick: false,
  },
  {
    id: '5',
    name: 'Yellow Bell Pepper',
    nameHindi: 'पीली शिमला मिर्च',
    unit: '250g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    isTopPick: true,
  },
  {
    id: '6',
    name: 'Penne Pasta',
    nameHindi: 'पास्ता',
    unit: '500g',
    categoryId: 'snacks',
    imageUrl:
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
    isTopPick: false,
  },
  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    unit: '200g',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    isTopPick: true,
  },
  {
    id: '8',
    name: 'Carrots',
    nameHindi: 'गाजर',
    unit: '500g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    isTopPick: false,
  },
  {
    id: '9',
    name: 'Turmeric Powder',
    nameHindi: 'हल्दी पाउडर',
    unit: '200g',
    categoryId: 'spices',
    imageUrl:
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
    isTopPick: true,
  },
  {
    id: '10',
    name: 'Coriander Seeds',
    nameHindi: 'धनिया',
    unit: '100g',
    categoryId: 'spices',
    imageUrl:
      'https://images.unsplash.com/photo-1506368083636-6defb67639b2?w=400&q=80',
    isTopPick: false,
  },
];

// ═══════════════════════════════════════════════════════════════════
// STYLES (theme se) — saare sub-components ke liye ek jagah
// ═══════════════════════════════════════════════════════════════════
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  const onPrimary = colors.onPrimary; // primary ke upar ka text/icon
  const primaryMuted = colors.primaryMuted; // primary 6-digit hex hona chahiye

  return {

    // ── Quantity stepper ──
    qs: StyleSheet.create({
      row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
      btn: {
        width: 26,
        height: 26,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      btnFilled: { backgroundColor: colors.primary },
      count: {
        fontSize: typography.sm,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
        minWidth: 18,
        textAlign: 'center',
      },
    }),

    // ── Edit note modal ──
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
      },
      qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        marginTop: spacing.sm,
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
      noteHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
      },
      charCount: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.regular,
        color: colors.textMuted,
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
        marginBottom: spacing.lg + 2,
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

    // ── Product card ──
    // borderWidth hamesha 1.5; select hone par sirf color badalta hai, taaki
    // grid reflow na ho.
   // ── Product card footer (shared ProductCard ke andar jaata hai) ──
pc: StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitPill: {
    backgroundColor: colors.cardBgVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  unitTxt: {
    fontSize: typography.xs,
    fontFamily: fontFamilies.semiBold,
    color: colors.textMuted,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.md - 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}),
    // ── List preview modal ──
    pm: StyleSheet.create({
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
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md + 2,
      },
      title: {
        fontSize: typography.md,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
      },
      emptyTxt: {
        color: colors.textMuted,
        fontFamily: fontFamilies.regular,
        textAlign: 'center',
        paddingVertical: spacing.xxxl,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm + 2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      },
      thumb: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.appBackground,
      },
      rowName: {
        fontSize: typography.sm,
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
      },
      rowSub: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.regular,
        color: colors.textMuted,
        marginTop: 1,
      },
      rowNote: {
        fontSize: typography.xs,
        fontFamily: fontFamilies.regular,
        color: colors.textMuted,
        marginTop: 2,
      },
    }),

    // ── Bottom action bar ──
    ab: StyleSheet.create({
      wrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: H_PADDING,
        paddingTop: spacing.xs + 2,
        paddingBottom: Platform.OS === 'ios' ? 28 : spacing.xs + 2,
        backgroundColor: colors.appBackground,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        gap: spacing.sm,
      },
      circleBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      continueBtn: {
        flex: 1,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
      },
      continueDisabled: { opacity: 0.4 },
      continueTxt: {
        fontSize: typography.md,
        fontFamily: fontFamilies.semiBold,
        color: onPrimary,
      },
    }),

    // ── Screen ──
    s: StyleSheet.create({
      root: { flex: 1, backgroundColor: colors.appBackground },
      safeArea: { flex: 1, backgroundColor: colors.appBackground },
      body: { flex: 1 },

      gridContent: { paddingHorizontal: H_PADDING, gap: CARD_GAP },
    }),
  };
};

// Theme ke hisaab se styles cache — har card/component apni stylesheet dobara
// nahi banata. Theme badalne par (toggle) naya set ban jata hai.
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
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// ─── Category Chips ───────────────────────────────────────────────
// flexShrink:0 (ScrollView + chip) aur numberOfLines={1}: chips compress nahi
// hote chahe neeche grid kitna bhi bada ho.

// ─── Quantity Stepper ─────────────────────────────────────────────
const QuantityStepper = React.memo(
  ({
    quantity,
    onIncrease,
    onDecrease,
  }: {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }) => {
    const { theme, qs } = useStyles();
    const { colors } = theme;

    return (
      <View style={qs.row}>
        <TouchableOpacity
          onPress={onDecrease}
          style={qs.btn}
          activeOpacity={0.75}
        >
          <Icon name="minus" size={13} color={colors.primary} />
        </TouchableOpacity>
        <Text style={qs.count}>{quantity}</Text>
        <TouchableOpacity
          onPress={onIncrease}
          style={[qs.btn, qs.btnFilled]}
          activeOpacity={0.75}
        >
          <Icon name="plus" size={13} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    );
  },
);

// ─── Edit Note Modal ──────────────────────────────────────────────
const EditNoteModal = React.memo(
  ({
    visible,
    product,
    quantity,
    note,
    onClose,
    onSave,
    onRemove,
  }: {
    visible: boolean;
    product: SelectedP | null;
    quantity: number;
    note: string;
    onClose: () => void;
    onSave: (qty: number, note: string) => void;
    onRemove: () => void;
  }) => {
    const { theme, em } = useStyles();
    const { colors } = theme;

    const [qty, setQty] = useState(quantity);
    const [ntxt, setNtxt] = useState(note);

    // naya product edit hone par local state sync
    useEffect(() => {
      setQty(quantity);
      setNtxt(note);
    }, [product?.id, quantity, note]);

    if (!product) return null;

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

            {/* Product info */}
            <View style={em.productRow}>
              <Image source={{ uri: product.imageUrl }} style={em.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={em.pName}>{product.name}</Text>
                <Text style={em.pHindi}>
                  {product.nameHindi} • {product.unit}
                </Text>
              </View>
            </View>

            {/* Quantity */}
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
              <Text style={em.unitTag}>{product.unit} each</Text>
            </View>

            {/* Note */}
            <View style={em.noteHeaderRow}>
              <Text style={em.label}>Note / टिप्पणी</Text>
              <Text style={em.charCount}>{ntxt.length}/120</Text>
            </View>
            <TextInput
              value={ntxt}
              onChangeText={t => setNtxt(t.slice(0, 120))}
              placeholder="e.g. Patanjali brand lena..."
              placeholderTextColor={colors.textMuted}
              style={em.noteInput}
              multiline
              numberOfLines={2}
            />

            {/* Actions */}
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

// ─── Product Card ─────────────────────────────────────────────────
// ─── Product Card (shared ProductCard + select/stepper footer) ────
const SelectableProductCard = React.memo(
  ({
    product,
    selected,
    quantity,
    hasNote,
    onAdd,
    onIncrease,
    onDecrease,
    onEdit,
    onRemove,
  }: {
    product: Product;
    selected: boolean;
    quantity: number;
    hasNote: boolean;
    onAdd: (id: string) => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
  }) => {
    const { theme, pc } = useStyles();
    const { colors } = theme;

    return (
      <ProductCard
        product={product}
        subtitle={`${product.nameHindi} • ${product.unit}`}
        selected={selected}
        hasNote={hasNote}
        onDeselect={() => onRemove(product.id)}
      >
        <View style={pc.bottomRow}>
          {selected ? (
            <>
              <QuantityStepper
                quantity={quantity}
                onIncrease={() => onIncrease(product.id)}
                onDecrease={() => onDecrease(product.id)}
              />
              <TouchableOpacity
                onPress={() => onEdit(product.id)}
                activeOpacity={0.8}
                style={pc.editBtn}
              >
                <Icon
                  name="pencil-outline"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={pc.unitPill}>
                <Text style={pc.unitTxt}>{product.unit}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onAdd(product.id)}
                activeOpacity={0.85}
                style={pc.addBtn}
              >
                <Icon name="plus" size={18} color={colors.onPrimary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ProductCard>
    );
  },
);

// ─── List Preview Modal (header ke receipt icon se khulta hai) ────
const ListPreviewModal = React.memo(
  ({
    visible,
    items,
    onClose,
    onEdit,
  }: {
    visible: boolean;
    items: SelectedP[];
    onClose: () => void;
    onEdit: (id: string) => void;
  }) => {
    const { theme, pm, em } = useStyles();
    const { colors } = theme;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={pm.overlay}>
          <TouchableOpacity
            style={pm.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={pm.sheet}>
            <View style={em.handle} />
            <View style={pm.headerRow}>
              <Text style={pm.title}>List Preview ({items.length})</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {items.length === 0 ? (
              <Text style={pm.emptyTxt}>Abhi koi item select nahi hua</Text>
            ) : (
              <ScrollView
                style={{ maxHeight: 420 }}
                showsVerticalScrollIndicator={false}
              >
                {items.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={pm.row}
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      onEdit(item.id);
                    }}
                  >
                    <Image source={{ uri: item.imageUrl }} style={pm.thumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={pm.rowName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={pm.rowSub}>
                        {item.unit} · Qty {item.quantity}
                      </Text>
                      {!!item.note && (
                        <Text style={pm.rowNote} numberOfLines={1}>
                          <Icon
                            name="note-text-outline"
                            size={11}
                            color={colors.textMuted}
                          />{' '}
                          {item.note}
                        </Text>
                      )}
                    </View>
                    <Icon
                      name="pencil-outline"
                      size={16}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// BOTTOM ACTION BAR — Save (circle) · Continue (pill) · Share (circle)
// ═══════════════════════════════════════════════════════════════════
const ActionBar = React.memo(
  ({
    onSaveDraft,
    onContinue,
    onShare,
    continueDisabled,
  }: {
    onSaveDraft: () => void;
    onContinue: () => void;
    onShare: () => void;
    continueDisabled: boolean;
  }) => {
    const { theme, ab } = useStyles();
    const { colors } = theme;

    return (
      <View style={ab.wrap}>
        <TouchableOpacity
          onPress={onSaveDraft}
          activeOpacity={0.85}
          style={ab.circleBtn}
        >
          <Icon name="content-save-outline" size={22} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onContinue}
          disabled={continueDisabled}
          activeOpacity={0.9}
          style={[ab.continueBtn, continueDisabled && ab.continueDisabled]}
        >
          <Text style={ab.continueTxt}>Continue</Text>
          <Icon
            name="arrow-right"
            size={18}
            color={colors.onPrimary}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          activeOpacity={0.85}
          style={ab.circleBtn}
        >
          <Icon
            name="share-variant-outline"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const CreateListScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { s } = useStyles();
  // const { colors } = theme;

  const listName = route.params?.listName ?? 'Nayi List';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, SelectedP>
  >({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const selectedCount = Object.keys(selectedProducts).length;

  // last SAVED state vs current — back dabane par unsaved changes check
  const savedSnapshotRef = useRef<string>(JSON.stringify({}));

  // back (header button, gesture, hardware) — stack me beforeRemove sabke liye fire hota hai
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      const hasChanges =
        JSON.stringify(selectedProducts) !== savedSnapshotRef.current;
      if (!hasChanges) return;
      e.preventDefault();
      Alert.alert(
        'List save nahi hui',
        'Aap is list ko chhod ke jaana chahte hain?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => { } },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
          {
            text: 'Save & Exit',
            onPress: () => {
              savedSnapshotRef.current = JSON.stringify(selectedProducts);
              navigation.dispatch(e.data.action);
            },
          },
        ],
      );
    });
    return unsubscribe;
  }, [navigation, selectedProducts]);

  // ── Filter ──
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(p => {
      const catOk =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      const srchOk =
        p.name.toLowerCase().includes(q) || p.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [selectedCategory, searchQuery]);

  // ── Handlers ──
  const handleAdd = useCallback((id: string) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    setSelectedProducts(prev => ({
      ...prev,
      [id]: { ...product, quantity: 1 },
    }));
  }, []);

  const handleIncrease = useCallback((id: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [id]: { ...prev[id], quantity: prev[id].quantity + 1 },
    }));
  }, []);

  const handleDecrease = useCallback((id: string) => {
    setSelectedProducts(prev => {
      if ((prev[id]?.quantity ?? 0) <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: { ...prev[id], quantity: prev[id].quantity - 1 },
      };
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleEdit = useCallback((id: string) => setEditingId(id), []);

  const handleEditSave = useCallback(
    (qty: number, note: string) => {
      if (!editingId) return;
      setSelectedProducts(prev => ({
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

  const handleEditRemove = useCallback(() => {
    if (!editingId) return;
    handleRemove(editingId);
    setEditingId(null);
  }, [editingId, handleRemove]);

  // bottom-bar Save — navigate nahi karta
  const handleSaveDraft = useCallback(() => {
    // TODO: AsyncStorage / backend me persist karo
    savedSnapshotRef.current = JSON.stringify(selectedProducts);
    Alert.alert(
      'Draft Save Ho Gaya! ✅',
      `${selectedCount} items save ho gaye.`,
    );
  }, [selectedProducts, selectedCount]);

  // Continue — flow me aage (List screen)
  const handleContinue = useCallback(() => {
    if (selectedCount === 0) return;
    savedSnapshotRef.current = JSON.stringify(selectedProducts);
    navigation.navigate('List', {
      listId: route.params?.listId,
      listName,
      items: Object.values(selectedProducts),
    });
  }, [
    selectedCount,
    selectedProducts,
    navigation,
    route.params?.listId,
    listName,
  ]);

  const handleShare = useCallback(() => {
    Alert.alert('Share', 'Share functionality aayegi!');
  }, []);

  const selectedList = useMemo(
    () => Object.values(selectedProducts),
    [selectedProducts],
  );

  // ── Render item ──
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <SelectableProductCard
        product={item}
        selected={!!selectedProducts[item.id]}
        quantity={selectedProducts[item.id]?.quantity ?? 0}
        hasNote={!!selectedProducts[item.id]?.note}
        onAdd={handleAdd}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />
    ),
    [
      selectedProducts,
      handleAdd,
      handleIncrease,
      handleDecrease,
      handleEdit,
      handleRemove,
    ],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const editingProduct = editingId ? selectedProducts[editingId] : null;

  // ═══ collapsible search + chips bar ═══
  const { barHeight, barTranslateY, onBarLayout, handleScroll } =
    useCollapsibleBar();

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        {/* ═════════════════════════════ App Header ═════════════════════════════ */}
        <AppHeader
          title={listName}
          leftAction="back"
          rightIcon="receipt-outline"
          rightIconSet="ionicons"
          onRightPress={() => setPreviewVisible(true)}
          rightBadge={selectedCount}
          showThemeToggle={false}
        />

        {/* ── Body: collapsible search/chips overlay + product grid ── */}
        <View style={s.body}>
          <CollapsibleFilterBar
            translateY={barTranslateY}
            onLayout={onBarLayout}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search catalog / सूची खोजें..."
            chips={CATEGORIES}
            selectedChipId={selectedCategory}
            onSelectChip={setSelectedCategory}
          />

          <FlatList
            data={filteredProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: CARD_GAP }}
            contentContainerStyle={[
              s.gridContent,
              { paddingTop: barHeight, paddingBottom: BOTTOM_BAR_H + 24 },
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                icon="basket-off-outline"
                title="Koi product nahi mila"
                subtitle="Try another search or category"
              />
            }
            removeClippedSubviews
            maxToRenderPerBatch={6}
            windowSize={10}
            initialNumToRender={6}
          />
        </View>

        {/* ── Bottom Action Bar ── */}
        <ActionBar
          onSaveDraft={handleSaveDraft}
          onContinue={handleContinue}
          onShare={handleShare}
          continueDisabled={selectedCount === 0}
        />

        {/* ── List Preview Modal ── */}
        <ListPreviewModal
          visible={previewVisible}
          items={selectedList}
          onClose={() => setPreviewVisible(false)}
          onEdit={handleEdit}
        />

        {/* ── Edit Modal ── */}
        <EditNoteModal
          visible={!!editingProduct}
          product={editingProduct ?? null}
          quantity={editingProduct?.quantity ?? 1}
          note={editingProduct?.note ?? ''}
          onClose={() => setEditingId(null)}
          onSave={handleEditSave}
          onRemove={handleEditRemove}
        />
      </SafeAreaView>
    </View>
  );
};

export default CreateListScreen;