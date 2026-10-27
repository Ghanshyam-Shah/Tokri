// src/features/catalog/components/form/ImagePickerSection.tsx
// Product photo: preview + Select/Change button

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import FormSection from '../../../../shared/components/form/FormSection';
import { useFormStyles } from '../../../../shared/components/form/formStyles';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const inputBg = colors.cardBgVariant;
  const primaryMuted = colors.primaryMuted; // 6-digit hex hona chahiye

  return StyleSheet.create({
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
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  imageUri: string | null;
  onSelectImage: () => void;
}

const ImagePickerSection = ({ imageUri, onSelectImage }: Props) => {
  const { theme, styles } = useStyles();
  const { styles: form } = useFormStyles();
  const { colors } = theme;

  return (
    <FormSection icon="image-outline" en="PRODUCT IMAGE" hi="प्रोडक्ट फोटो">
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
        onPress={onSelectImage}
        activeOpacity={0.85}
        style={styles.selectImageBtn}
      >
        <Icon
          name="image-outline"
          size={16}
          color={colors.primary}
          style={form.btnIcon}
        />
        <Text style={styles.selectImageBtnTxt}>
          {imageUri ? 'Change Image' : 'Select Image'}
        </Text>
      </TouchableOpacity>
    </FormSection>
  );
};

export default ImagePickerSection;
