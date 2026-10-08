// src/features/catalog/screens/EditItem.tsx
//
// EDIT PRODUCT — opened from CatalogScreen's card "Edit" button, with the
// tapped product's id passed as a route param: navigation.navigate('EditItem',
// { productId: id }).
//
// Same form + functionality as AddItem.tsx (image, name, category incl.
// Custom + Add Category, price, quantity/unit incl. quick-select, top pick),
// just pre-filled from the existing product, with "Save Changes" instead of
// "Add Item", and a Delete action (trash icon in the header) since this is
// where remove was meant to live.
//
// ⚠️ PRODUCTS below is the same demo catalog array used in CatalogScreen —
// swap the lookup for your real catalog state/API once that's wired up.
// ⚠️ Route/nav typing is loose (`useRoute<any>()`) until 'EditItem' is added
// to your stack's param list with `{ productId: string }`.

import React, { useCallback, useMemo, useState } from 'react';
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
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  inputBg: '#F3F7F7',
  green: '#70A185',
  red: '#D17F83',
};

const H_PADDING = 16;
const HEADER_H = Platform.OS === 'ios' ? 52 : 52;

// ─── Category type + defaults ──────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  labelHindi: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

const UNITS = ['kg', 'g', 'L', 'ml', 'pcs'];

// ─── Demo catalog lookup — same data as CatalogScreen ──────────────────────
interface Product {
  id: string;
  name: string;
  nameHindi: string;
  price: number;
  unit: string;
  categoryId: string;
  imageUrl: string;
  isTopPick: boolean;
  createdAt: number;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    price: 40,
    unit: '1kg',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Organic Milk',
    nameHindi: 'जैविक दूध',
    price: 68,
    unit: '1L',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    price: 450,
    unit: '5kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Toor Dal',
    nameHindi: 'अरहर दाल',
    price: 120,
    unit: '1kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1599909631565-9921aaabb4a7?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '5',
    name: 'Yellow Bell Pepper',
    nameHindi: 'पीली शिमला मिर्च',
    price: 45,
    unit: '250g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '6',
    name: 'Penne Pasta',
    nameHindi: 'पास्ता',
    price: 95,
    unit: '500g',
    categoryId: 'snacks',
    imageUrl:
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    price: 85,
    unit: '200g',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '8',
    name: 'Carrots',
    nameHindi: 'गाजर',
    price: 35,
    unit: '500g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
];

// splits "500g" -> { qty: "500", unitType: "g" }; falls back to 1/kg if it
// can't parse (e.g. product created with a free-typed unit)
const parseUnit = (unitStr: string): { qty: string; unitType: string } => {
  const match = unitStr.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (match) return { qty: match[1], unitType: match[2] };
  return { qty: '1', unitType: 'kg' };
};

// ─────────────────────────────────────────────────────────────
// Section Label
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────
const EditItem: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const productId: string | undefined = route.params?.productId;

  const existingProduct = useMemo(
    () => PRODUCTS.find(p => p.id === productId) ?? PRODUCTS[0],
    [productId],
  );
  const parsedUnit = useMemo(
    () => parseUnit(existingProduct?.unit ?? '1kg'),
    [existingProduct],
  );

  const [imageUri, setImageUri] = useState<string | null>(
    existingProduct?.imageUrl ?? null,
  );
  const [name, setName] = useState(existingProduct?.name ?? '');
  const [nameHindi, setNameHindi] = useState(existingProduct?.nameHindi ?? '');
  const [price, setPrice] = useState(
    existingProduct ? String(existingProduct.price) : '',
  );
  const [isTopPick, setIsTopPick] = useState(
    existingProduct?.isTopPick ?? false,
  );
  const [quantity, setQuantity] = useState(parsedUnit.qty);
  const [unit, setUnit] = useState(parsedUnit.unitType);
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // ── categories ──
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    existingProduct?.categoryId ?? null,
  );
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // ───────────────────────────────────────────────────────────
  // Save changes
  // ───────────────────────────────────────────────────────────
  const handleSaveChanges = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Name zaroori hai', 'Product ka naam daalein pehle.');
      return;
    }
    if (!nameHindi.trim()) {
      Alert.alert(
        'Hindi name zaroori hai',
        'Product ka Hindi naam daalein pehle.',
      );
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Category zaroori hai', 'Ek category select karein.');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Price zaroori hai', 'Product ki sahi price daalein.');
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert('Quantity zaroori hai', 'Product ki sahi quantity daalein.');
      return;
    }

    const updatedItem = {
      id: productId,
      name: name.trim(),
      nameHindi: nameHindi.trim(),
      unit: `${quantity}${unit}`,
      price: Number(price),
      categoryId: selectedCategory,
      imageUrl: imageUri ?? '',
      isTopPick,
    };

    // TODO: API call / catalog state update baad mein yaha add karenge.
    console.log('Updated product:', updatedItem);

    Alert.alert('Saved ✅', 'Product update ho gaya.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }, [
    productId,
    name,
    nameHindi,
    selectedCategory,
    price,
    quantity,
    unit,
    imageUri,
    isTopPick,
    navigation,
  ]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Product delete karein?',
      `"${name || 'Ye product'}" catalog se hamesha ke liye hat jayega.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: API call / catalog state update baad mein yaha add karenge.
            console.log('Deleted product:', productId);
            navigation.goBack();
          },
        },
      ],
    );
  }, [name, productId, navigation]);

  const handleSelectImage = useCallback(() => {
    // TODO: react-native-image-picker ka implementation yaha add karenge.
    Alert.alert(
      'Select Image',
      'Yaha react-native-image-picker ka implementation add karenge.',
    );
  }, []);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  // ── quantity/unit helpers ──
  const handleUnitChange = (selectedUnit: string) => setUnit(selectedUnit);

  const handleStep = (type: 'plus' | 'minus') => {
    const current = parseFloat(quantity) || 0;
    const step = unit === 'g' || unit === 'ml' ? 50 : 1;
    if (type === 'plus') {
      setQuantity((current + step).toString());
    } else if (current > step) {
      setQuantity((current - step).toString());
    } else if (current > 0) {
      setQuantity('0');
    }
  };

  const getQuickOptions = () => {
    if (unit === 'g' || unit === 'ml')
      return [50, 100, 200, 250, 350, 400, 500, 750, 900];
    return [1, 2, 5, 10, 15, 20, 25, 50];
  };

  // ── category helpers ──
  const handleCategoryPress = useCallback((id: string) => {
    setSelectedCategory(id);
  }, []);

  const handleConfirmAddCategory = useCallback(() => {
    const label = newCategoryName.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, '-');
    if (categories.some(c => c.id === id)) {
      Alert.alert('Already exists', 'Ye category pehle se list mein hai.');
      return;
    }
    setCategories(prev => [...prev, { id, label, labelHindi: label }]);
    setSelectedCategory(id);
    setNewCategoryName('');
    setAddingCategory(false);
  }, [newCategoryName, categories]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={DARK.bg} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header — same look as AddItem's, plus a delete icon on the right
            (this is where "remove" lives, per point 1 in the catalog spec) */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconBtn}
          >
            <Icon name="arrow-left" size={24} color={DARK.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Edit Item
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconBtn}
          >
            <Icon name="trash-can-outline" size={22} color={DARK.red} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ═══════════════════════════════════════════════════
              SECTION 1 — PRODUCT IMAGE (square + button below)
          ═══════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionLabel
              icon="image-outline"
              en="PRODUCT IMAGE"
              hi="प्रोडक्ट फोटो"
            />

            <View style={styles.imageSquare}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imageSquareImg}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholderInner}>
                  <View style={styles.imageIconCircle}>
                    <Icon name="image-plus" size={30} color={DARK.primary} />
                  </View>
                  <Text style={styles.selectImageText}>No image selected</Text>
                  <Text style={styles.imageHint}>Square image recommended</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSelectImage}
              activeOpacity={0.85}
              style={styles.selectImageBtn}
            >
              <Icon
                name="image-outline"
                size={16}
                color={DARK.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.selectImageBtnTxt}>
                {imageUri ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ═══════════════════════════════════════════════════
              SECTION 2 — PRODUCT IDENTITY
          ═══════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionLabel
              icon="package-variant-closed"
              en="PRODUCT"
              hi="प्रोडक्ट"
            />

            <Text style={styles.fieldLabel}>
              Product name{' '}
              <Text style={styles.fieldLabelEn}>/ Product ka naam</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Basmati Rice"
              placeholderTextColor={DARK.textMuted}
              style={[
                styles.input,
                { borderColor: name ? DARK.primary : DARK.border },
              ]}
            />

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              Hindi name <Text style={styles.fieldLabelEn}>/ Hindi naam</Text>
            </Text>
            <TextInput
              value={nameHindi}
              onChangeText={setNameHindi}
              placeholder="e.g. बासमती चावल"
              placeholderTextColor={DARK.textMuted}
              style={[
                styles.input,
                { borderColor: nameHindi ? DARK.primary : DARK.border },
              ]}
            />
          </View>

          {/* ═══════════════════════════════════════════════════
              SECTION 3 — CATEGORY
          ═══════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionLabel icon="shape-outline" en="CATEGORY" hi="श्रेणी" />

            <View style={styles.chipsWrap}>
              {categories.map(cat => {
                const selected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.8}
                    onPress={() => handleCategoryPress(cat.id)}
                    style={[
                      styles.categoryChip,
                      selected
                        ? styles.categoryChipActive
                        : styles.categoryChipInactive,
                    ]}
                  >
                    {selected && (
                      <Icon
                        name="check"
                        size={14}
                        color="#fff"
                        style={styles.chipIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: selected ? '#fff' : DARK.textMuted },
                      ]}
                    >
                      {cat.label} / {cat.labelHindi}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom — a regular selectable category, same as any other chip */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCategoryPress('custom')}
                style={[
                  styles.categoryChip,
                  selectedCategory === 'custom'
                    ? styles.categoryChipActive
                    : styles.categoryChipInactive,
                ]}
              >
                {selectedCategory === 'custom' && (
                  <Icon
                    name="check"
                    size={14}
                    color="#fff"
                    style={styles.chipIcon}
                  />
                )}
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color:
                        selectedCategory === 'custom' ? '#fff' : DARK.textMuted,
                    },
                  ]}
                >
                  Custom
                </Text>
              </TouchableOpacity>

              {/* Add Category — permanently adds a new chip to the list above */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setAddingCategory(v => !v)}
                style={[styles.categoryChip, styles.addCategoryChip]}
              >
                <Icon
                  name="plus"
                  size={14}
                  color={DARK.primary}
                  style={styles.chipIcon}
                />
                <Text
                  style={[styles.categoryChipText, { color: DARK.primary }]}
                >
                  Add Category
                </Text>
              </TouchableOpacity>
            </View>

            {addingCategory && (
              <View style={styles.addCategoryRow}>
                <TextInput
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="New category name..."
                  placeholderTextColor={DARK.textMuted}
                  style={[styles.input, { flex: 1 }]}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleConfirmAddCategory}
                  style={styles.addCategoryConfirmBtn}
                >
                  <Icon name="check" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setAddingCategory(false);
                    setNewCategoryName('');
                  }}
                  style={styles.addCategoryCancelBtn}
                >
                  <Icon name="close" size={20} color={DARK.textMuted} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ═══════════════════════════════════════════════════
              SECTION 4 — PRICE
          ═══════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionLabel icon="cash" en="PRICE" hi="कीमत" />

            <View
              style={[
                styles.priceInputWrapper,
                { borderColor: price ? DARK.primary : DARK.border },
              ]}
            >
              <Text style={styles.rupee}>₹</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="e.g. 120"
                placeholderTextColor={DARK.textMuted}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
          </View>

          {/* ═══════════════════════════════════════════════════
              SECTION 5 — DEFAULT QUANTITY
          ═══════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionLabel
              icon="scale-balance"
              en="DEFAULT QUANTITY"
              hi="डिफ़ॉल्ट मात्रा"
            />

            <View style={styles.unitContainer}>
              {UNITS.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleUnitChange(item)}
                  style={[
                    styles.unitTab,
                    unit === item && styles.unitTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.unitTabText,
                      unit === item && styles.unitTabTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.qtyControlRow}>
              <TouchableOpacity
                onPress={() => handleStep('minus')}
                style={styles.stepBtn}
              >
                <Icon name="chevron-left" size={24} color={DARK.textPrimary} />
              </TouchableOpacity>

              <View style={styles.qtyInputWrapperNew}>
                <TextInput
                  value={quantity}
                  onChangeText={text => {
                    if (/^\d*\.?\d*$/.test(text)) setQuantity(text);
                  }}
                  keyboardType="decimal-pad"
                  style={styles.qtyInputNew}
                />
                <TouchableOpacity
                  onPress={() => setShowQuickSelect(!showQuickSelect)}
                  style={styles.listIconBtn}
                >
                  <Icon
                    name={
                      showQuickSelect ? 'chevron-up' : 'format-list-bulleted'
                    }
                    size={20}
                    color={showQuickSelect ? DARK.primary : DARK.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => handleStep('plus')}
                style={styles.stepBtn}
              >
                <Icon name="chevron-right" size={24} color={DARK.textPrimary} />
              </TouchableOpacity>
            </View>

            {showQuickSelect && (
              <View style={styles.quickSelectGrid}>
                <Text style={styles.quickTitle}>Quick Select ({unit}):</Text>
                <View style={styles.quickOptionsWrapper}>
                  {getQuickOptions().map(val => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setQuantity(val.toString())}
                      style={[
                        styles.quickOption,
                        quantity === val.toString() && styles.quickOptionActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickOptionText,
                          quantity === val.toString() &&
                            styles.quickOptionTextActive,
                        ]}
                      >
                        {val} {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* ═══════════════════════════════════════════════════
              SECTION 6 — TOP PICK
          ═══════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionLabel icon="star-outline" en="VISIBILITY" hi="दिखावट" />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsTopPick(prev => !prev)}
              style={[
                styles.topPickCard,
                {
                  backgroundColor: isTopPick ? DARK.primaryMuted : DARK.inputBg,
                  borderColor: isTopPick ? DARK.primary : DARK.border,
                },
              ]}
            >
              <View style={styles.topPickIcon}>
                <Icon
                  name={isTopPick ? 'star' : 'star-outline'}
                  size={22}
                  color={DARK.primary}
                />
              </View>
              <View style={styles.topPickInfo}>
                <Text style={styles.topPickTitle}>Top Pick</Text>
                <Text style={styles.topPickSubtitle}>
                  Is product ko Top Pick mein show karein
                </Text>
              </View>
              <View
                style={[
                  styles.checkBox,
                  {
                    backgroundColor: isTopPick ? DARK.primary : 'transparent',
                    borderColor: isTopPick ? DARK.primary : DARK.chipBorder,
                  },
                ]}
              >
                {isTopPick && <Icon name="check" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ═════════════════════════════════════════════════════
            STICKY FOOTER
        ═════════════════════════════════════════════════════ */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.75}
            style={styles.btnSecondary}
          >
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveChanges}
            activeOpacity={0.85}
            style={styles.btnPrimary}
          >
            <Icon
              name="check-circle-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnPrimaryText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Styles — identical to AddItem.tsx, plus header styles (AddItem used the
// shared AppHeader component; this screen builds its own header inline so
// it can add the delete icon on the right).
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
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
    backgroundColor: DARK.bg,
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

  scroll: { flex: 1 },
  content: { paddingHorizontal: H_PADDING, paddingTop: 18, paddingBottom: 8 },

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

  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: DARK.textMuted,
    marginBottom: 8,
  },
  fieldLabelEn: { fontSize: 11, fontWeight: '400', color: DARK.textMuted },

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

  imageSquare: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: DARK.primary,
    borderStyle: 'dashed',
    backgroundColor: DARK.inputBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSquareImg: { width: '100%', height: '100%' },
  imagePlaceholderInner: { alignItems: 'center', justifyContent: 'center' },
  imageIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DARK.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectImageText: { fontSize: 14, fontWeight: '700', color: DARK.textPrimary },
  imageHint: { fontSize: 10, color: DARK.textMuted, marginTop: 4 },
  selectImageBtn: {
    marginTop: 12,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: DARK.primary,
    backgroundColor: DARK.primaryMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImageBtnTxt: { fontSize: 14, fontWeight: '700', color: DARK.primary },

  priceInputWrapper: {
    height: 48,
    backgroundColor: DARK.inputBg,
    borderWidth: 1.5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  rupee: { fontSize: 18, fontWeight: '600', color: DARK.primary },
  priceInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: DARK.textPrimary,
  },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  categoryChipActive: {
    backgroundColor: DARK.primary,
    borderColor: DARK.primary,
  },
  categoryChipInactive: {
    backgroundColor: DARK.inputBg,
    borderColor: DARK.chipBorder,
  },
  addCategoryChip: {
    backgroundColor: '#fff',
    borderColor: DARK.primary,
    borderStyle: 'dashed',
  },
  categoryChipText: { fontSize: 13, fontWeight: '500' },
  chipIcon: { marginRight: 5 },

  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  addCategoryConfirmBtn: {
    width: 46,
    height: 48,
    borderRadius: 10,
    backgroundColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryCancelBtn: {
    width: 46,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: DARK.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topPickCard: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  topPickIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topPickInfo: { flex: 1 },
  topPickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK.textPrimary,
    marginBottom: 3,
  },
  topPickSubtitle: { fontSize: 11, color: DARK.textMuted },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  btnSecondaryText: { fontSize: 15, fontWeight: '600', color: DARK.textMuted },

  unitContainer: {
    flexDirection: 'row',
    backgroundColor: DARK.inputBg,
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  unitTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  unitTabActive: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: DARK.border,
  },
  unitTabText: { fontSize: 13, fontWeight: '600', color: DARK.textMuted },
  unitTabTextActive: { color: DARK.primary },

  qtyControlRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 44,
    height: 48,
    backgroundColor: DARK.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DARK.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyInputWrapperNew: {
    flex: 1,
    height: 48,
    backgroundColor: DARK.inputBg,
    borderWidth: 1,
    borderColor: DARK.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  qtyInputNew: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: DARK.textPrimary,
    textAlign: 'center',
  },
  listIconBtn: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: DARK.border,
  },

  quickSelectGrid: {
    marginTop: 12,
    padding: 12,
    backgroundColor: DARK.surfaceHigh,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DARK.border,
  },
  quickTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: DARK.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  quickOptionsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DARK.border,
  },
  quickOptionActive: {
    borderColor: DARK.primary,
    backgroundColor: DARK.primaryMuted,
  },
  quickOptionText: { fontSize: 12, fontWeight: '500', color: DARK.textPrimary },
  quickOptionTextActive: { color: DARK.primary, fontWeight: '700' },
});

export default EditItem;
