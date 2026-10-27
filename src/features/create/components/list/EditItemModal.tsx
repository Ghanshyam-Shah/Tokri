// src/features/create/components/list/EditItemModal.tsx
// Item edit sheet: quantity + note + remove

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import { SelectedP } from '../../constants/listDefaults';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const onPrimary = colors.onPrimary; // primary ke upar ka text/icon

  return StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      padding: spacing.xl,
      paddingBottom: Platform.OS === 'ios' ? 36 : spacing.xxl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.md + 2,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md + 2,
    },
    headerTitle: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.xl,
      padding: spacing.md,
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
    },
    thumb: {
      width: 52,
      height: 52,
      borderRadius: borderRadius.md - 2,
      backgroundColor: colors.appBackground,
    },
    pName: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    pHindi: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 2,
    },
    label: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
    },
    qtyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
      marginBottom: spacing.xl,
    },
    qBtn: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md - 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qBtnMinus: { backgroundColor: colors.cardBgVariant },
    qBtnPlus: { backgroundColor: colors.primary },
    qCount: {
      fontSize: typography.xl,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      minWidth: 32,
      textAlign: 'center',
    },
    unitTag: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginLeft: spacing.xs,
    },
    noteInput: {
      backgroundColor: colors.cardBgVariant,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md - 2,
      padding: spacing.md,
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      marginBottom: spacing.xl,
      minHeight: 64,
      textAlignVertical: 'top',
    },
    actionsRow: { flexDirection: 'row', gap: spacing.sm + 2 },
    removeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.error,
    },
    removeTxt: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.error,
    },
    saveBtn: {
      flex: 1,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveTxt: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.bold,
      color: onPrimary,
    },
    btnIcon: { marginRight: 6 },
  });
};

const useStyles = makeUseStyles(createStyles);

const EditItemModal = React.memo(
  ({
    visible,
    item,
    onClose,
    onSave,
    onRemove,
  }: {
    visible: boolean;
    item: SelectedP | null;
    onClose: () => void;
    onSave: (qty: number, note: string) => void;
    onRemove: () => void;
  }) => {
    const { theme, styles: em } = useStyles();
    const { colors } = theme;

    const [qty, setQty] = useState(item?.quantity ?? 1);
    const [ntxt, setNtxt] = useState(item?.note ?? '');

    useEffect(() => {
      setQty(item?.quantity ?? 1);
      setNtxt(item?.note ?? '');
    }, [item?.id]);

    if (!item) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={em.overlay}
        >
          <TouchableOpacity
            style={em.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={em.sheet}>
            <View style={em.handle} />
            <View style={em.headerRow}>
              <Text style={em.headerTitle}>Edit Item</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={em.productRow}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={em.thumb} />
              ) : (
                <View
                  style={[
                    em.thumb,
                    { alignItems: 'center', justifyContent: 'center' },
                  ]}
                >
                  <Icon name="image-outline" size={22} color={colors.textMuted} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={em.pName}>{item.name}</Text>
                <Text style={em.pHindi}>
                  {item.nameHindi} • {item.unit}
                </Text>
              </View>
            </View>

            <Text style={em.label}>Quantity / मात्रा</Text>
            <View style={em.qtyRow}>
              <TouchableOpacity
                onPress={() => setQty(q => Math.max(1, q - 1))}
                style={[em.qBtn, em.qBtnMinus]}
              >
                <Icon name="minus" size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={em.qCount}>{qty}</Text>
              <TouchableOpacity
                onPress={() => setQty(q => q + 1)}
                style={[em.qBtn, em.qBtnPlus]}
              >
                <Icon name="plus" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
              <Text style={em.unitTag}>{item.unit} each</Text>
            </View>

            <Text style={em.label}>Note / टिप्पणी</Text>
            <TextInput
              value={ntxt}
              onChangeText={t => setNtxt(t.slice(0, 120))}
              placeholder="e.g. Patanjali brand lena..."
              placeholderTextColor={colors.textMuted}
              style={em.noteInput}
              multiline
            />

            <View style={em.actionsRow}>
              <TouchableOpacity
                onPress={onRemove}
                activeOpacity={0.85}
                style={em.removeBtn}
              >
                <Icon
                  name="trash-can-outline"
                  size={16}
                  color={colors.error}
                  style={em.btnIcon}
                />
                <Text style={em.removeTxt}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSave(qty, ntxt)}
                activeOpacity={0.85}
                style={em.saveBtn}
              >
                <Icon
                  name="check-circle-outline"
                  size={18}
                  color={colors.onPrimary}
                  style={em.btnIcon}
                />
                <Text style={em.saveTxt}>Done / हो गया</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

export default EditItemModal;
