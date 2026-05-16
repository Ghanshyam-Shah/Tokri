// src/features/catalog/screens/CatalogScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import ProductCard from '../components/ProductCard';
import { Product } from '../types/types';

interface Category {
  id: string;
  label: string;
  labelHindi: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    price: 40,
    unit: '1kg',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },

  {
    id: '2',
    name: 'Organic Milk',
    nameHindi: 'जैविक दूध',
    price: 68,
    unit: '1L',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },

  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    price: 450,
    unit: '5kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },

  {
    id: '4',
    name: 'Toor Dal',
    nameHindi: 'अरहर दाल',
    price: 120,
    unit: '1kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1599909631565-9921aaabb4a7?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },

  {
    id: '5',
    name: 'Yellow Bell Pepper',
    nameHindi: 'पीली शिमला मिर्च',
    price: 45,
    unit: '250g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },

  {
    id: '6',
    name: 'Penne Pasta',
    nameHindi: 'पास्ता',
    price: 95,
    unit: '500g',
    categoryId: 'snacks',
    imageUrl:
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },

  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    price: 85,
    unit: '200g',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },

  {
    id: '8',
    name: 'Carrots',
    nameHindi: 'गाजर',
    price: 35,
    unit: '500g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
];

const DARK = {
  bg: '#1c110b',
  border: '#3a2418',
  primary: '#f97316',
  textPrimary: '#f6ded3',
  textMuted: '#a78b7d',
  chipBorder: '#584237',
  searchBg: '#1e1208',
};

const HEADER_H = Platform.OS === 'ios' ? 52 : 58;
const H_PADDING = 16;

const CatalogScreen = () => {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listIds, setListIds] = useState<string[]>([]);

  const filtered = PRODUCTS.filter(p => {
    const catMatch =
      selectedCategory === 'all' || p.categoryId === selectedCategory;

    const q = searchQuery.toLowerCase();

    const searchMatch =
      p.name.toLowerCase().includes(q) || p.nameHindi.includes(q);

    return catMatch && searchMatch;
  });

  const toggleCart = useCallback((id: string) => {
    setListIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.headerIconBtn}
          >
            <Icon name="menu" size={28} color={DARK.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>KiranaList</Text>

          <TouchableOpacity style={styles.headerIconBtn}>
            <Icon name="bell-outline" size={22} color={DARK.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchOuter}>
          <View style={styles.searchBar}>
            <Icon
              name="magnify"
              size={20}
              color={DARK.textMuted}
              style={{ marginRight: 8 }}
            />

            <TextInput
              placeholder="Search catalog / सूची खोजें..."
              placeholderTextColor={DARK.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat.id;

            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.chip,
                  active ? styles.chipActive : styles.chipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? '#fff' : DARK.textMuted,
                    },
                  ]}
                >
                  {cat.label} / {cat.labelHindi}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Grid */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            // <ProductCard
            //   product={item}
            //   onAddPress={product => toggleCart(product.id)}
            // />
            <ProductCard
              product={item}
              inList={listIds.includes(item.id)}
              onAddPress={toggleCart}
            />
          )}
        />

        {/* FAB */}
        {listIds.length > 0 && (
          <TouchableOpacity style={styles.fab}>
            <Icon name="cart-outline" size={26} color="#fff" />

            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{listIds.length}</Text>
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK.bg,
  },

  safeArea: {
    flex: 1,
    backgroundColor: DARK.bg,
  },

  header: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
  },

  headerIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK.textPrimary,
  },

  searchOuter: {
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: 14,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK.searchBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: DARK.border,
  },

  searchInput: {
    flex: 1,
    color: DARK.textPrimary,
    fontSize: 14,
  },

  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: H_PADDING,
    paddingBottom: 14,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },

  chipActive: {
    backgroundColor: DARK.primary,
    borderColor: DARK.primary,
  },

  chipInactive: {
    borderColor: DARK.chipBorder,
  },

  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },

  gridContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 100,
    gap: 12,
  },

  row: {
    gap: 12,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: DARK.primary,
  },
});

export default CatalogScreen;

// // src/features/catalog/screens/CatalogScreen.tsx
// //
// // Screenshot se pixel-perfect match:
// // Dark mode background #1c110b
// // Header: hamburger (saffron lines) + "KiranaList" bold + bell icon
// // Search bar: rounded, dark surface
// // Category chips: "All/सभी" saffron filled, rest outlined dark
// // Product grid: 2 col, full image top, card dark surface, TOP PICK badge
// // Card body: English name bold white, Hindi + unit muted, price bold, + button saffron
// // Bottom tab: Home | List | Catalog (saffron active) | History
// // FAB cart: saffron, bottom-right, badge

// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ScrollView,
//   Image,
//   StatusBar,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import { useTheme } from '../../../shared/hooks/useTheme';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const CARD_GAP = 12;
// const H_PADDING = 16;
// const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2;
// const IMAGE_HEIGHT = CARD_WIDTH * 0.85; // aspect ratio from screenshot

// // ─── TYPES ────────────────────────────────────────────────────────────────────

// interface Product {
//   id: string;
//   name: string;
//   nameHindi: string;
//   price: number;
//   unit: string;
//   category: string;
//   image: string;
//   isTopPick?: boolean;
// }

// interface Category {
//   id: string;
//   label: string;
//   labelHindi: string;
// }

// // ─── DATA ─────────────────────────────────────────────────────────────────────

// const CATEGORIES: Category[] = [
//   { id: 'all', label: 'All', labelHindi: 'सभी' },
//   { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
//   { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
//   { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
//   { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
//   { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
// ];

// const PRODUCTS: Product[] = [
//   {
//     id: '1',
//     name: 'Fresh Tomatoes',
//     nameHindi: 'ताजा टमाटर',
//     price: 40,
//     unit: '1kg',
//     category: 'vegetables',
//     image:
//       'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
//     isTopPick: true,
//   },
//   {
//     id: '2',
//     name: 'Organic Milk',
//     nameHindi: 'जैविक दूध',
//     price: 68,
//     unit: '1L',
//     category: 'dairy',
//     image:
//       'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
//   },
//   {
//     id: '3',
//     name: 'Basmati Rice',
//     nameHindi: 'बासमती चावल',
//     price: 450,
//     unit: '5kg',
//     category: 'grains',
//     image:
//       'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
//   },
//   {
//     id: '4',
//     name: 'Toor Dal',
//     nameHindi: 'अरहर दाल',
//     price: 120,
//     unit: '1kg',
//     category: 'grains',
//     image:
//       'https://images.unsplash.com/photo-1599909631565-9921aaabb4a7?w=400&q=80',
//   },
//   {
//     id: '5',
//     name: 'Yellow Bell Pepper',
//     nameHindi: 'पीली शिमला मिर्च',
//     price: 45,
//     unit: '250g',
//     category: 'vegetables',
//     image:
//       'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
//   },
//   {
//     id: '6',
//     name: 'Penne Pasta',
//     nameHindi: 'पास्ता',
//     price: 95,
//     unit: '500g',
//     category: 'snacks',
//     image:
//       'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
//   },
//   {
//     id: '7',
//     name: 'Fresh Paneer',
//     nameHindi: 'ताजा पनीर',
//     price: 85,
//     unit: '200g',
//     category: 'dairy',
//     image:
//       'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
//   },
//   {
//     id: '8',
//     name: 'Carrots',
//     nameHindi: 'गाजर',
//     price: 35,
//     unit: '500g',
//     category: 'vegetables',
//     image:
//       'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
//   },
// ];

// // Screenshot dark colors — exact match
// const DARK = {
//   bg: '#1c110b', // main background
//   surface: '#251913', // card background
//   surfaceHigh: '#2d1e16', // slightly lighter cards
//   border: '#3a2418', // card border
//   primary: '#f97316', // saffron — buttons, active chip, price
//   textPrimary: '#f6ded3', // white-ish main text
//   textMuted: '#a78b7d', // hindi/unit muted text
//   chipBorder: '#584237', // inactive chip border
//   searchBg: '#1e1208', // search bar bg (darker than bg)
//   tabBg: '#1c110b', // bottom tab background
//   tabActive: '#f97316', // saffron
//   tabInactive: '#7a6050', // muted brown
// };

// // ─── SCREEN ───────────────────────────────────────────────────────────────────

// const CatalogScreen = () => {
//   const navigation = useNavigation();
//   const { theme } = useTheme();

//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [cartIds, setCartIds] = useState<string[]>([]);

//   const filtered = PRODUCTS.filter(p => {
//     const catMatch =
//       selectedCategory === 'all' || p.category === selectedCategory;
//     const q = searchQuery.toLowerCase();
//     const searchMatch =
//       p.name.toLowerCase().includes(q) || p.nameHindi.includes(q);
//     return catMatch && searchMatch;
//   });

//   const toggleCart = useCallback((id: string) => {
//     setCartIds(prev =>
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
//     );
//   }, []);

//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />
//       <SafeAreaView style={styles.safeArea} edges={['top']}>
//         {/* ══════════════════════════════════════════════
//             HEADER
//         ══════════════════════════════════════════════ */}
//         <View style={styles.header}>
//           {/* Hamburger */}
//           {/* Hamburger */}
//           <TouchableOpacity
//             onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//             style={styles.headerIconBtn}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             activeOpacity={0.7}
//           >
//             <Icon name="menu" size={28} color={DARK.textPrimary} />
//           </TouchableOpacity>

//           {/* Title */}
//           <Text style={styles.headerTitle}>KiranaList</Text>

//           {/* Bell */}
//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             activeOpacity={0.7}
//           >
//             <Icon name="bell-outline" size={22} color={DARK.textPrimary} />
//           </TouchableOpacity>
//         </View>

//         {/* ══════════════════════════════════════════════
//             SEARCH BAR
//         ══════════════════════════════════════════════ */}
//         <View style={styles.searchOuter}>
//           <View style={styles.searchBar}>
//             <Icon
//               name="magnify"
//               size={20}
//               color={DARK.textMuted}
//               style={{ marginRight: 8 }}
//             />
//             <TextInput
//               placeholder="Search catalog / सूची खोजें..."
//               placeholderTextColor={DARK.textMuted}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={styles.searchInput}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => setSearchQuery('')}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//               >
//                 <Icon name="close-circle" size={18} color={DARK.textMuted} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* ══════════════════════════════════════════════
//             CATEGORY CHIPS
//         ══════════════════════════════════════════════ */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.chipsRow}
//           style={styles.chipsScroll}
//         >
//           {CATEGORIES.map(cat => {
//             const active = selectedCategory === cat.id;
//             return (
//               <TouchableOpacity
//                 key={cat.id}
//                 onPress={() => setSelectedCategory(cat.id)}
//                 activeOpacity={0.8}
//                 style={[
//                   styles.chip,
//                   active ? styles.chipActive : styles.chipInactive,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.chipText,
//                     { color: active ? '#fff' : DARK.textMuted },
//                   ]}
//                 >
//                   {cat.label} / {cat.labelHindi}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>

//         {/* ══════════════════════════════════════════════
//             PRODUCT GRID
//         ══════════════════════════════════════════════ */}
//         <FlatList
//           data={filtered}
//           keyExtractor={item => item.id}
//           numColumns={2}
//           showsVerticalScrollIndicator={false}
//           columnWrapperStyle={styles.row}
//           contentContainerStyle={styles.gridContent}
//           renderItem={({ item }) => (
//             <ProductCard
//               item={item}
//               inCart={cartIds.includes(item.id)}
//               onAdd={toggleCart}
//             />
//           )}
//         />

//         {/* ══════════════════════════════════════════════
//             CART FAB — bottom right, saffron, badge
//         ══════════════════════════════════════════════ */}
//         {cartIds.length > 0 && (
//           <TouchableOpacity activeOpacity={0.9} style={styles.fab}>
//             <Icon name="cart-outline" size={26} color="#fff" />
//             <View style={styles.fabBadge}>
//               <Text style={styles.fabBadgeText}>
//                 {cartIds.length > 9 ? '9+' : cartIds.length}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       </SafeAreaView>
//     </View>
//   );
// };

// // ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

// interface CardProps {
//   item: Product;
//   inCart: boolean;
//   onAdd: (id: string) => void;
// }

// const ProductCard: React.FC<CardProps> = ({ item, inCart, onAdd }) => (
//   <View style={styles.card}>
//     {/* Image */}
//     <View style={styles.imageWrap}>
//       <Image
//         source={{ uri: item.image }}
//         style={styles.image}
//         resizeMode="cover"
//       />

//       {/* TOP PICK badge — screenshot: top-right corner, saffron bg */}
//       {item.isTopPick && (
//         <View style={styles.topPickBadge}>
//           <Text style={styles.topPickText}>TOP PICK</Text>
//         </View>
//       )}
//     </View>

//     {/* Card Body */}
//     <View style={styles.cardBody}>
//       {/* English name */}
//       <Text style={styles.productName} numberOfLines={1}>
//         {item.name}
//       </Text>

//       {/* Hindi name • unit */}
//       <Text style={styles.productHindi} numberOfLines={1}>
//         {item.nameHindi} • {item.unit}
//       </Text>

//       {/* Price + Add button row */}
//       <View style={styles.priceRow}>
//         <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>

//         <TouchableOpacity
//           onPress={() => onAdd(item.id)}
//           activeOpacity={0.85}
//           style={[styles.addBtn, inCart && styles.addBtnActive]}
//         >
//           <Icon name={inCart ? 'check' : 'plus'} size={18} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// );

// // ─── HAMBURGER ICON ───────────────────────────────────────────────────────────
// // Screenshot: saffron top line, then two regular lines — warm branded look

// // ─── STYLES ───────────────────────────────────────────────────────────────────

// const HEADER_H = Platform.OS === 'ios' ? 52 : 58;

// const styles = StyleSheet.create({
//   // Root
//   root: { flex: 1, backgroundColor: DARK.bg },
//   safeArea: { flex: 1, backgroundColor: DARK.bg },

//   // ── Header ──────────────────────────────────────────────────────────────────
//   header: {
//     height: HEADER_H,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: H_PADDING,
//     backgroundColor: DARK.bg,
//   },
//   headerIconBtn: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: DARK.textPrimary,
//     letterSpacing: 0.3,
//     // fontFamily: 'Montserrat-Bold',  // uncomment when font is linked
//   },

//   // ── Search ──────────────────────────────────────────────────────────────────
//   searchOuter: {
//     paddingHorizontal: H_PADDING,
//     paddingTop: 12,
//     paddingBottom: 14,
//     backgroundColor: DARK.bg,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: DARK.searchBg,
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     height: 48,
//     borderWidth: 1,
//     borderColor: DARK.border,
//   },
//   searchInput: {
//     flex: 1,
//     color: DARK.textPrimary,
//     fontSize: 14,
//     // fontFamily: 'NotoSans-Regular',
//   },

//   // ── Chips ───────────────────────────────────────────────────────────────────
//   chipsScroll: {
//     flexGrow: 0,
//     backgroundColor: DARK.bg,
//   },
//   chipsRow: {
//     flexDirection: 'row',
//     gap: 8,
//     paddingHorizontal: H_PADDING,
//     paddingBottom: 14,
//     alignItems: 'center',
//   },
//   chip: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1.5,
//   },
//   chipActive: {
//     backgroundColor: DARK.primary,
//     borderColor: DARK.primary,
//   },
//   chipInactive: {
//     backgroundColor: 'transparent',
//     borderColor: DARK.chipBorder,
//   },
//   chipText: {
//     fontSize: 13,
//     fontWeight: '500',
//     // fontFamily: 'NotoSans-Medium',
//   },

//   // ── Grid ────────────────────────────────────────────────────────────────────
//   gridContent: {
//     paddingHorizontal: H_PADDING,
//     paddingBottom: 100, // space for FAB + tab bar
//     gap: CARD_GAP,
//   },
//   row: {
//     gap: CARD_GAP,
//   },

//   // ── Card ────────────────────────────────────────────────────────────────────
//   card: {
//     width: CARD_WIDTH,
//     backgroundColor: DARK.surface,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: DARK.border,
//     // Subtle shadow
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.35,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   imageWrap: {
//     width: '100%',
//     height: IMAGE_HEIGHT,
//     backgroundColor: DARK.surfaceHigh,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },

//   // TOP PICK badge — top-right corner on image
//   topPickBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: DARK.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     borderBottomLeftRadius: 10,
//   },
//   topPickText: {
//     fontSize: 9,
//     fontWeight: '800',
//     color: '#fff',
//     letterSpacing: 0.8,
//     // fontFamily: 'Montserrat-Bold',
//   },

//   // Card body
//   cardBody: {
//     paddingHorizontal: 10,
//     paddingTop: 10,
//     paddingBottom: 12,
//     gap: 3,
//   },
//   productName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: DARK.textPrimary,
//     letterSpacing: 0.1,
//     // fontFamily: 'Montserrat-Bold',
//   },
//   productHindi: {
//     fontSize: 12,
//     color: DARK.textMuted,
//     marginBottom: 6,
//     // fontFamily: 'NotoSansDevanagari-Regular',
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 2,
//   },
//   price: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: DARK.textPrimary,
//     letterSpacing: 0.2,
//     // fontFamily: 'Montserrat-Bold',
//   },
//   addBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: DARK.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addBtnActive: {
//     backgroundColor: '#16a34a', // green when in cart
//   },

//   // ── FAB ─────────────────────────────────────────────────────────────────────
//   fab: {
//     position: 'absolute',
//     bottom: 24,
//     right: 20,
//     width: 58,
//     height: 58,
//     borderRadius: 999,
//     backgroundColor: DARK.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: DARK.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 12,
//     elevation: 12,
//   },
//   fabBadge: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: DARK.primary,
//   },
//   fabBadgeText: {
//     fontSize: 10,
//     fontWeight: '900',
//     color: DARK.primary,
//     lineHeight: 12,
//   },
// });

// export default CatalogScreen;
