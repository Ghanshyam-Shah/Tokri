// src/features/catalog/screens/AddItem.tsx

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';

type NavProp = NativeStackNavigationProp<AppStackParamList>;
type Theme = ReturnType<typeof useTheme>['theme'];

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

// ─────────────────────────────────────────────────────────────
// Section Label
// ─────────────────────────────────────────────────────────────
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
            fontFamily: fontFamilies.hindi ?? fontFamilies.semiBold,
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

// ─────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────
const AddItem: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // primary ke upar jo text/icon aata hai (light me white, dark me dark)
  const onPrimary = colors.onPrimary;

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

    const item = {
      name: name.trim(),
      nameHindi: nameHindi.trim(),
      unit: `${quantity}${unit}`,
      price: Number(price),
      categoryId: selectedCategory,
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

  // Ek chip (default ya Custom) ka content, selected state ke hisaab se
  const renderChipContent = (selected: boolean, label: string) => (
    <>
      <Icon
        name={selected ? 'check' : 'plus'}
        size={14}
        color={selected ? onPrimary : colors.textMuted}
        style={styles.chipIcon}
      />
      <Text
        style={[
          styles.categoryChipText,
          { color: selected ? onPrimary : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ═════════════════════════════ App Header ═════════════════════════════ */}
        <AppHeader title="Add Item" leftAction="back" showThemeToggle={false} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── SECTION 1 — PRODUCT IMAGE ── */}
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
                    <Icon name="image-plus" size={30} color={colors.primary} />
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
                color={colors.primary}
                style={styles.btnIcon}
              />
              <Text style={styles.selectImageBtnTxt}>
                {imageUri ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── SECTION 2 — PRODUCT IDENTITY ── */}
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
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                { borderColor: name ? colors.primary : colors.border },
              ]}
            />

            <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
              Hindi name <Text style={styles.fieldLabelEn}>/ Hindi naam</Text>
            </Text>
            <TextInput
              value={nameHindi}
              onChangeText={setNameHindi}
              placeholder="e.g. बासमती चावल"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                { borderColor: nameHindi ? colors.primary : colors.border },
              ]}
            />
          </View>

          {/* ── SECTION 3 — CATEGORY ── */}
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
                    {renderChipContent(
                      selected,
                      `${cat.label} / ${cat.labelHindi}`,
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Custom — ek normal selectable category */}
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
                {renderChipContent(selectedCategory === 'custom', 'Custom')}
              </TouchableOpacity>

              {/* Add Category — list me naya chip permanently jodta hai */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setAddingCategory(v => !v)}
                style={[styles.categoryChip, styles.addCategoryChip]}
              >
                <Icon
                  name="plus"
                  size={14}
                  color={colors.primary}
                  style={styles.chipIcon}
                />
                <Text
                  style={[styles.categoryChipText, { color: colors.primary }]}
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
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, styles.inputFlex]}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleConfirmAddCategory}
                  style={styles.addCategoryConfirmBtn}
                >
                  <Icon name="check" size={20} color={onPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setAddingCategory(false);
                    setNewCategoryName('');
                  }}
                  style={styles.addCategoryCancelBtn}
                >
                  <Icon name="close" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ── SECTION 4 — PRICE ── */}
          <View style={styles.section}>
            <SectionLabel icon="cash" en="PRICE" hi="कीमत" />

            <View
              style={[
                styles.priceInputWrapper,
                { borderColor: price ? colors.primary : colors.border },
              ]}
            >
              <Text style={styles.rupee}>₹</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="e.g. 120"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
          </View>

          {/* ── SECTION 5 — DEFAULT QUANTITY ── */}
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
                <Icon
                  name="chevron-left"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>

              <View style={styles.qtyInputWrapper}>
                <TextInput
                  value={quantity}
                  onChangeText={text => {
                    if (/^\d*\.?\d*$/.test(text)) setQuantity(text);
                  }}
                  keyboardType="decimal-pad"
                  style={styles.qtyInput}
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
                    color={showQuickSelect ? colors.primary : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => handleStep('plus')}
                style={styles.stepBtn}
              >
                <Icon
                  name="chevron-right"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {showQuickSelect && (
              <View style={styles.quickSelectGrid}>
                <Text style={styles.quickTitle}>Quick Select ({unit}):</Text>
                <View style={styles.quickOptionsWrapper}>
                  {getQuickOptions().map(val => {
                    const active = quantity === val.toString();
                    return (
                      <TouchableOpacity
                        key={val}
                        onPress={() => setQuantity(val.toString())}
                        style={[
                          styles.quickOption,
                          active && styles.quickOptionActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.quickOptionText,
                            active && styles.quickOptionTextActive,
                          ]}
                        >
                          {val} {unit}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* ── SECTION 6 — TOP PICK ── */}
          <View style={styles.section}>
            <SectionLabel icon="star-outline" en="VISIBILITY" hi="दिखावट" />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsTopPick(prev => !prev)}
              style={[
                styles.topPickCard,
                {
                  backgroundColor: isTopPick
                    ? colors.primaryMuted
                    : colors.cardBgVariant,
                  borderColor: isTopPick ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.topPickIcon}>
                <Icon
                  name={isTopPick ? 'star' : 'star-outline'}
                  size={22}
                  color={colors.primary}
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
                    backgroundColor: isTopPick ? colors.primary : 'transparent',
                    borderColor: isTopPick ? colors.primary : colors.border,
                  },
                ]}
              >
                {isTopPick && <Icon name="check" size={16} color={onPrimary} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* ═════════════════════════ STICKY FOOTER ═════════════════════════ */}
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
              color={onPrimary}
              style={styles.btnIcon}
            />
            <Text style={styles.btnPrimaryText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Styles (theme se)
// ─────────────────────────────────────────────────────────────
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  const onPrimary = colors.onPrimary;
  const inputBg = colors.cardBgVariant;
  const primaryMuted = colors.primaryMuted; // primary 6-digit hex hona chahiye

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    safeArea: { flex: 1, backgroundColor: colors.appBackground },
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg + 2,
      paddingBottom: spacing.sm,
    },
    bottomSpacer: { height: spacing.lg },

    section: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },

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
    inputFlex: { flex: 1 },

    // ── Image (square) ──
    imageSquare: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      backgroundColor: inputBg,
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
      backgroundColor: primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm + 2,
    },
    selectImageText: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    imageHint: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
    selectImageBtn: {
      marginTop: spacing.md,
      height: 46,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: primaryMuted,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectImageBtnTxt: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
    },
    btnIcon: { marginRight: 6 },

    // ── Price ──
    priceInputWrapper: {
      height: spacing.huge,
      backgroundColor: inputBg,
      borderWidth: 1.5,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md + 2,
    },
    rupee: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.semiBold,
      color: colors.primary,
    },
    priceInput: {
      flex: 1,
      height: '100%',
      marginLeft: spacing.sm,
      fontSize: typography.sm,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },

    // ── Category chips ──
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md + 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1.5,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryChipInactive: {
      backgroundColor: inputBg,
      borderColor: colors.border,
    },
    addCategoryChip: {
      backgroundColor: colors.cardBg,
      borderColor: colors.primary,
      borderStyle: 'dashed',
    },
    categoryChipText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.medium,
    },
    chipIcon: { marginRight: 5 },

    addCategoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    addCategoryConfirmBtn: {
      width: 46,
      height: spacing.huge,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addCategoryCancelBtn: {
      width: 46,
      height: spacing.huge,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Top pick ──
    topPickCard: {
      minHeight: 70,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderWidth: 1.5,
      borderRadius: borderRadius.md,
    },
    topPickIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md - 2,
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm + 2,
    },
    topPickInfo: { flex: 1 },
    topPickTitle: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: 3,
    },
    topPickSubtitle: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
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

    // ── Default quantity ──
    unitContainer: {
      flexDirection: 'row',
      backgroundColor: inputBg,
      borderRadius: borderRadius.md,
      padding: spacing.xs,
      marginBottom: spacing.md,
    },
    unitTab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    unitTabActive: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitTabText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
    unitTabTextActive: { color: colors.primary },

    qtyControlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    stepBtn: {
      width: 44,
      height: spacing.huge,
      backgroundColor: inputBg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qtyInputWrapper: {
      flex: 1,
      height: spacing.huge,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    qtyInput: {
      flex: 1,
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    listIconBtn: {
      paddingLeft: spacing.sm + 2,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
    },

    quickSelectGrid: {
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickTitle: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.textMuted,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
    },
    quickOptionsWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    quickOption: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.sm - 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickOptionActive: {
      borderColor: colors.primary,
      backgroundColor: primaryMuted,
    },
    quickOptionText: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },
    quickOptionTextActive: {
      color: colors.primary,
      fontFamily: fontFamilies.bold,
    },
  });
};

export default AddItem;