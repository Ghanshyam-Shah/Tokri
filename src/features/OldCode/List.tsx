import React, { useState, useCallback, useMemo } from 'react';
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
    Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ─── Theme ────────────────────────────────────────────────────────────────────
const DARK = {
    bg: '#FDF9FB',
    surface: '#FFFFFF',
    surfaceHigh: '#FAF3F6',
    border: '#EDE1E6',
    primary: '#DFA6B8',
    primaryMuted: '#FCEFF3',
    textPrimary: '#3B3438',
    textMuted: '#897D83',
    chipBorder: '#E7DBE0',
    searchBg: '#FAF5F7',
    green: '#70A383',
    red: '#D58089',
    accent: '#B79CA7',
};

const H_PADDING = 16;
const HEADER_H = Platform.OS === 'ios' ? 52 : 58;

// ─── Types ────────────────────────────────────────────────────────────────────
interface ListItem {
    id: string;
    name: string;
    nameHindi: string;
    unit: string;
    quantity: number;
    completed: boolean;
    imageUrl: string;
    note?: string;
}

// ─── Initial Mock List Data ───────────────────────────────────────────────────
const INITIAL_ITEMS: ListItem[] = [
    {
        id: '1',
        name: 'Fresh Tomatoes',
        nameHindi: 'ताजा टमाटर',
        unit: '1kg',
        quantity: 2,
        completed: false,
        imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
        note: 'Lal aur pakka hua lena',
    },
    {
        id: '3',
        name: 'Basmati Rice',
        nameHindi: 'बासमती चावल',
        unit: '5kg',
        quantity: 1,
        completed: true,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
        note: 'Fortune ya India Gate',
    },
    {
        id: '5',
        name: 'Yellow Bell Pepper',
        nameHindi: 'पीली शिमला मिर्च',
        unit: '250g',
        quantity: 1,
        completed: true,
        imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    },
    {
        id: '7',
        name: 'Fresh Paneer',
        nameHindi: 'ताजा पनीर',
        unit: '200g',
        quantity: 2,
        completed: true,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
        note: 'Amul fresh paneer block',
    },
];

const List: React.FC = () => {
    const navigation = useNavigation();

    const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

    // Stats
    const totalCount = items.length;
    const completedCount = useMemo(() => items.filter(i => i.completed).length, [items]);
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Filtered items
    const filteredItems = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(q) || item.nameHindi.includes(q);
            if (!matchesSearch) return false;
            if (filterMode === 'pending') return !item.completed;
            if (filterMode === 'completed') return item.completed;
            return true;
        });
    }, [items, searchQuery, filterMode]);

    // Handlers
    const handleToggleComplete = useCallback((id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    }, []);

    const handleIncrease = useCallback((id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    }, []);

    const handleDecrease = useCallback((id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                if (item.quantity <= 1) return item;
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }));
    }, []);

    const handleDelete = useCallback((id: string) => {
        Alert.alert('Remove Item', 'Kya aap is item ko list se hatana chahte hain?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => setItems(prev => prev.filter(i => i.id !== id)),
            },
        ]);
    }, []);

    const handleShareList = useCallback(async () => {
        if (items.length === 0) {
            Alert.alert('Empty List', 'List me koi item nahi hai share karne ke liye.');
            return;
        }
        const textList = items
            .map((item, idx) => `${idx + 1}. ${item.completed ? '✅' : '⭕'} ${item.name} (${item.nameHindi}) - ${item.quantity} x ${item.unit}${item.note ? ` [Note: ${item.note}]` : ''}`)
            .join('\n');

        const shareMessage = `🛒 *Meri Tokri List*\n\n${textList}\n\nShared via Tokri App ✨`;
        try {
            await Share.share({ message: shareMessage });
        } catch (error) {
            Alert.alert('Error', 'Share karne me samasya aai.');
        }
    }, [items]);

    const handleClearCompleted = useCallback(() => {
        if (completedCount === 0) return;
        Alert.alert('Clear Completed', 'Sabhi kharide hue items hatayein?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear',
                style: 'destructive',
                onPress: () => setItems(prev => prev.filter(i => !i.completed)),
            },
        ]);
    }, [completedCount]);

    const renderItem = useCallback(({ item }: { item: ListItem }) => (
        <View style={[styles.itemCard, item.completed && styles.itemCardCompleted]}>
            {/* Checkbox */}
            {/* <TouchableOpacity
                onPress={() => handleToggleComplete(item.id)}
                activeOpacity={0.8}
                style={styles.checkboxTouch}
            >
                <Icon
                    name={item.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                    size={24}
                    color={item.completed ? DARK.green : DARK.textMuted}
                />
            </TouchableOpacity> */}

            {/* Product Image */}
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

            {/* Item Info */}
            <View style={styles.itemDetails}>
                <Text style={[styles.itemName, item.completed && styles.itemNameCompleted]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.itemSub} numberOfLines={1}>
                    {item.nameHindi} • {item.unit}
                </Text>
                {item.note ? (
                    <View style={styles.notePill}>
                        <Icon name="file-document-outline" size={12} color={DARK.primary} />
                        <Text style={styles.noteText} numberOfLines={1}>{item.note}</Text>
                    </View>
                ) : null}
            </View>

            {/* Stepper & Actions */}
            <View style={styles.actionsRight}>
                <View style={styles.stepperRow}>
                    <TouchableOpacity
                        onPress={() => handleDecrease(item.id)}
                        style={styles.stepBtn}
                        disabled={item.quantity <= 1}
                    >
                        <Icon name="minus" size={12} color={item.quantity <= 1 ? DARK.chipBorder : DARK.textPrimary} />
                    </TouchableOpacity>

                    <Text style={styles.stepQty}>{item.quantity}</Text>

                    <TouchableOpacity onPress={() => handleIncrease(item.id)} style={[styles.stepBtn, { backgroundColor: DARK.primary }]}>
                        <Icon name="plus" size={12} color="#fff" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => handleDelete(item.id)} activeOpacity={0.7} style={styles.deleteBtn}>
                    <Icon name="trash-can-outline" size={18} color={DARK.red} />
                </TouchableOpacity>
            </View>
        </View>
    ), [handleToggleComplete, handleDecrease, handleIncrease, handleDelete]);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.75}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.iconBtn}
                    >
                        <Icon name="arrow-left" size={24} color={DARK.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle} numberOfLines={1}>Final List</Text>

                    </View>

                    <TouchableOpacity onPress={handleShareList} activeOpacity={0.75} style={styles.iconBtn}>
                        <Icon name="share-variant" size={22} color={DARK.primary} />
                    </TouchableOpacity>
                </View>

                {/* Progress Bar Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressTopRow}>
                        <View style={styles.progressTextWrap}>
                            <Icon name="shopping-outline" size={20} color={DARK.primary} />
                            <Text style={styles.progressTitle}>Shopping Progress</Text>
                        </View>
                        <Text style={styles.progressBadge}>{progressPercent}% Done</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchWrap}>
                    <Icon name="magnify" size={20} color={DARK.textMuted} style={{ marginRight: 8 }} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search items in list / सूची खोजें..."
                        placeholderTextColor={DARK.textMuted}
                        style={styles.searchInput}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.75}>
                            <Icon name="close-circle" size={18} color={DARK.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Chips */}
                <View style={styles.filterRow}>
                    <View style={styles.chipGroup}>
                        {(['all', 'pending', 'completed'] as const).map(mode => {
                            const active = filterMode === mode;
                            const label = mode === 'all' ? `All (${totalCount})` : mode === 'pending' ? `Pending (${totalCount - completedCount})` : `Bought (${completedCount})`;
                            return (
                                <TouchableOpacity
                                    key={mode}
                                    onPress={() => setFilterMode(mode)}
                                    style={[styles.filterChip, active && styles.filterChipActive]}
                                >
                                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {completedCount > 0 && (
                        <TouchableOpacity onPress={handleClearCompleted} activeOpacity={0.75} style={styles.clearBtn}>
                            <Text style={styles.clearBtnText}>Clear Done</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* List Content */}
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Icon name="clipboard-check-outline" size={56} color={DARK.textMuted} />
                            <Text style={styles.emptyTitle}>Koi item nahi mila</Text>
                            <Text style={styles.emptySub}>Aapki list me koi pending items nahi hain.</Text>
                        </View>
                    }
                />

                {/* Bottom CTA Bar */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={handleShareList} activeOpacity={0.85} style={styles.shareCtaBtn}>
                        <Icon name="whatsapp" size={22} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.shareCtaText}>Share List on WhatsApp</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default List;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: DARK.bg },
    safeArea: { flex: 1, backgroundColor: DARK.bg },

    header: {
        height: HEADER_H,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: H_PADDING,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: DARK.border,
    },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: DARK.textPrimary, letterSpacing: 0.2 },
    headerSub: { fontSize: 11, color: DARK.textMuted, marginTop: 1 },

    // Progress Card
    progressCard: {
        marginHorizontal: H_PADDING,
        marginTop: 14,
        backgroundColor: DARK.surface,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: DARK.border,
    },
    progressTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    progressTextWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    progressTitle: { fontSize: 14, fontWeight: '700', color: DARK.textPrimary },
    progressBadge: { fontSize: 12, fontWeight: '700', color: DARK.primary },
    progressBarTrack: { height: 7, backgroundColor: DARK.surfaceHigh, borderRadius: 999, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: DARK.primary, borderRadius: 999 },

    // Search
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: H_PADDING,
        marginTop: 12,
        backgroundColor: DARK.searchBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: DARK.border,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: { flex: 1, fontSize: 14, color: DARK.textPrimary, paddingVertical: 0 },

    // Filters
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: H_PADDING,
        marginTop: 12,
        marginBottom: 8,
    },
    chipGroup: { flexDirection: 'row', gap: 6 },
    filterChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: DARK.chipBorder,
        backgroundColor: DARK.surface,
    },
    filterChipActive: { backgroundColor: DARK.primaryMuted, borderColor: DARK.primary },
    chipText: { fontSize: 11, fontWeight: '600', color: DARK.textMuted },
    chipTextActive: { color: DARK.primary },
    clearBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    clearBtnText: { fontSize: 11, fontWeight: '700', color: DARK.red },

    // Items List
    listContainer: { paddingHorizontal: H_PADDING, paddingBottom: 90, gap: 10, paddingTop: 4 },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DARK.surface,
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: DARK.border,
    },
    itemCardCompleted: { opacity: 0.65, backgroundColor: DARK.surfaceHigh },
    checkboxTouch: { padding: 4, marginRight: 6 },
    itemImage: { width: 46, height: 46, borderRadius: 10, backgroundColor: DARK.bg },
    itemDetails: { flex: 1, marginLeft: 10, justifyContent: 'center' },
    itemName: { fontSize: 14, fontWeight: '700', color: DARK.textPrimary },
    itemNameCompleted: { textDecorationLine: 'line-through', color: DARK.textMuted },
    itemSub: { fontSize: 11, color: DARK.textMuted, marginTop: 2 },
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

    // Stepper & Delete
    actionsRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: DARK.surfaceHigh, borderRadius: 8, padding: 3 },
    stepBtn: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    stepQty: { fontSize: 13, fontWeight: '700', color: DARK.textPrimary, minWidth: 16, textAlign: 'center' },
    deleteBtn: { padding: 4 },

    // Empty state
    emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, gap: 10 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: DARK.textPrimary },
    emptySub: { fontSize: 12, color: DARK.textMuted },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: DARK.surface,
        paddingHorizontal: H_PADDING,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: DARK.border,
    },
    shareCtaBtn: {
        height: 50,
        backgroundColor: DARK.green,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: DARK.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    shareCtaText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
});
