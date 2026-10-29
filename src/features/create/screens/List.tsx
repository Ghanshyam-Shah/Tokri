// src/features/create/screens/List.tsx
//
// FINAL LIST SCREEN — CreateListScreen ke "Continue" ke baad.
// Header: shared AppHeader (back + list name + share icon).
// Chhote hisse alag files me hain:
//   components/list/*   -> CategoryChips, ListRow, EditItemModal, ExportBar,
//                          DownloadSheet, ExportImageView
//   hooks/*             -> useListExport (share/PDF/image), useCollapsibleBar
//   utils/listExport.ts -> permission, file name, PDF html
//   constants/listDefaults.ts -> categories, fallback items
// Colors/fonts/spacing: sab useTheme() se.

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { makeUseStyles, AppTheme } from '../../../shared/utils/makeUseStyles';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';

import CategoryChips from '../components/list/CategoryChips';
import ListRow from '../components/list/ListRow';
import EditItemModal from '../components/list/EditItemModal';
import ExportBar from '../components/list/ExportBar';
import DownloadSheet from '../components/list/DownloadSheet';
import ExportImageView from '../components/list/ExportImageView';
import { useListExport } from '../hooks/useListExport';
import { useCollapsibleBar } from '../hooks/useCollapsibleBar';
import {
  H_PADDING,
  CATEGORIES,
  DEFAULT_ITEMS,
  SelectedP,
} from '../constants/listDefaults';

type RouteProps = RouteProp<AppStackParamList, 'List'>;

// ═══════════════════════════════════════════════════════════════════
// STYLES (theme se)
// ═══════════════════════════════════════════════════════════════════

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    safeArea: { flex: 1, backgroundColor: colors.appBackground },
    body: { flex: 1 },

    // absolute overlay: hide hone par gap nahi bachta; FlatList ka
    // paddingTop (=barHeight) neeche jagah reserve karta hai.
    collapsibleBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: colors.appBackground,
      paddingBottom: spacing.sm,
    },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: H_PADDING,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      height: 44,
    },
    searchIcon: { marginRight: spacing.sm },
    searchInput: {
      flex: 1,
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      paddingVertical: 0,
    },
    // list area ka solid background
    captureArea: { flex: 1, backgroundColor: colors.appBackground },
    listContent: { paddingHorizontal: H_PADDING },
    emptyWrap: {
      alignItems: 'center',
      paddingVertical: spacing.giant,
      gap: spacing.sm + 2,
    },
    emptyTxt: {
      color: colors.textPrimary,
      fontFamily: fontFamilies.semiBold,
      fontSize: typography.sm,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const List: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { theme, styles: s } = useStyles();
  const { colors } = theme;

  const listName = route.params?.listName ?? 'Meri List';
  const description = route.params?.description;
  const initialItems: SelectedP[] = route.params?.items ?? DEFAULT_ITEMS;

  const [items, setItems] = useState<Record<string, SelectedP>>(
    Object.fromEntries(initialItems.map(i => [i.id, i])),
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── search + category filter ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const itemList = useMemo(() => Object.values(items), [items]);
  const itemCount = itemList.length;

  // jo render hota hai — search + category se filtered
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return itemList.filter(i => {
      const catOk =
        selectedCategory === 'all' || i.categoryId === selectedCategory;
      const srchOk =
        !q || i.name.toLowerCase().includes(q) || i.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [itemList, selectedCategory, searchQuery]);

  // ── item handlers ──
  const handleDelete = useCallback((id: string) => {
    Alert.alert('Item hatana hai?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setItems(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
      },
    ]);
  }, []);

  const handleEdit = useCallback((id: string) => setEditingId(id), []);

  const handleEditSave = useCallback(
    (qty: number, note: string) => {
      if (!editingId) return;
      setItems(prev => ({
        ...prev,
        [editingId]: {
          ...prev[editingId],
          quantity: qty,
          note: note.trim() || undefined,
        },
      }));
      setEditingId(null);
    },
    [editingId],
  );

  // Remove button edit modal ke andar — sheet band karke wahi confirm dialog
  const handleEditRemove = useCallback(() => {
    if (!editingId) return;
    const id = editingId;
    setEditingId(null);
    handleDelete(id);
  }, [editingId, handleDelete]);

  const handleSaveDraft = useCallback(() => {
    // TODO: `items` ko AsyncStorage / backend me persist karo
    Alert.alert('Draft Save Ho Gaya! ✅', `${itemCount} items save ho gaye.`);
  }, [itemCount]);

  // ── export (share / PDF / image) ──
  const captureRef = useRef<React.ComponentRef<typeof ViewShot>>(null);
  const { handleShare, handleSaveAsPDF, handleSaveAsImage } = useListExport({
    items: itemList,
    listName,
    description,
    captureRef,
  });

  // ── Download sheet ──
  const [downloadVisible, setDownloadVisible] = useState(false);
  const pendingDownload = useRef<'pdf' | 'image' | null>(null);

  // Pehle sheet band hogi, phir kaam chalega (iOS par sheet ke upar Alert nahi rukta)
  const chooseDownload = useCallback((type: 'pdf' | 'image') => {
    pendingDownload.current = type;
    setDownloadVisible(false);
  }, []);

  const handleDownloadDismissed = useCallback(() => {
    const type = pendingDownload.current;
    pendingDownload.current = null;
    if (type === 'pdf') handleSaveAsPDF();
    else if (type === 'image') handleSaveAsImage();
  }, [handleSaveAsPDF, handleSaveAsImage]);

  const renderItem = useCallback(
    ({ item }: { item: SelectedP }) => (
      <ListRow item={item} onEdit={handleEdit} />
    ),
    [handleEdit],
  );

  const editingItem = editingId ? items[editingId] : null;

  // ── collapsible search + chips bar ──
  const { barHeight, setBarHeight, barTranslateY, handleScroll } =
    useCollapsibleBar();

  return (
    <View style={s.root}>
      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        {/* ═════════════════════════════ App Header ═════════════════════════════ */}
        <AppHeader
          title={listName}
          leftAction="back"
          rightIcon="share-outline"
          onRightPress={handleShare}
          showThemeToggle={false}
        />

        {/* Body: collapsible search/chips overlay + list */}
        <View style={s.body}>
          <Animated.View
            onLayout={e => setBarHeight(e.nativeEvent.layout.height)}
            style={[
              s.collapsibleBar,
              { transform: [{ translateY: barTranslateY }] },
            ]}
          >
            <View style={s.searchWrap}>
              <Icon
                name="magnify"
                size={20}
                color={colors.textMuted}
                style={s.searchIcon}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search this list..."
                placeholderTextColor={colors.textMuted}
                style={s.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.75}
                >
                  <Icon
                    name="close-circle"
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>

            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </Animated.View>

          <View style={s.captureArea}>
            <FlatList
              data={filteredItems}
              keyExtractor={i => i.id}
              renderItem={renderItem}
              contentContainerStyle={[
                s.listContent,
                { paddingTop: barHeight, paddingBottom: 24 },
              ]}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={s.emptyWrap}>
                  <Icon
                    name="basket-off-outline"
                    size={48}
                    color={colors.textMuted}
                  />
                  <Text style={s.emptyTxt}>
                    {itemCount === 0 ? 'List khali hai' : 'Kuch nahi mila'}
                  </Text>
                </View>
              }
            />
          </View>
        </View>

        {/* "Save as Image" ke liye poori list ka offscreen table (user ko nahi dikhta) */}
        <ExportImageView
          captureRef={captureRef}
          listName={listName}
          description={description}
          items={itemList}
        />

        <ExportBar
          onSaveDraft={handleSaveDraft}
          onDownload={() => setDownloadVisible(true)}
          disabled={itemCount === 0}
        />

        <DownloadSheet
          visible={downloadVisible}
          onClose={() => setDownloadVisible(false)}
          onDismissed={handleDownloadDismissed}
          onPdf={() => chooseDownload('pdf')}
          onImage={() => chooseDownload('image')}
        />
        <EditItemModal
          visible={!!editingItem}
          item={editingItem}
          onClose={() => setEditingId(null)}
          onSave={handleEditSave}
          onRemove={handleEditRemove}
        />
      </SafeAreaView>
    </View>
  );
};

export default List;
