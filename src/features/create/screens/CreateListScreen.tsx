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
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
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
import ProductCard, {
  CARD_GAP,
  GRID_H_PADDING,
} from '../../../shared/components/product/ProductCard';
import QuantityStepper from '../../../shared/components/product/QuantityStepper';
import ListSheet, { SheetView } from '../../list/components/ListSheet';
import { Product, SelectedProduct } from '../../../Data/types';
import { useCatalog } from '../../catalog/hooks/useCatalog';
import CatalogListEmpty from '../../catalog/components/CatalogListEmpty';
import { buildSelectedFromCatalog } from '../../../shared/utils/prefillFromSource';

// ─── Nav types ────────────────────────────────────────────────────────────────
type RouteProps = RouteProp<AppStackParamList, 'CreateListScreen'>;
type NavProp = NativeStackNavigationProp<
  AppStackParamList,
  'CreateListScreen'
>;
type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Layout constants (theme se independent) ──────────────────────────────────
const H_PADDING = 16;

// ═══════════════════════════════════════════════════════════════════
// STYLES (theme se) — screen ke sub-components ke liye ek jagah
// ═══════════════════════════════════════════════════════════════════
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  const onPrimary = colors.onPrimary; // primary ke upar ka text/icon

  return {
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

    // ── Bottom action bar ──
    // Absolute nahi: list ke neeche normal sibling. Bottom safe-area ka dhyan
    // SafeAreaView (edges 'bottom') rakhta hai, isliye extra padding nahi.
    // ── Bottom action bar (Save as draft + Continue) ──
    // Absolute nahi: list ke neeche normal sibling. Bottom safe-area ka dhyan
    // SafeAreaView (edges 'bottom') rakhta hai, isliye extra padding nahi.
    ab: StyleSheet.create({
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
      continueBtn: { backgroundColor: colors.primary, ...shadows.sm },
      continueDisabled: { opacity: 0.4 },
      draftTxt: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.semiBold,
        color: colors.primary,
      },
      continueTxt: {
        fontSize: typography.sm + 1,
        fontFamily: fontFamilies.semiBold,
        color: onPrimary,
      },
    }),

    // ── Screen ──
    s: StyleSheet.create({
      root: { flex: 1, backgroundColor: colors.appBackground },
      safeArea: { flex: 1, backgroundColor: colors.appBackground },
      body: { flex: 1 },

      gridContent: { paddingHorizontal: GRID_H_PADDING, gap: CARD_GAP },
    }),
  };
};

// Theme ke hisaab se styles cache — har component apni stylesheet dobara
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

// ═══════════════════════════════════════════════════════════════════
// BOTTOM ACTION BAR — Save (circle) · Continue (pill) · Share (circle)
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// BOTTOM ACTION BAR — Save as draft · Continue
// ═══════════════════════════════════════════════════════════════════
const ActionBar = React.memo(
  ({
    onSaveDraft,
    onContinue,
    continueDisabled,
  }: {
    onSaveDraft: () => void;
    onContinue: () => void;
    continueDisabled: boolean;
  }) => {
    const { theme, ab } = useStyles();
    const { colors } = theme;

    return (
      <View style={ab.wrap}>
        <TouchableOpacity
          onPress={onSaveDraft}
          activeOpacity={0.85}
          style={[ab.btn, ab.draftBtn]}
        >
          {/* <Icon name="content-save-outline" size={20} color={colors.primary} /> */}
          <Text style={ab.draftTxt}>Save as draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onContinue}
          disabled={continueDisabled}
          activeOpacity={0.9}
          style={[ab.btn, ab.continueBtn, continueDisabled && ab.continueDisabled]}
        >
          <Text style={ab.continueTxt}>Continue</Text>
          <Icon name="arrow-right" size={18} color={colors.onPrimary} />
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

  const listName = route.params?.listName ?? 'Nayi List';

  // Catalog Supabase se (default + user ke badlav)
  const { products, categories, loading, error, refresh } = useCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Old List / Template / History se aaye to items pehle se bhare honge —
  // catalog load hote hi niche wala effect bhar deta hai.
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, SelectedProduct>
  >({});

  // ── Bottom sheet (preview + edit, ek hi sheet) ──
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetView, setSheetView] = useState<SheetView>('preview');
  const [editingId, setEditingId] = useState<string | null>(null);
  // Edit preview se khola gaya? (to Done / Remove ke baad preview par wapas)
  const [editFromPreview, setEditFromPreview] = useState(false);

  const selectedCount = Object.keys(selectedProducts).length;

  // last SAVED state vs current — back dabane par unsaved changes check
  // Pre-filled items hi "saved" baseline hain, isliye jab tak user kuch na badle
  // "List save nahi hui" alert nahi aayega.
  const savedSnapshotRef = useRef<string>(JSON.stringify(selectedProducts));  // back (header button, gesture, hardware) — stack me beforeRemove sabke liye fire hota hai

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

  // Pre-fill (sourceId): catalog aate hi ek baar. Snapshot bhi usi ka, taaki jab tak
  // user kuch na badle "List save nahi hui" alert na aaye.
  const sourceId = route.params?.sourceId;
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (!sourceId || prefilledRef.current || products.length === 0) return;
    prefilledRef.current = true;
    const prefilled = buildSelectedFromCatalog(sourceId, products);
    savedSnapshotRef.current = JSON.stringify(prefilled);
    setSelectedProducts(prefilled);
  }, [sourceId, products]);

  // ── Filter ──
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => {
      const catOk =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      const srchOk =
        p.name.toLowerCase().includes(q) || p.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [products, selectedCategory, searchQuery]);

  // ── Selection handlers ──
  const handleAdd = useCallback((id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    setSelectedProducts(prev => ({
      ...prev,
      [id]: { ...product, quantity: 1 },
    }));
  }, [products]);

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

  // ── Sheet handlers ──
  const openPreview = useCallback(() => {
    setSheetView('preview');
    setSheetVisible(true);
  }, []);

  // card ke pencil se: seedha edit, Done ke baad sheet band
  const openEditFromCard = useCallback((id: string) => {
    setEditingId(id);
    setEditFromPreview(false);
    setSheetView('edit');
    setSheetVisible(true);
  }, []);

  // preview ke pencil se: usi sheet me edit view, Done ke baad preview
  const openEditFromPreview = useCallback((id: string) => {
    setEditingId(id);
    setEditFromPreview(true);
    setSheetView('edit');
  }, []);

  const closeSheet = useCallback(() => setSheetVisible(false), []);
  const backToPreview = useCallback(() => setSheetView('preview'), []);

  // close animation poori hone ke baad safai
  const handleSheetDismissed = useCallback(() => {
    setEditingId(null);
    setSheetView('preview');
  }, []);

  // Done / Remove ke baad: preview se aaye the to wapas preview, warna band
  const finishEdit = useCallback(() => {
    if (editFromPreview) {
      setSheetView('preview');
    } else {
      setSheetVisible(false);
    }
  }, [editFromPreview]);

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
      finishEdit();
    },
    [editingId, finishEdit],
  );

  const handleEditRemove = useCallback(() => {
    if (!editingId) return;
    handleRemove(editingId);
    finishEdit();
  }, [editingId, handleRemove, finishEdit]);

  // ── Bottom bar handlers ──
  // Save — navigate nahi karta
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


  const selectedList = useMemo(
    () => Object.values(selectedProducts),
    [selectedProducts],
  );

  const editingProduct = editingId ? selectedProducts[editingId] ?? null : null;

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
        onEdit={openEditFromCard}
        onRemove={handleRemove}
      />
    ),
    [
      selectedProducts,
      handleAdd,
      handleIncrease,
      handleDecrease,
      openEditFromCard,
      handleRemove,
    ],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

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
          onRightPress={openPreview}
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
            chips={categories}
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
              { paddingTop: barHeight, paddingBottom: 24 },
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            refreshing={loading && products.length > 0}
            onRefresh={refresh}
            progressViewOffset={barHeight}
            ListEmptyComponent={
              <CatalogListEmpty
                loading={loading && products.length === 0}
                error={error}
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
          continueDisabled={selectedCount === 0}
        />
        {/* ── List Preview + Edit (ek hi sheet) ── */}
        <ListSheet
          visible={sheetVisible}
          view={sheetView}
          items={selectedList}
          editingItem={editingProduct}
          canGoBack={editFromPreview}
          onClose={closeSheet}
          onDismissed={handleSheetDismissed}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onOpenEdit={openEditFromPreview}
          onBack={backToPreview}
          onSave={handleEditSave}
          onRemove={handleEditRemove}
        />
      </SafeAreaView>
    </View>
  );
};

export default CreateListScreen;
