// src/features/list/screens/CreateListScreen.tsx
// isme sab whastsapp wala bhi . ye dark me he skybue jesi hi par a
// achha nhi lgi bahut chije iske lga to bad me dekh lunga . isme niche se share save ye sab niche senikalt he

import React, { useState, useCallback, useMemo, useRef } from 'react';
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
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CreateStackParamList } from '../../navigation/types/navigationTypes';

// ─── Nav types ────────────────────────────────────────────────────────────────
type RouteProps = RouteProp<CreateStackParamList, 'CreateListScreen'>;
type NavProp = NativeStackNavigationProp<
  CreateStackParamList,
  'CreateListScreen'
>;

// ─── DARK palette — exact same as CatalogScreen ───────────────────────────────
const DARK = {
  bg: '#1c110b',
  surface: '#251913',
  surfaceHigh: '#2d1e16',
  border: '#3a2418',
  primary: '#f97316',
  primaryMuted: '#2d1800',
  textPrimary: '#f6ded3',
  textMuted: '#a78b7d',
  chipBorder: '#584237',
  searchBg: '#1e1208',
  green: '#16a34a',
  red: '#dc2626',
};

const H_PADDING = 16;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_H = CARD_W * 0.82;
const HEADER_H = Platform.OS === 'ios' ? 52 : 58;

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
      style={{ flexGrow: 0 }}
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
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: H_PADDING,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
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
        <Icon name="minus" size={13} color="#fff" />
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
    backgroundColor: DARK.surfaceHigh,
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

// ─── Edit Note Modal — quantity + note edit ────────────────────────
const EditNoteModal = React.memo(
  ({
    product,
    quantity,
    note,
    onClose,
    onSave,
  }: {
    product: SelectedP;
    quantity: number;
    note: string;
    onClose: () => void;
    onSave: (qty: number, note: string) => void;
  }) => {
    const [qty, setQty] = useState(quantity);
    const [ntxt, setNtxt] = useState(note);

    return (
      <View style={em.overlay}>
        <TouchableOpacity
          style={em.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={em.sheet}>
          {/* Handle bar */}
          <View style={em.handle} />

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
          <Text style={em.label}>Note / टिप्पणी</Text>
          <TextInput
            value={ntxt}
            onChangeText={setNtxt}
            placeholder="e.g. Patanjali brand lena..."
            placeholderTextColor={DARK.textMuted}
            style={em.noteInput}
            multiline
            numberOfLines={2}
          />

          {/* Save */}
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
    );
  },
);
const em = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
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
    marginBottom: 16,
  },
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
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  noteInput: {
    backgroundColor: DARK.searchBg,
    borderWidth: 1,
    borderColor: DARK.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: DARK.textPrimary,
    marginBottom: 16,
    minHeight: 64,
  },
  saveBtn: {
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
const ProductCard = React.memo(
  ({
    product,
    selected,
    quantity,
    onAdd,
    onIncrease,
    onDecrease,
    onEdit,
  }: {
    product: Product;
    selected: boolean;
    quantity: number;
    onAdd: (id: string) => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onEdit: (id: string) => void;
  }) => (
    <View style={[pc.card, selected && pc.cardSelected]}>
      {/* Image */}
      <View style={pc.imgWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={pc.img}
          resizeMode="cover"
        />
        {product.isTopPick && (
          <View style={pc.topPick}>
            <Text style={pc.topPickTxt}>TOP PICK</Text>
          </View>
        )}
        {selected && (
          <View style={pc.overlay}>
            <Icon name="check-circle" size={30} color={DARK.primary} />
          </View>
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
              {/* LEFT: stepper */}
              <QuantityStepper
                quantity={quantity}
                onIncrease={() => onIncrease(product.id)}
                onDecrease={() => onDecrease(product.id)}
              />
              {/* RIGHT: edit icon (price ki jagah) */}
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
              {/* Unit pill */}
              <View style={pc.unitPill}>
                <Text style={pc.unitTxt}>{product.unit}</Text>
              </View>
              {/* Add button */}
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
    borderWidth: 1,
    borderColor: DARK.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  cardSelected: { borderColor: DARK.primary, borderWidth: 2 },
  imgWrap: {
    width: '100%',
    height: IMAGE_H,
    backgroundColor: DARK.surfaceHigh,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
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
    width: 34,
    height: 34,
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

// ═══════════════════════════════════════════════════════════════════
// FLOATING ACTION BAR — 3 buttons, slides up when first item added
// ═══════════════════════════════════════════════════════════════════
const FloatingBar = React.memo(
  ({
    count,
    onSave,
    onViewList,
    onShare,
    visible,
  }: {
    count: number;
    onSave: () => void;
    onViewList: () => void;
    onShare: () => void;
    visible: boolean;
  }) => {
    const translateY = useRef(new Animated.Value(100)).current;

    React.useEffect(() => {
      Animated.spring(translateY, {
        toValue: visible ? 0 : 100,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();
    }, [visible]);

    return (
      <Animated.View style={[fb.wrap, { transform: [{ translateY }] }]}>
        <View style={fb.bar}>
          {/* 1 — Save Draft */}
          <TouchableOpacity onPress={onSave} style={fb.btn} activeOpacity={0.8}>
            <View style={[fb.iconWrap, { backgroundColor: DARK.green }]}>
              <Icon name="content-save-outline" size={22} color="#fff" />
            </View>
            <Text style={fb.label}>Save</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={fb.divider} />

          {/* 2 — View List (center, bigger) */}
          <TouchableOpacity
            onPress={onViewList}
            style={[fb.btn, fb.btnCenter]}
            activeOpacity={0.8}
          >
            <View style={[fb.iconWrapLg, { backgroundColor: DARK.primary }]}>
              <Icon name="format-list-checks" size={26} color="#fff" />
              {/* Count badge */}
              <View style={fb.badge}>
                <Text style={fb.badgeTxt}>{count}</Text>
              </View>
            </View>
            <Text
              style={[fb.label, { color: DARK.primary, fontWeight: '700' }]}
            >
              View List
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={fb.divider} />

          {/* 3 — Share */}
          <TouchableOpacity
            onPress={onShare}
            style={fb.btn}
            activeOpacity={0.8}
          >
            <View style={[fb.iconWrap, { backgroundColor: '#6366f1' }]}>
              <Icon name="share-variant-outline" size={22} color="#fff" />
            </View>
            <Text style={fb.label}>Share</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  },
);

const fb = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 20, left: H_PADDING, right: H_PADDING },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: DARK.surface,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: DARK.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  btn: { alignItems: 'center', flex: 1, gap: 4 },
  btnCenter: { flex: 1.2 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapLg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11, fontWeight: '600', color: DARK.textMuted },
  divider: { width: 1, height: 40, backgroundColor: DARK.border },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DARK.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeTxt: { fontSize: 10, fontWeight: '800', color: DARK.bg },
});

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const CreateListScreen: React.FC = () => {
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

  const selectedCount = Object.keys(selectedProducts).length;
  const barVisible = selectedCount > 0;

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

  const handleEdit = useCallback((id: string) => setEditingId(id), []);

  const handleEditSave = useCallback(
    (qty: number, note: string) => {
      if (!editingId) return;
      setSelectedProducts(prev => ({
        ...prev,
        [editingId]: { ...prev[editingId], quantity: qty },
      }));
      setEditingId(null);
    },
    [editingId],
  );

  const handleSave = useCallback(() => {
    // TODO: AsyncStorage mein save karo
    Alert.alert(
      'Draft Save Ho Gaya! ✅',
      `${selectedCount} items save ho gaye.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  }, [selectedCount, navigation]);

  const handleViewList = useCallback(() => {
    // TODO: saved list view screen pe navigate karo
    Alert.alert(
      'Selected Items',
      Object.values(selectedProducts)
        .map(p => `• ${p.name} × ${p.quantity}`)
        .join('\n'),
    );
  }, [selectedProducts]);

  const handleShare = useCallback(() => {
    Alert.alert('Share', 'Share functionality aayegi!');
  }, []);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  // ── Render item ──
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        selected={!!selectedProducts[item.id]}
        quantity={selectedProducts[item.id]?.quantity ?? 0}
        onAdd={handleAdd}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onEdit={handleEdit}
      />
    ),
    [selectedProducts, handleAdd, handleIncrease, handleDecrease, handleEdit],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const editingProduct = editingId ? selectedProducts[editingId] : null;

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />

      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        {/* ── Header ── */}
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
            <Text style={s.headerSub}>
              {selectedCount > 0
                ? `${selectedCount} items selected`
                : 'Products choose karo'}
            </Text>
          </View>

          {/* Right — search toggle placeholder */}
          <View style={s.iconBtn} />
        </View>

        {/* ── Search ── */}
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

        {/* ── Category Chips ── */}
        <CategoryChips
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* ── Product Grid ── */}
        <FlatList
          data={filteredProducts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ gap: CARD_GAP }}
          contentContainerStyle={[
            s.gridContent,
            { paddingBottom: barVisible ? 110 : 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<EmptyList />}
          removeClippedSubviews
          maxToRenderPerBatch={6}
          windowSize={10}
          initialNumToRender={6}
        />

        {/* ── Floating Action Bar ── */}
        <FloatingBar
          count={selectedCount}
          visible={barVisible}
          onSave={handleSave}
          onViewList={handleViewList}
          onShare={handleShare}
        />

        {/* ── Edit Bottom Sheet ── */}
        {editingProduct && (
          <EditNoteModal
            product={editingProduct}
            quantity={editingProduct.quantity}
            note={''}
            onClose={() => setEditingId(null)}
            onSave={handleEditSave}
          />
        )}
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
  headerSub: { fontSize: 11, color: DARK.textMuted, marginTop: 1 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: H_PADDING,
    marginTop: 12,
    marginBottom: 12,
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

export default CreateListScreen;
