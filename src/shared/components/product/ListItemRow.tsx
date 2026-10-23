// src/shared/components/product/ListItemRow.tsx
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

export interface ListItemRowData {
  id: string;
  name: string;
  nameHindi: string;
  unit: string;
  imageUrl?: string;
  quantity: number;
  note?: string;
}

interface Props {
  item: ListItemRowData;
  onEdit?: (id: string) => void; // na do to edit button nahi dikhega
}

const ListItemRow: React.FC<Props> = ({ item, onEdit }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View style={s.thumbWrap}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={s.thumb} />
          ) : (
            <View style={[s.thumb, s.thumbEmpty]}>
              <Icon name="image-outline" size={22} color={colors.textMuted} />
            </View>
          )}
          {!!item.note && (
            <View style={s.noteBadge}>
              <Icon name="note-text-outline" size={11} color={colors.onPrimary} />
            </View>
          )}
        </View>

        <View style={s.info}>
          <Text style={s.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={s.hindi} numberOfLines={1}>
            {item.nameHindi} • {item.unit}
          </Text>
          {item.note ? (
            <View style={s.notePill}>
              <Icon name="file-document-outline" size={12} color={colors.primary} />
              <Text style={s.noteText} numberOfLines={1}>
                {item.note}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={s.qtyPill}>
          <Text style={s.qtyTxt}>Qty {item.quantity}</Text>
        </View>

        {onEdit ? (
          <TouchableOpacity
            onPress={() => onEdit(item.id)}
            activeOpacity={0.8}
            style={s.editBtn}
          >
            <Icon name="pencil-outline" size={14} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg - 2,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm + 2,
    },
    topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
    thumbWrap: { width: 52, height: 52 },
    thumb: {
      width: 52,
      height: 52,
      borderRadius: borderRadius.md - 2,
      backgroundColor: colors.cardBgVariant,
    },
    thumbEmpty: { alignItems: 'center', justifyContent: 'center' },
    noteBadge: {
      position: 'absolute',
      top: -4,
      left: -4,
      width: 18,
      height: 18,
      borderRadius: 6,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1 },
    name: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    hindi: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.hindi ?? fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 2,
    },
    notePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
      backgroundColor: colors.primaryMuted,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    noteText: {
      fontSize: typography.xs - 2,
      fontFamily: fontFamilies.medium,
      color: colors.primary,
    },
    qtyPill: {
      backgroundColor: colors.primaryMuted,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    qtyTxt: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
    },
    editBtn: {
      padding: 7,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
};

export default ListItemRow;