// src/features/list/screens/List.tsx
//
// FINAL LIST SCREEN — reached after "Continue" from CreateListScreen.
//
// ⚠️ Native packages needed for the 4 bottom actions:
//   npm install react-native-view-shot        (Save as Image)
//   npm install react-native-html-to-pdf       (Save as PDF)
//   (WhatsApp share uses the built-in Linking API — no extra package needed,
//    but the user must have WhatsApp installed.)
// Both view-shot and html-to-pdf need a native rebuild (pod install / gradle
// sync) — they will crash with "null is not an object" if you skip that.
//
// ⚠️ Navigation: update CreateListScreen's handleContinue to pass real data,
// e.g.  navigation.navigate('List', { listId, listName, items: Object.values(selectedProducts) })
// This screen falls back to an empty list if nothing is passed, just so it
// doesn't crash while you wire that up.

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
    Platform,
    Alert,
    Image,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Linking,
    Share,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Optional native modules — comment these two lines out if not installed yet,
// the screen still works minus Save-as-Image / Save-as-PDF.
import ViewShot from 'react-native-view-shot';
import { generatePDF } from 'react-native-html-to-pdf';

// ─── Nav types ────────────────────────────────────────────────────────────────
// NOTE: 'List' isn't in your existing CreateStackParamList yet, so it was
// resolving to `never` and breaking `route.params.listName` / `.items`.
// Add it there once you wire up navigation, e.g.:
//
//   export type CreateStackParamList = {
//     ...
//     List: { listId?: string; listName?: string; items?: SelectedP[] };
//   };
//
// Until then, this local param type keeps the screen self-contained and
// type-safe without depending on that file.
type ListStackParamList = {
    List: { listId?: string; listName?: string; items?: SelectedP[] };
};
type RouteProps = RouteProp<ListStackParamList, 'List'>;
type NavProp = NativeStackNavigationProp<ListStackParamList, 'List'>;

// ═══════════════════════════════════════════════════════════════════
// THEME — kept identical to CreateListScreen so both screens match.
// 👉 Better long-term: move this THEMES block into a shared
//    `src/shared/theme.ts` and import { DARK } from both screens,
//    instead of keeping two copies in sync by hand.
// ═══════════════════════════════════════════════════════════════════
const THEMES = {
    skySlate: {
        bg: '#FFFFFF', surface: '#FFFFFF', surfaceHigh: '#F0F6FA', border: '#DCE7EE',
        primary: 'skyblue', primaryMuted: '#EAF4FA', textPrimary: '#263640', textMuted: '#71818C',
        chipBorder: '#D5E2E9', searchBg: '#F3F7F9', green: '#5FA77A', red: '#D97878', accent: '#8AA7B8',
    },
} as const;
const ACTIVE_THEME: keyof typeof THEMES = 'skySlate';
const DARK = THEMES[ACTIVE_THEME];

const H_PADDING = 16;
const HEADER_H = Platform.OS === 'ios' ? 52 : 52;
const BOTTOM_BAR_H = 92;

// ─── Types ────────────────────────────────────────────────────────────────────
interface SelectedP {
    id: string;
    name: string;
    nameHindi: string;
    unit: string;
    imageUrl: string;
    quantity: number;
    note?: string;
}

// ─── Default / fallback items ──────────────────────────────────────────────
// Used ONLY when this screen is opened without real `route.params.items`
// (e.g. testing List.tsx directly, or before you've wired up navigation from
// CreateListScreen). Once real params flow in, this is ignored automatically
// — see `initialItems` below. Safe to delete once navigation is wired up.
const DEFAULT_ITEMS: SelectedP[] = [
    {
        id: '1',
        name: 'Fresh Tomatoes',
        nameHindi: 'ताजा टमाटर',
        unit: '1kg',
        imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
        quantity: 2,
    },
    {
        id: '3',
        name: 'Basmati Rice',
        nameHindi: 'बासमती चावल',
        unit: '5kg',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
        quantity: 1,
        note: 'India Gate brand lena',
    },
    {
        id: '5',
        name: 'Turmeric',
        nameHindi: 'हल्दी पाउडर',
        unit: '200g',
        imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
        quantity: 3,
    },
    {
        id: '6',
        name: 'Turmeric Powder',
        nameHindi: 'हल्दी पाउडर',
        unit: '200g',
        imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
        quantity: 1,
    },
    {
        id: '7',
        name: 'Fresh Paneer',
        nameHindi: 'ताजा पनीर',
        unit: '200g',
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
        quantity: 3,
    },
    {
        id: '8',
        name: 'Turmeric Powder',
        nameHindi: 'हल्दी पाउडर',
        unit: '200g',
        imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
        quantity: 1,
    },
    {
        id: '9',
        name: 'Turmeric Powder',
        nameHindi: 'हल्दी पाउडर',
        unit: '200g',
        imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
        quantity: 1,
    },


];

// ═══════════════════════════════════════════════════════════════════
// Row item — column-direction list, one product per row
// ═══════════════════════════════════════════════════════════════════
const ListRow = React.memo(({ item, onEdit }: {
    item: SelectedP;
    onEdit: (id: string) => void;
}) => (
    <View style={row.card}>
        <View style={row.topRow}>
            <View style={row.thumbWrap}>
                <Image source={{ uri: item.imageUrl }} style={row.thumb} />
                {!!item.note && (
                    <View style={row.noteBadge}>
                        <Icon name="note-text-outline" size={11} color="#fff" />
                    </View>

                )}

            </View>

            <View style={{ flex: 1 }}>
                <Text style={row.name} numberOfLines={1}>{item.name}</Text>
                <Text style={row.hindi} numberOfLines={1}>{item.nameHindi} • {item.unit}</Text>
                {item.note ? (
                    <View style={row.notePill}>
                        <Icon name="file-document-outline" size={12} color={DARK.primary} />
                        <Text style={row.noteText} numberOfLines={1}>{item.note}</Text>
                    </View>
                ) : null}
            </View>

            <View style={row.qtyPill}>
                <Text style={row.qtyPillTxt}>Qty {item.quantity}</Text>
            </View>
            <View style={row.bottomRow}>
                <TouchableOpacity onPress={() => onEdit(item.id)} activeOpacity={0.8} style={row.editBtn}>
                    <Icon name="pencil-outline" size={14} color={DARK.primary} />
                    {/* <Text style={row.editTxt}>Edit</Text> */}
                </TouchableOpacity>
            </View>
            {/* <View style={row.bottomRow}>
                <TouchableOpacity onPress={() => onEdit(item.id)} activeOpacity={0.8} style={row.editBtn}>
                    <Icon name="pencil-outline" size={14} color={DARK.primary} />
                    <Text style={row.editTxt}>Edit</Text>
                </TouchableOpacity>
            </View> */}

        </View>


    </View>
));
const row = StyleSheet.create({
    card: { backgroundColor: DARK.surface, borderRadius: 14, borderWidth: 1, borderColor: DARK.primary, padding: 12, marginBottom: 10 },
    topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    thumbWrap: { width: 52, height: 52 },
    thumb: { width: 52, height: 52, borderRadius: 10, borderWidth: 1, borderColor: DARK.border, backgroundColor: DARK.surfaceHigh },
    noteBadge: { position: 'absolute', top: -4, left: -4, width: 18, height: 18, borderRadius: 6, backgroundColor: DARK.primary, alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: 14, fontWeight: '700', color: DARK.textPrimary },
    hindi: { fontSize: 12, color: DARK.textMuted, marginTop: 2 },
    note: { fontSize: 11, color: DARK.textMuted, marginTop: 4 },
    qtyPill: { backgroundColor: DARK.primaryMuted, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
    qtyPillTxt: { fontSize: 12, fontWeight: '700', color: DARK.primary },
    bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: DARK.chipBorder },
    editTxt: { fontSize: 12, fontWeight: '600', color: DARK.primary },
    notePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        backgroundColor: DARK.primaryMuted,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    noteText: { fontSize: 10, color: DARK.primary, fontWeight: '500' },
});

// ═══════════════════════════════════════════════════════════════════
// Edit modal — quantity + note (same pattern as CreateListScreen)
// ═══════════════════════════════════════════════════════════════════
const EditItemModal = React.memo(({ visible, item, onClose, onSave, onRemove }: {
    visible: boolean;
    item: SelectedP | null;
    onClose: () => void;
    onSave: (qty: number, note: string) => void;
    onRemove: () => void;
}) => {
    const [qty, setQty] = useState(item?.quantity ?? 1);
    const [ntxt, setNtxt] = useState(item?.note ?? '');

    React.useEffect(() => {
        setQty(item?.quantity ?? 1);
        setNtxt(item?.note ?? '');
    }, [item?.id]);

    if (!item) return null;

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={em.overlay}>
                <TouchableOpacity style={em.backdrop} activeOpacity={1} onPress={onClose} />
                <View style={em.sheet}>
                    <View style={em.handle} />
                    <View style={em.headerRow}>
                        <Text style={em.headerTitle}>Edit Item</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Icon name="close" size={22} color={DARK.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={em.productRow}>
                        <Image source={{ uri: item.imageUrl }} style={em.thumb} />
                        <View style={{ flex: 1 }}>
                            <Text style={em.pName}>{item.name}</Text>
                            <Text style={em.pHindi}>{item.nameHindi} • {item.unit}</Text>
                        </View>
                    </View>

                    <Text style={em.label}>Quantity / मात्रा</Text>
                    <View style={em.qtyRow}>
                        <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={[em.qBtn, { backgroundColor: DARK.surfaceHigh }]}>
                            <Icon name="minus" size={16} color={DARK.textPrimary} />
                        </TouchableOpacity>
                        <Text style={em.qCount}>{qty}</Text>
                        <TouchableOpacity onPress={() => setQty(q => q + 1)} style={[em.qBtn, { backgroundColor: DARK.primary }]}>
                            <Icon name="plus" size={16} color="#fff" />
                        </TouchableOpacity>
                        <Text style={em.unitTag}>{item.unit} each</Text>
                    </View>

                    <Text style={em.label}>Note / टिप्पणी</Text>
                    <TextInput
                        value={ntxt}
                        onChangeText={t => setNtxt(t.slice(0, 120))}
                        placeholder="e.g. Patanjali brand lena..."
                        placeholderTextColor={DARK.textMuted}
                        style={em.noteInput}
                        multiline
                    />

                    <View style={em.actionsRow}>
                        <TouchableOpacity onPress={onRemove} activeOpacity={0.85} style={em.removeBtn}>
                            <Icon name="trash-can-outline" size={16} color={DARK.red} style={{ marginRight: 6 }} />
                            <Text style={em.removeTxt}>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onSave(qty, ntxt)} activeOpacity={0.85} style={em.saveBtn}>
                            <Icon name="check-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={em.saveTxt}>Done / हो गया</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});
const em = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: { backgroundColor: DARK.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24, borderTopWidth: 1, borderTopColor: DARK.border },
    handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: DARK.border, alignSelf: 'center', marginBottom: 14 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: DARK.textPrimary },
    productRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, padding: 12, backgroundColor: DARK.surfaceHigh, borderRadius: 12 },
    thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: DARK.bg },
    pName: { fontSize: 15, fontWeight: '700', color: DARK.textPrimary },
    pHindi: { fontSize: 12, color: DARK.textMuted, marginTop: 2 },
    label: { fontSize: 12, fontWeight: '600', color: DARK.textMuted, letterSpacing: 0.5, marginBottom: 8 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    qBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    qCount: { fontSize: 20, fontWeight: '800', color: DARK.textPrimary, minWidth: 32, textAlign: 'center' },
    unitTag: { fontSize: 12, color: DARK.textMuted, marginLeft: 4 },
    noteInput: { backgroundColor: DARK.searchBg, borderWidth: 1, borderColor: DARK.border, borderRadius: 10, padding: 12, fontSize: 14, color: DARK.textPrimary, marginBottom: 20, minHeight: 64, textAlignVertical: 'top' },
    actionsRow: { flexDirection: 'row', gap: 10 },
    removeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5, borderColor: DARK.red },
    removeTxt: { fontSize: 14, fontWeight: '700', color: DARK.red },
    saveBtn: { flex: 1, height: 50, backgroundColor: DARK.primary, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    saveTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

// ═══════════════════════════════════════════════════════════════════
// Bottom action bar — 4 buttons in a row, icon + label
// ═══════════════════════════════════════════════════════════════════
const ExportBar = React.memo(({ onSaveDraft, onSavePdf, onSaveImage, onShareWhatsapp, disabled }: {
    onSaveDraft: () => void;
    onSavePdf: () => void;
    onSaveImage: () => void;
    onShareWhatsapp: () => void;
    disabled: boolean;
}) => (
    <View style={xb.wrap}>
        <TouchableOpacity onPress={onSaveDraft} style={xb.item} activeOpacity={0.8}>
            <View style={xb.iconWrap}><Icon name="content-save-outline" size={20} color={DARK.primary} /></View>
            <Text style={xb.label}>Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSavePdf} disabled={disabled} style={[xb.item, disabled && xb.itemDisabled]} activeOpacity={0.8}>
            <View style={xb.iconWrap}><Icon name="file-pdf-box" size={20} color={DARK.primary} /></View>
            <Text style={xb.label}>PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSaveImage} disabled={disabled} style={[xb.item, disabled && xb.itemDisabled]} activeOpacity={0.8}>
            <View style={xb.iconWrap}><Icon name="image-outline" size={20} color={DARK.primary} /></View>
            <Text style={xb.label}>Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShareWhatsapp} disabled={disabled} style={[xb.item, disabled && xb.itemDisabled]} activeOpacity={0.8}>
            <View style={[xb.iconWrap, { backgroundColor: '#25D366' }]}>
                <Icon name="whatsapp" size={20} color="#fff" />
            </View>
            <Text style={xb.label}>WhatsApp</Text>
        </TouchableOpacity>
    </View>
));
const xb = StyleSheet.create({
    wrap: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        backgroundColor: DARK.bg,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: DARK.border,
        paddingTop: 10, paddingHorizontal: 8,
        paddingBottom: Platform.OS === 'ios' ? 26 : 12,
    },
    item: { flex: 1, alignItems: 'center', gap: 4 },
    itemDisabled: { opacity: 0.4 },
    iconWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: DARK.primaryMuted, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 11, fontWeight: '600', color: DARK.textMuted },
});

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const List: React.FC = () => {
    const route = useRoute<RouteProps>();
    const navigation = useNavigation<NavProp>();

    const listName = route.params?.listName ?? 'Meri List';
    const initialItems: SelectedP[] = route.params?.items ?? DEFAULT_ITEMS;

    const [items, setItems] = useState<Record<string, SelectedP>>(
        Object.fromEntries(initialItems.map(i => [i.id, i]))
    );
    const [editingId, setEditingId] = useState<string | null>(null);

    const itemList = useMemo(() => Object.values(items), [items]);
    const itemCount = itemList.length;
    const totalQty = useMemo(() => itemList.reduce((sum, i) => sum + i.quantity, 0), [itemList]);

    const captureRef = useRef<React.ComponentRef<typeof ViewShot>>(null);

    useFocusEffect(
        useCallback(() => {
            const parent = navigation.getParent();
            parent?.setOptions({ tabBarStyle: { display: 'none' } });
            return () => parent?.setOptions({ tabBarStyle: undefined });
        }, [navigation])
    );

    // ── item handlers ──
    const handleDelete = useCallback((id: string) => {
        Alert.alert('Item hatana hai?', '', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove', style: 'destructive', onPress: () => {
                    setItems(prev => { const next = { ...prev }; delete next[id]; return next; });
                },
            },
        ]);
    }, []);

    const handleEdit = useCallback((id: string) => setEditingId(id), []);

    const handleEditSave = useCallback((qty: number, note: string) => {
        if (!editingId) return;
        setItems(prev => ({ ...prev, [editingId]: { ...prev[editingId], quantity: qty, note: note.trim() || undefined } }));
        setEditingId(null);
    }, [editingId]);

    // Remove button lives inside the edit modal now — closes the sheet and
    // reuses the same confirm dialog as before.
    const handleEditRemove = useCallback(() => {
        if (!editingId) return;
        const id = editingId;
        setEditingId(null);
        handleDelete(id);
    }, [editingId, handleDelete]);

    // ── export handlers ──
    const buildPlainText = useCallback(() => {
        const lines = itemList.map((it, idx) => {
            const notePart = it.note ? `  (${it.note})` : '';
            return `${idx + 1}. ${it.name} / ${it.nameHindi} — ${it.quantity} × ${it.unit}${notePart}`;
        });
        return `🛒 ${listName}\n\n${lines.join('\n')}\n\nTotal items: ${itemCount}`;
    }, [itemList, listName, itemCount]);

    const handleSaveDraft = useCallback(() => {
        // TODO: persist `items` to AsyncStorage / backend here
        Alert.alert('Draft Save Ho Gaya! ✅', `${itemCount} items save ho gaye.`);
    }, [itemCount]);

    const handleShareWhatsapp = useCallback(async () => {
        if (itemCount === 0) return;
        const text = buildPlainText();
        const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                // fallback to native share sheet if WhatsApp isn't installed / scheme blocked
                await Share.share({ message: text });
            }
        } catch {
            Alert.alert('Share nahi ho paya', 'WhatsApp installed hai ki nahi check kar lein.');
        }
    }, [itemCount, buildPlainText]);

    const handleSaveAsPDF = useCallback(async () => {
        if (itemCount === 0) return;
        try {
            const rowsHtml = itemList.map((it, idx) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${idx + 1}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${it.name} (${it.nameHindi})</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${it.unit}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${it.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${it.note ?? ''}</td>
        </tr>`).join('');

            const html = `
        <html><body style="font-family:sans-serif;padding:16px;">
          <h2>${listName}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f3f3f3;">
              <th style="padding:8px;text-align:left;">#</th>
              <th style="padding:8px;text-align:left;">Item</th>
              <th style="padding:8px;text-align:left;">Unit</th>
              <th style="padding:8px;text-align:left;">Qty</th>
              <th style="padding:8px;text-align:left;">Note</th>
            </tr>
            ${rowsHtml}
          </table>
        </body></html>`;

            const pdf = await generatePDF({
                html,
                fileName: `list-${Date.now()}`,
                base64: false,
            });

            if (pdf.filePath) {
                Alert.alert('PDF Ban Gaya ✅', pdf.filePath, [
                    { text: 'OK' },
                    { text: 'Share', onPress: () => Share.share({ url: pdf.filePath! }) },
                ]);
            }
        } catch (err) {
            Alert.alert('PDF nahi ban paya', 'react-native-html-to-pdf install + native rebuild check karein.');
        }
    }, [itemList, listName, itemCount]);

    const handleSaveAsImage = useCallback(async () => {
        if (itemCount === 0) return;
        try {
            const uri = await captureRef.current?.capture?.();
            if (uri) {
                Alert.alert('Image Ban Gayi ✅', uri, [
                    { text: 'OK' },
                    { text: 'Share', onPress: () => Share.share({ url: uri }) },
                ]);
            }
        } catch (err) {
            Alert.alert('Image nahi ban payi', 'react-native-view-shot install + native rebuild check karein.');
        }
    }, [itemCount]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);

    const renderItem = useCallback(({ item }: { item: SelectedP }) => (
        <ListRow
            item={item}
            onEdit={handleEdit}
        />
    ), [handleEdit]);

    const editingItem = editingId ? items[editingId] : null;

    return (
        <View style={s.root}>
            <StatusBar barStyle="dark-content" backgroundColor={DARK.bg} />
            <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>

                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.75} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={s.iconBtn}>
                        <Icon name="arrow-left" size={24} color={DARK.textPrimary} />
                    </TouchableOpacity>
                    <View style={s.headerCenter}>
                        <Text style={s.headerTitle} numberOfLines={1}>{listName}</Text>
                        {/* <Text style={s.headerSub}>{itemCount} items · {totalQty} qty</Text> */}
                    </View>
                    <View style={s.iconBtn} />
                </View>


                {/* This wraps the visible list so "Save as Image" captures exactly
            what the user sees. ViewShot only screenshots its children, it
            doesn't change layout/behaviour. */}
                <ViewShot ref={captureRef} style={{ flex: 1 }} options={{ format: 'png', quality: 0.95 }}>
                    <FlatList
                        data={itemList}
                        keyExtractor={i => i.id}
                        renderItem={renderItem}
                        contentContainerStyle={[s.listContent, { paddingBottom: BOTTOM_BAR_H + 16 }]}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingVertical: 64, gap: 10 }}>
                                <Icon name="basket-off-outline" size={48} color={DARK.textMuted} />
                                <Text style={{ color: DARK.textPrimary, fontWeight: '600' }}>List khali hai</Text>
                            </View>
                        }
                    />
                </ViewShot>

                <ExportBar
                    onSaveDraft={handleSaveDraft}
                    onSavePdf={handleSaveAsPDF}
                    onSaveImage={handleSaveAsImage}
                    onShareWhatsapp={handleShareWhatsapp}
                    disabled={itemCount === 0}
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

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: DARK.bg },
    safeArea: { flex: 1, backgroundColor: DARK.bg },
    header: {
        height: HEADER_H, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: H_PADDING, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: DARK.border,
    },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '700', color: DARK.textPrimary },
    headerSub: { fontSize: 11, color: DARK.textMuted, marginTop: 1 },
    listContent: { padding: H_PADDING },
});

export default List;