// src/features/catalog/components/form/ProductNameSection.tsx
// Product name + Hindi name

import React from 'react';
import { Text, TextInput } from 'react-native';
import FormSection from '../../../../shared/components/form/FormSection';
import { useFormStyles } from '../../../../shared/components/form/formStyles';

interface Props {
  name: string;
  nameHindi: string;
  onChangeName: (v: string) => void;
  onChangeNameHindi: (v: string) => void;
}

const ProductNameSection = ({
  name,
  nameHindi,
  onChangeName,
  onChangeNameHindi,
}: Props) => {
  const { theme, styles } = useFormStyles();
  const { colors } = theme;

  return (
    <FormSection icon="package-variant-closed" en="PRODUCT" hi="प्रोडक्ट">
      <Text style={styles.fieldLabel}>
        Product name{' '}
        <Text style={styles.fieldLabelEn}>/ Product ka naam</Text>
      </Text>
      <TextInput
        value={name}
        onChangeText={onChangeName}
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
        onChangeText={onChangeNameHindi}
        placeholder="e.g. बासमती चावल"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          { borderColor: nameHindi ? colors.primary : colors.border },
        ]}
      />
    </FormSection>
  );
};

export default ProductNameSection;
