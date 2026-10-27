// src/features/catalog/screens/AddItem.tsx
//
// ADD PRODUCT. Form ke hisse alag files me hain:
//   components/form/*   -> ImagePicker, ProductName, Category, Price, Quantity, TopPick, Footer
//   shared/components/form/* -> FormSection, SectionLabel, formStyles (AddItem + EditItem dono use karte hain)
//   utils/productForm.ts -> validation

import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { validateProductForm } from '../../../shared/utils/productForm';
import { useImagePicker } from '../hooks/useImagePicker';
import { useAppDispatch } from '../../../app/store/hooks';
import { loadCatalog } from '../store/catalogSlice';
import { createProduct, resolveImageUrl } from '../services/catalogService';

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
  });
};

const useStyles = makeUseStyles(createStyles);

const AddItem: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { styles } = useStyles();
  const dispatch = useAppDispatch();

  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameHindi, setNameHindi] = useState('');
  const [price, setPrice] = useState('');
  const [isTopPick, setIsTopPick] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('kg');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Camera / Gallery se photo
  const { pickImage } = useImagePicker(setImageUri);

  const handleAddItem = useCallback(async () => {
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
      const imageUrl = await resolveImageUrl(imageUri); // local photo -> Storage
      await createProduct({
        name: name.trim(),
        nameHindi: nameHindi.trim(),
        unit: `${quantity}${unit}`,
        price: Number(price),
        categoryId: selectedCategory as string,
        imageUrl,
        isTopPick,
      });
      await dispatch(loadCatalog());
      Alert.alert('Success', 'Item successfully add ho gaya.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Could not add item', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [
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

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader title="Add Item" leftAction="back" showThemeToggle={false} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImagePickerSection
            imageUri={imageUri}
            onSelectImage={pickImage}
          />
          <ProductNameSection
            name={name}
            nameHindi={nameHindi}
            onChangeName={setName}
            onChangeNameHindi={setNameHindi}
          />
          <CategorySection
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            showPlusIcon
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
          onSubmit={handleAddItem}
          submitLabel="Add Item"
          submitIcon="plus-circle-outline"
          loading={saving}
        />
      </SafeAreaView>
    </View>
  );
};

export default AddItem;
