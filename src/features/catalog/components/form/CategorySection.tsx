// src/features/catalog/components/form/CategorySection.tsx
// Category chips + Custom + "Add Category". Categories ki list yahin ki state me rehti hai.

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import FormSection from '../../../../shared/components/form/FormSection';
import { useFormStyles } from '../../../../shared/components/form/formStyles';
import { useAppDispatch } from '../../../../app/store/hooks';
import { useCatalog } from '../../hooks/useCatalog';
import { loadCatalog } from '../../store/catalogSlice';
import { createCategory } from '../../services/catalogService';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const inputBg = colors.cardBgVariant;

  return StyleSheet.create({
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
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  selectedCategory: string | null;
  onSelect: (id: string) => void;
  // AddItem me unselected chip par "+" icon dikhta hai, EditItem me nahi
  showPlusIcon?: boolean;
}

const CategorySection = ({
  selectedCategory,
  onSelect,
  showPlusIcon = false,
}: Props) => {
  const { theme, styles } = useStyles();
  const { styles: form } = useFormStyles();
  const { colors } = theme;
  const onPrimary = colors.onPrimary;

  const dispatch = useAppDispatch();
  const { categories: allCategories } = useCatalog();
  // 'All' UI ka chip hai; 'Custom' neeche alag fixed chip hai
  const categories = useMemo(
    () => allCategories.filter(cat => cat.id !== 'all' && cat.id !== 'custom'),
    [allCategories],
  );
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleConfirmAddCategory = useCallback(async () => {
    const label = newCategoryName.trim();
    if (!label) return;
    if (categories.some(cat => cat.label.toLowerCase() === label.toLowerCase())) {
      Alert.alert('Already exists', 'Ye category pehle se list mein hai.');
      return;
    }
    try {
      const id = await createCategory(label);
      await dispatch(loadCatalog());
      onSelect(id);
      setNewCategoryName('');
      setAddingCategory(false);
    } catch (e: any) {
      Alert.alert('Could not add category', e?.message ?? 'Please try again.');
    }
  }, [newCategoryName, categories, dispatch, onSelect]);

  // Ek chip (default ya Custom) ka content, selected state ke hisaab se
  const renderChipContent = (selected: boolean, label: string) => (
    <>
      {(selected || showPlusIcon) && (
        <Icon
          name={selected ? 'check' : 'plus'}
          size={14}
          color={selected ? onPrimary : colors.textMuted}
          style={styles.chipIcon}
        />
      )}
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
    <FormSection icon="shape-outline" en="CATEGORY" hi="श्रेणी">
      <View style={styles.chipsWrap}>
        {categories.map(cat => {
          const selected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => onSelect(cat.id)}
              style={[
                styles.categoryChip,
                selected
                  ? styles.categoryChipActive
                  : styles.categoryChipInactive,
              ]}
            >
              {renderChipContent(selected, `${cat.label} / ${cat.labelHindi}`)}
            </TouchableOpacity>
          );
        })}

        {/* Custom — ek normal selectable category */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect('custom')}
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
          <Text style={[styles.categoryChipText, { color: colors.primary }]}>
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
            style={[form.input, form.inputFlex]}
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
    </FormSection>
  );
};

export default CategorySection;
