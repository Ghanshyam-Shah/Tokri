// src/features/list/components/ListSheet.tsx
//
// CreateListScreen ki ek hi bottom sheet, do view:
//   'preview' -> chuni hui items ki list (± stepper + pencil)
//   'edit'    -> ek item ki quantity / note (sticky Remove + Done footer)
//
// Preview se pencil dabane par usi sheet me Edit view aata hai (back arrow ke
// saath), isliye do Modal ek ke upar ek nahi khulte.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import BottomSheet from '../../../shared/components/sheets/BottomSheet';
import EmptyState from '../../../shared/components/states/EmptyState';
import QuantityStepper from '../../../shared/components/product/QuantityStepper';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import { SelectedProduct } from '../../../Data/types';

export type SheetView = 'preview' | 'edit';

const NOTE_MAX = 120;

interface ListSheetProps {
  visible: boolean;
  view: SheetView;
  /** Chuni hui saari items (preview ke liye) */
  items: SelectedProduct[];
  /** Edit view me jo item khula hai */
  editingItem: SelectedProduct | null;
  /** Edit view me back arrow dikhana hai? (preview se aaye ho to true) */
  canGoBack: boolean;

  onClose: () => void;
  onDismissed: () => void;

  // preview
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onOpenEdit: (id: string) => void;

  // edit
  onBack: () => void;
  onSave: (qty: number, note: string) => void;
  onRemove: () => void;
}

// ─── Preview row ──────────────────────────────────────────────────
const PreviewRow = React.memo(
  ({
    item,
    onIncrease,
    onDecrease,
    onOpenEdit,
  }: {
    item: SelectedProduct;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onOpenEdit: (id: string) => void;
  }) => {
    const { theme, st } = useSheetStyles();
    const { colors } = theme;

    return (
      <View style={st.row}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={st.thumb} />
        ) : (
          <View style={st.thumb}>
            <Icon name="image-off-outline" size={18} color={colors.textMuted} />
          </View>
        )}

        <View style={st.rowInfo}>
          <Text style={st.rowName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={st.rowSub} numberOfLines={1}>
            {item.unit}
          </Text>
          {!!item.note && (
            <Text style={st.rowNote} numberOfLines={1}>
              <Icon
                name="note-text-outline"
                size={11}
                color={colors.textMuted}
              />{' '}
              {item.note}
            </Text>
          )}
        </View>

        <QuantityStepper
          quantity={item.quantity}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
        />

        <TouchableOpacity
          onPress={() => onOpenEdit(item.id)}
          activeOpacity={0.8}
          style={st.rowEditBtn}
        >
          <Icon name="pencil-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  },
);

// ─── Main ─────────────────────────────────────────────────────────
const ListSheet: React.FC<ListSheetProps> = ({
  visible,
  view,
  items,
  editingItem,
  canGoBack,
  onClose,
  onDismissed,
  onIncrease,
  onDecrease,
  onOpenEdit,
  onBack,
  onSave,
  onRemove,
}) => {
  const { theme, st } = useSheetStyles();
  const { colors } = theme;

  // Edit form ka local state
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  // Item remove hone par bhi close animation ke dauran last item dikhta rahe
  const lastEditing = useRef<SelectedProduct | null>(null);
  if (editingItem) {
    lastEditing.current = editingItem;
  }
  const shownItem = editingItem ?? lastEditing.current;

  // Edit view khulte hi (ya item badalte hi) form ko item ki values se bharo
  useEffect(() => {
    if (view === 'edit' && editingItem) {
      setQty(editingItem.quantity);
      setNote(editingItem.note ?? '');
    }
    // sirf view / item badalne par; typing ke dauran dobara reset nahi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, editingItem?.id]);

  const totalQty = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const renderRow = useCallback(
    ({ item }: { item: SelectedProduct }) => (
      <PreviewRow
        item={item}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onOpenEdit={onOpenEdit}
      />
    ),
    [onIncrease, onDecrease, onOpenEdit],
  );

  // ── Preview view ──
  const previewBody =
    items.length === 0 ? (
      <EmptyState
        compact
        icon="basket-outline"
        title="Koi item select nahi hua"
        subtitle="Grid se items add karo, phir yahan dikhenge"
      />
    ) : (
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={renderRow}
        ItemSeparatorComponent={() => <View style={st.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={st.listContent}
      />
    );

  // ── Edit view ──
  const editBody = shownItem ? (
    <>
      {/* Product info */}
      <View style={st.productRow}>
        {shownItem.imageUrl ? (
          <Image source={{ uri: shownItem.imageUrl }} style={st.editThumb} />
        ) : (
          <View style={st.editThumb}>
            <Icon name="image-off-outline" size={20} color={colors.textMuted} />
          </View>
        )}
        <View style={st.rowInfo}>
          <Text style={st.pName}>{shownItem.name}</Text>
          <Text style={st.pHindi}>
            {shownItem.nameHindi} • {shownItem.unit}
          </Text>
        </View>
      </View>

      {/* Quantity */}
      <Text style={st.label}>Quantity / मात्रा</Text>
      <View style={st.qtyRow}>
        <TouchableOpacity
          onPress={() => setQty(q => Math.max(1, q - 1))}
          style={[st.qBtn, st.qBtnMinus]}
        >
          <Icon name="minus" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={st.qCount}>{qty}</Text>
        <TouchableOpacity
          onPress={() => setQty(q => q + 1)}
          style={[st.qBtn, st.qBtnPlus]}
        >
          <Icon name="plus" size={16} color={colors.onPrimary} />
        </TouchableOpacity>
        <Text style={st.unitTag}>{shownItem.unit} each</Text>
      </View>

      {/* Note */}
      <View style={st.noteHeaderRow}>
        <Text style={st.label}>Note / टिप्पणी</Text>
        <Text style={st.charCount}>
          {note.length}/{NOTE_MAX}
        </Text>
      </View>
      <TextInput
        value={note}
        onChangeText={t => setNote(t.slice(0, NOTE_MAX))}
        placeholder="e.g. Patanjali brand lena..."
        placeholderTextColor={colors.textMuted}
        style={st.noteInput}
        multiline
        numberOfLines={2}
      />
    </>
  ) : null;

  // Sticky footer (sirf edit view me)
  const editFooter = (
    <View style={st.actionsRow}>
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.85}
        style={st.removeBtn}
      >
        <Icon
          name="trash-can-outline"
          size={16}
          color={colors.error}
          style={st.btnIcon}
        />
        <Text style={st.removeTxt}>Remove</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSave(qty, note)}
        activeOpacity={0.85}
        style={st.doneBtn}
      >
        <Icon
          name="check-circle-outline"
          size={18}
          color={colors.onPrimary}
          style={st.btnIcon}
        />
        <Text style={st.doneTxt}>Done / हो गया</Text>
      </TouchableOpacity>
    </View>
  );

  const isEdit = view === 'edit';

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      onDismissed={onDismissed}
      title={isEdit ? 'Edit Item' : 'List Preview'}
      subtitle={
        isEdit ? undefined : `${items.length} items • Qty ${totalQty}`
      }
      headerLeft={
        isEdit && canGoBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={st.backBtn}
            hitSlop={10}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : undefined
      }
      scrollable={isEdit}
      footer={isEdit ? editFooter : undefined}
    >
      {isEdit ? editBody : previewBody}
    </BottomSheet>
  );
};

// ─── Styles (theme ke hisaab se cache) ────────────────────────────
const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    // ── Preview ──
    listContent: { paddingBottom: spacing.md },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm + 2,
    },
    thumb: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.cardBgVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowInfo: { flex: 1 },
    rowName: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    rowSub: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 1,
    },
    rowNote: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 2,
    },
    // card ke pencil button jaisa
    rowEditBtn: {
      width: 30,
      height: 30,
      borderRadius: borderRadius.sm,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Edit ──
    backBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.cardBgVariant,
      alignItems: 'center',
      justifyContent: 'center',
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
    editThumb: {
      width: 52,
      height: 52,
      borderRadius: borderRadius.md - 2,
      backgroundColor: colors.appBackground,
      alignItems: 'center',
      justifyContent: 'center',
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
    },
    qtyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
      marginTop: spacing.sm,
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
    noteHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    charCount: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
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
      marginBottom: spacing.md,
      minHeight: 64,
      textAlignVertical: 'top',
    },

    // ── Sticky footer buttons ──
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
    doneBtn: {
      flex: 1,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    doneTxt: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.bold,
      color: colors.onPrimary,
    },
    btnIcon: { marginRight: 6 },
  });
};

const stylesCache = new WeakMap<AppTheme, ReturnType<typeof createStyles>>();
const useSheetStyles = () => {
  const { theme } = useTheme();
  let st = stylesCache.get(theme);
  if (!st) {
    st = createStyles(theme);
    stylesCache.set(theme, st);
  }
  return { theme, st };
};

export default ListSheet;