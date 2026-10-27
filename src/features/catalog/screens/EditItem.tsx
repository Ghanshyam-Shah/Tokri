// src/features/catalog/screens/EditItem.tsx
//
// EDIT PRODUCT — CatalogScreen ke card "Edit" button se khulta hai:
// navigation.navigate('EditItem', { productId: id })
//
// Product Supabase catalog (useCatalog) se aata hai. Save / Delete Supabase me jata hai.
// Default product edit karne par sirf is user ke liye badlav save hota hai.

import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { makeUseStyles, AppTheme } from '../../../shared/utils/makeUseStyles';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import ImagePickerSection from '../components/form/ImagePickerSection';
import ProductNameSection from '../components/form/ProductNameSection';
import CategorySection from '../components/form/CategorySection';
import PriceSection from '../components/form/PriceSection';
import QuantitySection from '../components/form/QuantitySection';
import TopPickSection from '../components/form/TopPickSection';
import ItemFormFooter from '../components/form/ItemFormFooter';
import { validateProductForm, parseUnit } from '../../../shared/utils/productForm';
import { useImagePicker } from '../hooks/useImagePicker';
import { useCatalog } from '../hooks/useCatalog';
import { useAppDispatch } from '../../../app/store/hooks';
import { loadCatalog } from '../store/catalogSlice';
import {
  CatalogProduct,
  updateProduct,
  deleteProduct,
  resolveImageUrl,
} from '../services/catalogService';

type NavProp = NativeStackNavigationProp<AppStackParamList>;

const createStyles = (theme: AppTheme) => {
  const { colors, spacing } = theme;

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
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
};

const useStyles = makeUseStyles(createStyles);

// ─────────────────────────────────────────────────────────────
// Form (product milne ke baad hi mount hota hai, taaki fields sahi bharein)
// ─────────────────────────────────────────────────────────────
const EditItemForm: React.FC<{ product: CatalogProduct }> = ({ product }) => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const { styles } = useStyles();

  const parsedUnit = useMemo(() => parseUnit(product.unit ?? '1kg'), [product]);

  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(
    product.imageUrl || null,
  );
  const [name, setName] = useState(product.name ?? '');
  const [nameHindi, setNameHindi] = useState(product.nameHindi ?? '');
  const [price, setPrice] = useState(String(product.price ?? ''));
  const [isTopPick, setIsTopPick] = useState(product.isTopPick ?? false);
  const [quantity, setQuantity] = useState(parsedUnit.qty);
  const [unit, setUnit] = useState(parsedUnit.unitType);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    product.categoryId || null,
  );

  // Camera / Gallery se photo
  const { pickImage } = useImagePicker(setImageUri);

  const handleSaveChanges = useCallback(async () => {
    const error = validateProductForm({
      name,
      nameHindi,
      selectedCategory,
      price,
      quantity,
    });
    if (error) {
      Alert.alert(error.title, error.message);
      return;
    }

    try {
      setSaving(true);
      const imageUrl = await resolveImageUrl(imageUri); // nayi local photo -> Storage
      await updateProduct(product, {
        name: name.trim(),
        nameHindi: nameHindi.trim(),
        unit: `${quantity}${unit}`,
        price: Number(price),
        categoryId: selectedCategory as string,
        imageUrl,
        isTopPick,
      });
      await dispatch(loadCatalog());
      Alert.alert('Saved ✅', 'Product update ho gaya.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [
    product,
    name,
    nameHindi,
    selectedCategory,
    price,
    quantity,
    unit,
    imageUri,
    isTopPick,
    dispatch,
    navigation,
  ]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Product delete karein?',
      product.source === 'default'
        ? `"${name || 'Ye product'}" aapke catalog se hat jayega.`
        : `"${name || 'Ye product'}" catalog se hamesha ke liye hat jayega.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await deleteProduct(product);
              await dispatch(loadCatalog());
              navigation.goBack();
            } catch (e: any) {
              Alert.alert('Could not delete', e?.message ?? 'Please try again.');
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  }, [name, product, dispatch, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader
          title="Edit Item"
          leftAction="back"
          showThemeToggle={false}
          rightIcon="trash-can-outline"
          onRightPress={handleDelete}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImagePickerSection imageUri={imageUri} onSelectImage={pickImage} />
          <ProductNameSection
            name={name}
            nameHindi={nameHindi}
            onChangeName={setName}
            onChangeNameHindi={setNameHindi}
          />
          <CategorySection
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <PriceSection price={price} onChangePrice={setPrice} />
          <QuantitySection
            quantity={quantity}
            unit={unit}
            onChangeQuantity={setQuantity}
            onChangeUnit={setUnit}
          />
          <TopPickSection
            isTopPick={isTopPick}
            onToggle={() => setIsTopPick(prev => !prev)}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <ItemFormFooter
          onCancel={handleBack}
          onSubmit={handleSaveChanges}
          submitLabel="Save Changes"
          submitIcon="check-circle-outline"
          loading={saving}
        />
      </SafeAreaView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Screen: catalog se product dhundo, phir form dikhao
// ─────────────────────────────────────────────────────────────
const EditItem: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'EditItem'>>();
  const productId: string | undefined = route.params?.productId;
  const { styles, theme } = useStyles();
  const { products, loading } = useCatalog();

  const product = useMemo(
    () => products.find(p => p.id === productId),
    [products, productId],
  );

  if (!product) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <AppHeader title="Edit Item" leftAction="back" showThemeToggle={false} />
          <View style={styles.center}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : null}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return <EditItemForm product={product} />;
};

export default EditItem;
