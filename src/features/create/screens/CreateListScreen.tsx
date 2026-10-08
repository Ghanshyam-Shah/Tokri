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
  StatusBar,
  Platform,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Modal,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RouteProp,
  useNavigation,
  useRoute,
  DrawerActions,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CreateStackParamList } from '../../../navigation/types/navigationTypes';
// import { CreateStackParamList } from '../../navigation/types/navigationTypes';
// import { CreateStackParamList } from '../../../navigation/types/navigationTypes';
// import AppHeader from '../../../shared/components/headers/AppHeader';

// ─── Nav types ────────────────────────────────────────────────────────────────
type RouteProps = RouteProp<CreateStackParamList, 'CreateListScreen'>;
type NavProp = NativeStackNavigationProp<
  CreateStackParamList,
  'CreateListScreen'
>;

// ═══════════════════════════════════════════════════════════════════
// THEME SYSTEM — swap ACTIVE_THEME below to preview each palette.
// All four share the same keys, so switching is a one-line change.
// ═══════════════════════════════════════════════════════════════════
const THEMES = {
  ember: {
    bg: '#ffffff',
    surface: 'white',
    surfaceHigh: '#2d1e16',
    border: '#3a2418',
    primary: 'skyblue',
    primaryMuted: '#2d1800',
    textPrimary: 'black',
    textMuted: 'black',
    chipBorder: '#584237',
    searchBg: '#1e1208',
    green: '#16a34a',
    red: '#dc2626',
    accent: '#fb923c',
  },
  skySlate: {
    // bg: '#F7FAFC',
    bg: '#FFFFFF',

    surface: '#FFFFFF',

    surfaceHigh: '#F0F6FA',
    border: '#DCE7EE',
    primary: 'skyblue',
    primaryMuted: '#EAF4FA',
    textPrimary: '#263640',
    textMuted: '#71818C',
    chipBorder: '#D5E2E9',
    searchBg: '#F3F7F9',
    green: '#5FA77A',
    red: '#D97878',
    accent: '#8AA7B8',
  },
  softPink: {
    bg: '#FDF9FB',
    surface: '#FFFFFF',
    surfaceHigh: '#FAF3F6',
    border: '#EDE1E6',
    primary: '#DFA6B8',
    primaryMuted: '#FCEFF3',
    textPrimary: '#3B3438',
    textMuted: '#897D83',
    chipBorder: '#E7DBE0',
    searchBg: '#FAF5F7',
    green: '#70A383',
    red: '#D58089',
    accent: '#B79CA7',
  },

  cloudLavender: {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceHigh: '#F2F5FA',
    border: '#DEE5EE',

    primary: '#7B9FC2',
    primaryMuted: '#EDF3F9',

    textPrimary: '#28343F',
    textMuted: '#788592',

    chipBorder: '#D9E1E9',
    searchBg: '#F4F7FA',

    green: '#6FA486',
    red: '#D47F87',

    accent: '#9A9FBC',
  },
  mist: {
    bg: '#F8FAFA',
    surface: '#FFFFFF',
    surfaceHigh: '#F1F6F6',
    border: '#DDE7E7',

    primary: '#78A9B5',
    primaryMuted: '#EAF4F5',

    textPrimary: '#29383B',
    textMuted: '#758589',

    chipBorder: '#D8E3E4',
    searchBg: '#F3F7F7',

    green: '#70A185',
    red: '#D17F83',

    accent: '#91A8A8',
  },
  porcelainBlue: {
    bg: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceHigh: '#F3F6F9',
    border: '#E0E6EB',

    primary: '#82AFCB',
    primaryMuted: '#EEF5F9',

    textPrimary: '#29363F',
    textMuted: '#7A8790',

    chipBorder: '#DCE4E9',
    searchBg: '#F5F8FA',

    green: '#71A386',
    red: '#D48389',

    accent: '#9BAFBC',
  },
} as const;

// 👇 Change this to 'ocean' | 'forest' | 'midnight' | 'ember' to test each theme
// const ACTIVE_THEME: keyof typeof THEMES = 'porcelainBlue';
const ACTIVE_THEME: keyof typeof THEMES = 'skySlate';

const DARK = THEMES[ACTIVE_THEME];

const H_PADDING = 16;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_H = CARD_W * 0.82;
// const HEADER_H = Platform.OS === 'ios' ? 52 : 58;
const HEADER_H = Platform.OS === 'ios' ? 52 : 52;

const BOTTOM_BAR_H = 78;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  labelHindi: string;
}
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
const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

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
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// ─── Category Chips ───────────────────────────────────────────────
// FIX (point 4): chips were compressing because the ScrollView itself had no
// explicit flexShrink:0, and the chip Text had no numberOfLines. Inside a
// horizontal ScrollView, RN can still let a row's children be squeezed by
// sibling re-layouts (e.g. FlatList mounting below) unless every node in the
// chain explicitly opts out of shrinking. flexShrink:0 on the ScrollView +
// the chip + numberOfLines={1} on the text locks their size regardless of
// how many products are in the grid below.
const CategoryChips = React.memo(
  ({
    categories,
    selected,
    onSelect,
  }: {
    categories: Category[];
    selected: string;
    onSelect: (id: string) => void;
  }) => (
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
              style={[ch.text, { color: active ? '#fff' : DARK.textMuted }]}
              numberOfLines={1}
            >
              {cat.label} / {cat.labelHindi}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  ),
);
const ch = StyleSheet.create({
  scrollStyle: { flexGrow: 0, flexShrink: 0 },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: H_PADDING,
    paddingVertical: 4,
  },
  chip: {
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  active: { backgroundColor: DARK.primary, borderColor: DARK.primary },
  inactive: { borderColor: DARK.chipBorder },
  text: { fontSize: 13, fontWeight: '500' },
});

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
  }) => (
    <View style={qs.row}>
      <TouchableOpacity
        onPress={onDecrease}
        style={qs.btn}
        activeOpacity={0.75}
      >
        <Icon name="minus" size={13} color={DARK.primary} />
      </TouchableOpacity>
      <Text style={qs.count}>{quantity}</Text>
      <TouchableOpacity
        onPress={onIncrease}
        style={[qs.btn, { backgroundColor: DARK.primary }]}
        activeOpacity={0.75}
      >
        <Icon name="plus" size={13} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
);
const qs = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  btn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK.textPrimary,
    minWidth: 18,
    textAlign: 'center',
  },
});

// ─── Edit Note Modal — now a real Modal, keyboard-aware, with remove ────────
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
    const [qty, setQty] = useState(quantity);
    const [ntxt, setNtxt] = useState(note);

    // keep local state in sync whenever a new product is opened for editing
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
                <Icon name="close" size={22} color={DARK.textMuted} />
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
                style={[em.qBtn, { backgroundColor: DARK.surfaceHigh }]}
              >
                <Icon name="minus" size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={em.qCount}>{qty}</Text>
              <TouchableOpacity
                onPress={() => setQty(q => q + 1)}
                style={[em.qBtn, { backgroundColor: DARK.primary }]}
              >
                <Icon name="plus" size={16} color="#fff" />
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
              placeholderTextColor={DARK.textMuted}
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
                  color={DARK.red}
                  style={{ marginRight: 6 }}
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
                  color="#fff"
                  style={{ marginRight: 6 }}
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
const em = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: DARK.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 1,
    borderTopColor: DARK.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: DARK.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: DARK.textPrimary },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    padding: 12,
    backgroundColor: DARK.surfaceHigh,
    borderRadius: 12,
  },
  thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: DARK.bg },
  pName: { fontSize: 15, fontWeight: '700', color: DARK.textPrimary },
  pHindi: { fontSize: 12, color: DARK.textMuted, marginTop: 2 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: DARK.textMuted,
    letterSpacing: 0.5,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  qBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qCount: {
    fontSize: 20,
    fontWeight: '800',
    color: DARK.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  unitTag: { fontSize: 12, color: DARK.textMuted, marginLeft: 4 },
  noteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCount: { fontSize: 11, color: DARK.textMuted },
  noteInput: {
    backgroundColor: DARK.searchBg,
    borderWidth: 1,
    borderColor: DARK.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: DARK.textPrimary,
    marginBottom: 18,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: DARK.red,
  },
  removeTxt: { fontSize: 14, fontWeight: '700', color: DARK.red },
  saveBtn: {
    flex: 1,
    height: 50,
    backgroundColor: DARK.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

// ─── Product Card ─────────────────────────────────────────────────
// FIX (point 5): borderWidth used to jump 1 -> 2 on selection, nudging every
// card's box size and causing the whole grid to visibly reflow when an item
// was added/removed. Border is now always 2px; only the color changes
// (transparent <-> primary), so the box size never changes.
const ProductCard = React.memo(
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
  }) => (
    <View style={[pc.card, selected && pc.cardSelected]}>
      {/* Image */}
      <View style={pc.imgWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={pc.img}
          resizeMode="cover"
        />

        {hasNote && (
          <View style={pc.noteBadge}>
            <Icon name="note-text-outline" size={12} color="#fff" />
          </View>
        )}

        {product.isTopPick && (
          <View style={pc.topPick}>
            <Text style={pc.topPickTxt}>TOP PICK</Text>
          </View>
        )}
        {selected && (
          // point 6: tapping the tick now removes the item directly
          <TouchableOpacity
            style={pc.overlay}
            activeOpacity={0.8}
            onPress={() => onRemove(product.id)}
          >
            <Icon name="check-circle" size={30} color={DARK.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      <View style={pc.body}>
        <Text style={pc.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={pc.hindi} numberOfLines={1}>
          {product.nameHindi} • {product.unit}
        </Text>

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
                <Icon name="pencil-outline" size={16} color={DARK.primary} />
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
                <Icon name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  ),
);

const pc = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: DARK.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: { borderColor: DARK.primary },
  imgWrap: {
    width: '100%',
    height: IMAGE_H,
    backgroundColor: DARK.surfaceHigh,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  noteBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPick: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: DARK.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
  },
  topPickTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 10, paddingTop: 9, paddingBottom: 10, gap: 3 },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK.textPrimary,
    letterSpacing: 0.1,
  },
  hindi: { fontSize: 11, color: DARK.textMuted, marginBottom: 6 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitPill: {
    backgroundColor: DARK.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitTxt: { fontSize: 11, color: DARK.textMuted, fontWeight: '600' },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Empty state ──────────────────────────────────────────────────
const EmptyList = React.memo(() => (
  <View style={{ alignItems: 'center', paddingVertical: 64, gap: 10 }}>
    <Icon name="basket-off-outline" size={52} color={DARK.textMuted} />
    <Text style={{ color: DARK.textPrimary, fontSize: 16, fontWeight: '600' }}>
      Koi product nahi mila
    </Text>
    <Text style={{ color: DARK.textMuted, fontSize: 13 }}>
      Try another search or category
    </Text>
  </View>
));

// ─── List Preview Modal (opened from the header cart icon) ────────
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
  }) => (
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
              <Icon name="close" size={22} color={DARK.textPrimary} />
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
                          color={DARK.textMuted}
                        />{' '}
                        {item.note}
                      </Text>
                    )}
                  </View>
                  <Icon name="pencil-outline" size={16} color={DARK.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  ),
);
const pm = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: DARK.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 1,
    borderTopColor: DARK.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontSize: 16, fontWeight: '700', color: DARK.textPrimary },
  emptyTxt: { color: DARK.textMuted, textAlign: 'center', paddingVertical: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DARK.border,
  },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: DARK.bg },
  rowName: { fontSize: 14, fontWeight: '700', color: DARK.textPrimary },
  rowSub: { fontSize: 12, color: DARK.textMuted, marginTop: 1 },
  rowNote: { fontSize: 11, color: DARK.textMuted, marginTop: 2 },
});

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
  }) => (
    <View style={ab.wrap}>
      <TouchableOpacity
        onPress={onSaveDraft}
        activeOpacity={0.85}
        style={[
          ab.circleBtn,
          {
            borderWidth: 1,
            borderColor: DARK.primary,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Icon name="content-save-outline" size={22} color={DARK.primary} />
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
          color="#fff"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onShare}
        activeOpacity={0.85}
        style={[
          ab.circleBtn,
          {
            borderWidth: 1,
            borderColor: DARK.primary,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Icon name="share-variant-outline" size={20} color={DARK.primary} />
      </TouchableOpacity>
    </View>
  ),
);
const ab = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 28 : 6,
    backgroundColor: DARK.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DARK.border,
    gap: 8,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 0,
  },
  continueBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: DARK.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 0,
  },
  continueDisabled: { opacity: 0.4 },
  continueTxt: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const TempCreateListScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();

  const listId = route.params?.listId ?? 'draft';
  const listName = route.params?.listName ?? 'Nayi List';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, SelectedP>
  >({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const selectedCount = Object.keys(selectedProducts).length;

  // ── point 13: track what was last SAVED vs current state, so we know
  // whether there really are unsaved changes before prompting on back ──
  const savedSnapshotRef = useRef<string>(JSON.stringify({}));

  // ── point 9: intercept back (header button, gesture, hardware back —
  // beforeRemove fires for all three on a stack navigator) ──
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      const hasChanges =
        JSON.stringify(selectedProducts) !== savedSnapshotRef.current;
      if (!hasChanges) return; // nothing to protect, let it go
      e.preventDefault();
      Alert.alert(
        'List save nahi hui',
        'Aap is list ko chhod ke jaana chahte hain?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
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

  // point 13: this is the bottom-bar Save — it must NOT navigate away
  const handleSaveDraft = useCallback(() => {
    // TODO: persist to AsyncStorage / backend here
    savedSnapshotRef.current = JSON.stringify(selectedProducts);
    Alert.alert(
      'Draft Save Ho Gaya! ✅',
      `${selectedCount} items save ho gaye.`,
    );
  }, [selectedProducts, selectedCount]);

  // point 8: Continue moves forward in the flow
  const handleContinue = useCallback(() => {
    if (selectedCount === 0) return;
    savedSnapshotRef.current = JSON.stringify(selectedProducts);
    // TODO: swap 'NextScreenName' for the actual next route in CreateStackParamList
    navigation.navigate('List' as never);
  }, [selectedCount, selectedProducts, navigation]);

  const handleShare = useCallback(() => {
    Alert.alert('Share', 'Share functionality aayegi!');
  }, []);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const selectedList = useMemo(
    () => Object.values(selectedProducts),
    [selectedProducts],
  );

  // ── Render item ──
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
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

  // ═══ point 14: collapsible search + chips bar ═══════════════════
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

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={DARK.primary} />

      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        {/* ── Header: title only + cart-style preview icon ── */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.iconBtn}
          >
            <Icon name="arrow-left" size={24} color={DARK.textPrimary} />
          </TouchableOpacity>

          <View style={s.headerCenter}>
            <Text style={s.headerTitle} numberOfLines={1}>
              {listName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setPreviewVisible(true)}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.iconBtn}
          >
            <Ionicons
              name="receipt-outline"
              size={20}
              color={DARK.textPrimary}
            />
            {selectedCount > 0 && (
              <View style={s.cartBadge}>
                <Text style={s.cartBadgeTxt}>
                  {selectedCount > 99 ? '99+' : selectedCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* <AppHeader
          title="Product Details"
          leftIcon="menu"
          onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        /> */}
        {/* ── Body: collapsible search/chips overlay + product grid ── */}
        <View style={{ flex: 1 }}>
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
                color={DARK.textMuted}
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search catalog / सूची खोजें..."
                placeholderTextColor={DARK.textMuted}
                style={s.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.75}
                >
                  <Icon name="close-circle" size={18} color={DARK.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </Animated.View>

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
            ListEmptyComponent={<EmptyList />}
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

        {/* ── List Preview Modal (from header cart icon) ── */}
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

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK.bg },
  safeArea: { flex: 1, backgroundColor: DARK.bg },

  header: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DARK.border,
    zIndex: 20,
    backgroundColor: DARK.bg,
    // backgroundColor: "red",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK.textPrimary,
    letterSpacing: 0.2,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeTxt: { fontSize: 9, fontWeight: '800', color: '#fff' },

  // point 14: absolute overlay so hiding it doesn't leave a gap — the
  // FlatList's paddingTop (=barHeight) reserves the space underneath.
  collapsibleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: DARK.bg,
    paddingBottom: 8,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: H_PADDING,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: DARK.searchBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DARK.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK.textPrimary,
    paddingVertical: 0,
  },

  gridContent: { paddingHorizontal: H_PADDING, gap: CARD_GAP },
});

export default TempCreateListScreen;
