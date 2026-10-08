// src/features/catalog/screens/AddItem.tsx

import React, { useCallback, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../../shared/components/headers/AppHeader';

// Navigation type ko apne navigationTypes ke according adjust kar lena
type NavProp = NativeStackNavigationProp<any>;

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

// ─── Category type + defaults ──────────────────────────────────────────────
// Same category set already used across CatalogScreen / CreateListScreen /
// List.tsx, so chips look and behave consistently everywhere.
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
const AddItem: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameHindi, setNameHindi] = useState('');
  const [price, setPrice] = useState('');
  const [isTopPick, setIsTopPick] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('kg');
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // ── categories ──
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // ───────────────────────────────────────────────────────────
  // Add Item
  // ───────────────────────────────────────────────────────────
  const handleAddItem = useCallback(() => {
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
    const finalCategory = selectedCategory;
    if (!finalCategory) {
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

    const item = {
      name: name.trim(),
      nameHindi: nameHindi.trim(),
      unit: `${quantity}${unit}`,
      price: Number(price),
      categoryId: finalCategory,
      imageUrl: imageUri ?? '',
      isTopPick,
    };

    // TODO: API call / catalog state update baad mein yaha add karenge.
    console.log('New Product:', item);

    Alert.alert('Success', 'Item successfully add ho gaya.');
  }, [
    name,
    nameHindi,
    selectedCategory,
    price,
    quantity,
    unit,
    imageUri,
    isTopPick,
  ]);

  const handleSelectImage = useCallback(() => {
    // TODO: react-native-image-picker ka implementation yaha add karenge.
    // Example: launchImageLibrary({ mediaType: 'photo' }, (res) => {...})
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
        <AppHeader
          title="Add Item"
          leftIcon="arrow-left"
          onLeftPress={handleBack}
        />

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
                    {selected ? (
                      <Icon
                        name="check"
                        size={14}
                        color="#fff"
                        style={styles.chipIcon}
                      />
                    ) : (
                      <Icon
                        name="plus"
                        size={14}
                        color={DARK.textMuted}
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

              {/* Custom — a regular selectable category, same as any other chip.
                  Selecting it doesn't open any input; it just gets picked. */}
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
                {selectedCategory === 'custom' ? (
                  <Icon
                    name="check"
                    size={14}
                    color="#fff"
                    style={styles.chipIcon}
                  />
                ) : (
                  <Icon
                    name="plus"
                    size={14}
                    color={DARK.textMuted}
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
            onPress={handleAddItem}
            activeOpacity={0.85}
            style={styles.btnPrimary}
          >
            <Icon
              name="plus-circle-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnPrimaryText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK.bg },
  safeArea: { flex: 1, backgroundColor: DARK.bg },
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
    borderWidth: 1,
    borderColor: DARK.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    color: DARK.textPrimary,
  },

  // ── Image (square) ──
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

  // ── Price ──
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

  // ── Category chips ──
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

  // ── Top pick ──
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
  btnSecondaryText: { fontSize: 15, fontWeight: '600', color: DARK.textMuted },

  // ── Default quantity ──
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

export default AddItem;
