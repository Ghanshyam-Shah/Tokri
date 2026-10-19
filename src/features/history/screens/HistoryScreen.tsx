// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SectionList,
//   TouchableOpacity,
//   StatusBar,
//   TextInput,
// } from 'react-native';
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import AppHeader from '../../../shared/components/headers/AppHeader';

// // ─── Theme ────────────────────────────────────────────────────────────────
// const DARK = {
//   bg: '#F8FAFC',
//   surface: '#FFFFFF',
//   surfaceHigh: '#F0F6FA',
//   border: '#E2E8F0',
//   primary: '#0EA5E9',
//   primaryMuted: '#E0F2FE',
//   textPrimary: '#0F172A',
//   textMuted: '#64748B',
//   searchBg: '#F1F5F9',
//   green: '#10B981',
// };

// // ─── Mock Data for Timeline ────────────────────────────────────────────────
// interface HistoryItem {
//   id: string;
//   name: string;
//   date: string;
//   itemCount: number;
//   preview: string;
// }

// interface HistorySection {
//   title: string;
//   data: HistoryItem[];
// }

// const MOCK_HISTORY: HistorySection[] = [
//   {
//     title: 'August 2025',
//     data: [
//       {
//         id: 'h1',
//         name: 'Weekly Restock',
//         date: '14 Aug 2025',
//         itemCount: 18,
//         preview: 'Milk, Bread, Eggs, Butter, Cheese...',
//       },
//       {
//         id: 'h2',
//         name: 'Party Supplies',
//         date: '02 Aug 2025',
//         itemCount: 32,
//         preview: 'Cold Drinks, Chips, Namkeen, Disposables...',
//       },
//     ],
//   },
//   {
//     title: 'July 2025',
//     data: [
//       {
//         id: 'h3',
//         name: 'Monthly Groceries',
//         date: '28 Jul 2025',
//         itemCount: 45,
//         preview: 'Rice, Dal, Atta, Oil, Sugar, Tea...',
//       },
//       {
//         id: 'h4',
//         name: 'Quick Veggies',
//         date: '15 Jul 2025',
//         itemCount: 6,
//         preview: 'Tomato, Onion, Potato, Chilli...',
//       },
//     ],
//   },
//   {
//     title: 'June 2025',
//     data: [
//       {
//         id: 'h5',
//         name: 'Monthly Groceries',
//         date: '29 Jun 2025',
//         itemCount: 42,
//         preview: 'Rice, Dal, Atta, Oil, Sugar, Spices...',
//       },
//     ],
//   },
// ];

// // ─── Main Component ───────────────────────────────────────────────────────
// const HistoryScreen = () => {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');

//   // Filter sections based on search query
//   const filteredHistory = MOCK_HISTORY.map(section => ({
//     ...section,
//     data: section.data.filter(
//       item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.preview.toLowerCase().includes(searchQuery.toLowerCase()),
//     ),
//   })).filter(section => section.data.length > 0);

//   const handleReuse = (item: HistoryItem) => {
//     // Navigate to create list or populate a new list
//     console.log('Reusing list:', item.name);
//   };

//   const renderHistoryCard = ({ item }: { item: HistoryItem }) => {
//     return (
//       <TouchableOpacity activeOpacity={0.85} style={styles.card}>
//         <View style={styles.cardIconWrap}>
//           <Icon name="history" size={24} color={DARK.primary} />
//         </View>

//         <View style={styles.cardContent}>
//           <Text style={styles.cardTitle} numberOfLines={1}>
//             {item.name}
//           </Text>
//           <View style={styles.cardMetaRow}>
//             <Icon name="check-circle-outline" size={14} color={DARK.green} />
//             <Text style={styles.cardMetaText}>{item.date}</Text>
//             <View style={styles.dot} />
//             <Text style={styles.cardMetaText}>{item.itemCount} Items</Text>
//           </View>
//           <Text style={styles.cardPreview} numberOfLines={1}>
//             {item.preview}
//           </Text>
//         </View>

//         {/* Re-use Action */}
//         <TouchableOpacity
//           style={styles.reuseBtn}
//           activeOpacity={0.7}
//           onPress={() => handleReuse(item)}
//         >
//           <Icon name="refresh" size={20} color={DARK.primary} />
//           <Text style={styles.reuseText}>Reuse</Text>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   const renderSectionHeader = ({
//     section: { title },
//   }: {
//     section: HistorySection;
//   }) => (
//     <View style={styles.sectionHeader}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//     </View>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <View style={styles.emptyIconWrap}>
//         <Icon
//           name="clipboard-text-off-outline"
//           size={56}
//           color={DARK.primary}
//         />
//       </View>
//       <Text style={styles.emptyTitle}>
//         {searchQuery ? 'No Results Found' : 'No History Yet'}
//       </Text>
//       <Text style={styles.emptySub}>
//         {searchQuery
//           ? `We couldn't find any lists matching "${searchQuery}".`
//           : 'Your completed lists will appear here. Re-use them anytime!'}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.root} edges={['top']}>


//       {/* ═════════════════════════════════ App Header ═════════════════════════════════ */}
//       <AppHeader
//         title="History"
//         leftIcon="menu"
//       />

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBox}>
//           <Icon name="magnify" size={22} color={DARK.textMuted} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search old lists..."
//             placeholderTextColor={DARK.textMuted}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={10}>
//               <Icon name="close-circle" size={18} color={DARK.textMuted} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Timeline List */}
//       <SectionList
//         sections={filteredHistory}
//         keyExtractor={item => item.id}
//         renderItem={renderHistoryCard}
//         renderSectionHeader={renderSectionHeader}
//         contentContainerStyle={styles.listContent}
//         stickySectionHeadersEnabled={true}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={renderEmptyState}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: DARK.bg,
//   },
//   searchContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: DARK.bg,
//     borderBottomWidth: 1,
//     borderBottomColor: DARK.border,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: DARK.searchBg,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 44,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 15,
//     color: DARK.textPrimary,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 100,
//   },
//   sectionHeader: {
//     backgroundColor: DARK.bg, // Important for sticky header
//     paddingVertical: 12,
//     marginTop: 8,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: DARK.textPrimary,
//     letterSpacing: 0.5,
//     textTransform: 'uppercase',
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: DARK.surface,
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: DARK.border,
//     shadowColor: DARK.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: DARK.primaryMuted,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: DARK.textPrimary,
//     marginBottom: 4,
//   },
//   cardMetaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   cardMetaText: {
//     fontSize: 12,
//     color: DARK.textMuted,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   dot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: DARK.border,
//     marginHorizontal: 8,
//   },
//   cardPreview: {
//     fontSize: 12,
//     color: DARK.textMuted,
//   },
//   reuseBtn: {
//     marginLeft: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     backgroundColor: DARK.primaryMuted,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: DARK.primary + '30', // adding slight transparency
//   },
//   reuseText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: DARK.primary,
//     marginTop: 2,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 100,
//     paddingHorizontal: 32,
//   },
//   emptyIconWrap: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: DARK.primaryMuted,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: DARK.textPrimary,
//     marginBottom: 8,
//   },
//   emptySub: {
//     fontSize: 14,
//     color: DARK.textMuted,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
// });

// export default HistoryScreen;


import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  itemCount: number;
  preview: string;
}

interface HistorySection {
  title: string;
  data: HistoryItem[];
}

const MOCK_HISTORY: HistorySection[] = [
  {
    title: 'August 2025',
    data: [
      {
        id: 'h891',
        name: 'Weekly Restock',
        date: '14 Aug 2025',
        itemCount: 18,
        preview: 'Milk, Bread, Eggs, Butter, Cheese...',
      },
      {
        id: 'h762',
        name: 'Party Supplies',
        date: '02 Aug 2025',
        itemCount: 32,
        preview: 'Cold Drinks, Chips, Namkeen, Disposables...',
      },
    ],
  },
  
  {
    title: 'July 2025',
    data: [
      {
        id: 'h873',
        name: 'Monthly Groceries',
        date: '28 Jul 2025',
        itemCount: 45,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Tea...',
      },
      {
        id: 'h04',
        name: 'Quick Veggies',
        date: '15 Jul 2025',
        itemCount: 6,
        preview: 'Tomato, Onion, Potato, Chilli...',
      },
    ],
  },
  {
    title: 'June 2025',
    data: [
      {
        id: 'h55',
        name: 'Monthly Groceries',
        date: '29 Jun 2025',
        itemCount: 42,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Spices...',
      },
    ],
  },
  {
    title: 'August 2025',
    data: [
      {
        id: 'h18',
        name: 'Weekly Restock',
        date: '14 Aug 2025',
        itemCount: 18,
        preview: 'Milk, Bread, Eggs, Butter, Cheese...',
      },
      {
        id: 'h12',
        name: 'Party Supplies',
        date: '02 Aug 2025',
        itemCount: 32,
        preview: 'Cold Drinks, Chips, Namkeen, Disposables...',
      },
    ],
  },
  
  {
    title: 'July 2025',
    data: [
      {
        id: 'h33',
        name: 'Monthly Groceries',
        date: '28 Jul 2025',
        itemCount: 45,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Tea...',
      },
      {
        id: 'h43',
        name: 'Quick Veggies',
        date: '15 Jul 2025',
        itemCount: 6,
        preview: 'Tomato, Onion, Potato, Chilli...',
      },
    ],
  },
  {
    title: 'June 2025',
    data: [
      {
        id: 'h9',
        name: 'Monthly Groceries',
        date: '29 Jun 2025',
        itemCount: 42,
        preview: 'Rice, Dal, Atta, Oil, Sugar, Spices...',
      },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────
const HistoryScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filteredHistory = MOCK_HISTORY.map(section => ({
    ...section,
    data: section.data.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter(section => section.data.length > 0);

  const handleReuse = (item: HistoryItem) => {
    // TODO: create list screen pe navigate karo / nayi list populate karo
    console.log('Reusing list:', item.name);
  };

  const renderHistoryCard = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <View style={styles.cardIconWrap}>
        <Icon name="history" size={24} color={colors.primary} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardMetaRow}>
          <Icon name="check-circle-outline" size={14} color={colors.success} />
          <Text style={styles.cardMetaText}>{item.date}</Text>
          <View style={styles.dot} />
          <Text style={styles.cardMetaText}>{item.itemCount} Items</Text>
        </View>
        <Text style={styles.cardPreview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>

      {/* Re-use Action */}
      <TouchableOpacity
        style={styles.reuseBtn}
        activeOpacity={0.7}
        onPress={() => handleReuse(item)}
      >
        <Icon name="refresh" size={20} color={colors.primary} />
        <Text style={styles.reuseText}>Reuse</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: HistorySection;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Icon
          name="clipboard-text-off-outline"
          size={56}
          color={colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No Results Found' : 'No History Yet'}
      </Text>
      <Text style={styles.emptySub}>
        {searchQuery
          ? `We couldn't find any lists matching "${searchQuery}".`
          : 'Your completed lists will appear here. Re-use them anytime!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ═════════════════ App Header ═════════════════ */}
      <AppHeader title="History" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={22} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search old lists..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={10}>
              <Icon name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Timeline List */}
      <SectionList
        sections={filteredHistory}
        keyExtractor={item => item.id}
        renderItem={renderHistoryCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

// ─── Styles (theme se bante hain, theme badalne par apne aap update) ───────
type Theme = ReturnType<typeof useTheme>['theme'];

// primary ka halka (transparent) version. Sirf tab chalta hai jab primary
// 6-digit hex ho (jaise '#87CEEB'), 'skyblue' jaisa naam nahi.
const tint = (hex: string, alpha: string) => hex + alpha;

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.appBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      height: 44,
    },
    searchInput: {
      flex: 1,
      marginLeft: spacing.sm,
      fontSize: typography.md,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      paddingVertical: 0,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: 100,
    },
    sectionHeader: {
      backgroundColor: colors.appBackground, // sticky header ke liye zaroori
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: 14,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    cardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: tint(colors.primary, '1F'),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    cardMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    cardMetaText: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textMuted,
      marginLeft: spacing.xs,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginHorizontal: spacing.sm,
    },
    cardPreview: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    reuseBtn: {
      marginLeft: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: tint(colors.primary, '1F'),
      borderRadius: borderRadius.sm + 2,
      borderWidth: 1,
      borderColor: tint(colors.primary, '30'),
    },
    reuseText: {
      fontSize: 11,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
      marginTop: 2,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
      paddingHorizontal: spacing.xxxl,
    },
    emptyIconWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: tint(colors.primary, '1F'),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    emptyTitle: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    emptySub: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
};

export default HistoryScreen;