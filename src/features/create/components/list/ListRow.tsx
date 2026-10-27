// src/features/create/components/list/ListRow.tsx
// Screen par dikhne wali ek item row (photo + naam + qty + edit button)

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import { SelectedP } from '../../constants/listDefaults';


const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const primaryMuted = colors.primaryMuted; // 6-digit hex hona chahiye

  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg - 2,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm + 2,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    thumbWrap: { width: 52, height: 52 },
    thumb: {
      width: 52,
      height: 52,
      borderRadius: borderRadius.md - 2,
      backgroundColor: colors.cardBgVariant,
    },
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
    qtyPill: {
      backgroundColor: primaryMuted,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    qtyPillTxt: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    editBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: 7,
      paddingVertical: 7,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
      backgroundColor: primaryMuted,
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
  });
};

const useStyles = makeUseStyles(createStyles);

const ListRow = React.memo(
  ({ item, onEdit }: { item: SelectedP; onEdit: (id: string) => void }) => {
    const { theme, styles: row } = useStyles();
    const { colors } = theme;

    return (
      <View style={row.card}>
        <View style={row.topRow}>
          <View style={row.thumbWrap}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={row.thumb} />
            ) : (
              <View
                style={[
                  row.thumb,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <Icon name="image-outline" size={22} color={colors.textMuted} />
              </View>
            )}
            {!!item.note && (
              <View style={row.noteBadge}>
                <Icon
                  name="note-text-outline"
                  size={11}
                  color={colors.onPrimary}
                />
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={row.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={row.hindi} numberOfLines={1}>
              {item.nameHindi} • {item.unit}
            </Text>
            {item.note ? (
              <View style={row.notePill}>
                <Icon
                  name="file-document-outline"
                  size={12}
                  color={colors.primary}
                />
                <Text style={row.noteText} numberOfLines={1}>
                  {item.note}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={row.qtyPill}>
            <Text style={row.qtyPillTxt}>Qty {item.quantity}</Text>
          </View>
          <View style={row.bottomRow}>
            <TouchableOpacity
              onPress={() => onEdit(item.id)}
              activeOpacity={0.8}
              style={row.editBtn}
            >
              <Icon name="pencil-outline" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

export default ListRow;
