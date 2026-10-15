
// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import Header from '../components/Header';

// const COLORS = {
//   background: '#fcf9f4',
//   surface: '#ffffff',
//   primary: '#f97316',
//   primaryContainer: '#f97316',

//   primaryDark: '#9d4300',
//   textPrimary: '#1c1c19',
//   textSecondary: '#584237',
//   border: '#e5e2dd',
//   success: '#006d30',
//   successLight: '#95f8a7',
// };

// const RECENT_LISTS = [
//   {
//     id: '1',
//     title: 'April List',
//     items: '42 Items',
//   },
//   {
//     id: '2',
//     title: 'March List',
//     items: '28 Items',
//   },
//   {
//     id: '3',
//     title: 'February List',
//     items: '31 Items',
//   },
// ];

// const QUICK_SHOP = [
//   {
//     id: '1',
//     title: 'Spices / मसाले',
//     image:
//       'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80',
//   },
//   {
//     id: '2',
//     title: 'Fresh / ताज़ा',
//     image:
//       'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
//   },
// ];

// const HomeScreen = () => {
//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <Header />

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.content}
//         >
//           {/* Greeting */}
//           <View style={styles.greetingSection}>
//             <Text style={styles.greeting}>Namaste 👋</Text>

//             <Text style={styles.subGreeting}>
//               Aaj ki Kirana List / आज की किराना लिस्ट
//             </Text>
//           </View>

//           {/* Hero Card */}
//           <View style={styles.heroCard}>
//             <View style={styles.cardDecorativeCircle} />
//             <View style={styles.heroTop}>
//               <View>
//                 <View style={styles.activeBadge}>
//                   <Text style={styles.activeBadgeText}>
//                     Active List / सक्रिय सूची
//                   </Text>
//                 </View>

//                 <Text style={styles.heroTitle}>May 2025 ki List</Text>

//                 <Text style={styles.heroSubtitle}>
//                   Created 2 May • मई की किराना सूची
//                 </Text>
//               </View>
//               <Icon
//                 name="shopping-outline"
//                 color={COLORS.primaryContainer}
//                 size={28}
//               />

//               {/* <Icon name="basket" size={34} color={COLORS.primary} /> */}
//             </View>

//             <View style={styles.statsRow}>
//               <View style={styles.statCard}>
//                 <Text style={styles.statNumber}>34</Text>

//                 <Text style={styles.statLabel}>Items / सामान</Text>
//               </View>

//               <View style={styles.statCard}>
//                 <Text style={[styles.statNumber, { color: COLORS.success }]}>
//                   12
//                 </Text>

//                 <Text style={styles.statLabel}>Checked / पूरा</Text>
//               </View>
//             </View>

//             <TouchableOpacity style={styles.openButton} activeOpacity={0.85}>
//               <Icon name="open-in-new" size={20} color="#582200" />

//               <Text style={styles.openButtonText}>Open List / लिस्ट खोलें</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Quick Stats */}
//           <View style={styles.quickStats}>
//             <View style={styles.quickCard}>
//               <View style={styles.quickIconWrap}>
//                 <Icon name="basket-outline" size={24} color={COLORS.success} />
//               </View>

//               <View>
//                 <Text style={styles.quickLabel}>Pantry Stock</Text>

//                 <Text style={styles.quickValue}>85% Full</Text>
//               </View>
//             </View>

//             <View style={styles.quickCard}>
//               <View
//                 style={[styles.quickIconWrap, { backgroundColor: '#fff3e8' }]}
//               >
//                 <Icon name="wallet-outline" size={24} color={COLORS.primary} />
//               </View>

//               <View>
//                 <Text style={styles.quickLabel}>Monthly Budget</Text>

//                 <Text style={styles.quickValue}>Limit Set</Text>
//               </View>
//             </View>
//           </View>

//           {/* Recent Lists */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>
//                 Recent Lists / पुरानी सूचियां
//               </Text>

//               <TouchableOpacity activeOpacity={0.8}>
//                 <Text style={styles.viewAll}>View All</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {RECENT_LISTS.map(item => (
//                 <View key={item.id} style={styles.recentCard}>
//                   <View style={styles.recentTop}>
//                     <Icon
//                       name="clipboard-text-outline"
//                       size={20}
//                       color={COLORS.textSecondary}
//                     />

//                     <Text style={styles.recentTitle}>{item.title}</Text>
//                   </View>

//                   <Text style={styles.recentItems}>{item.items}</Text>

//                   <View style={styles.progressTrack}>
//                     <View style={styles.progressFill} />
//                   </View>

//                   <TouchableOpacity
//                     style={styles.reorderButton}
//                     activeOpacity={0.85}
//                   >
//                     <Text style={styles.reorderText}>
//                       Re-order / फिर से लें
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Quick Shop Grid */}
//           <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
//             Quick Shop / जल्दी खरीदें
//           </Text>
//           <View style={styles.categoryGrid}>
//             <TouchableOpacity style={styles.categoryCard} activeOpacity={0.95}>
//               <Image
//                 source={{
//                   uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU8TtYnlsxw1fR2jIzUkxsOxvYT1ORzawI5WJniB-y_IvC7EzPnngC1TC0TzazCpuKk183KMn6m-p_Ywd4ust62kXwnXUFhgc_fpni2FGxaaE-0cmFuFNJxqGWEp2SxeYzboplk5tkJpvBcxAimVRkM9OISY0OuPVXSLsUGLV3OuFTzcpdLsFj5vXAuOHNBQ0lVZ0FPcx_gCNUG6HI4UTvhqIrBzA-uQowOEmRZyOncXztsyvtDU-g2vWOndeXFGywuccGlNVEkw',
//                 }}
//                 style={styles.categoryImage}
//               />
//               <View style={styles.imageOverlay}>
//                 <Text style={styles.categoryText}>Spices / मसाले</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.categoryCard} activeOpacity={0.95}>
//               <Image
//                 source={{
//                   uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1eT-s_WZIsI3HOK8hasugfm2lP0lPEcSs1NHOLYK_kQ4-Y4bkMvOqtKl6FiSmEIoISkV7QkrET2dTR76f38HxdZMgl_6g94n9iBsHcQXhuXvW0kUEJJ3PK-b5QtpdBBUpteBXwga-9eK2quLjqeCh5O4eyqxO4RsFa5xWwvSPbd9VITrF_bII_JMXr-NZLZo3Ixyumh0e74s1xHQHsGL75GyAwjFhDtD1tHi5gpdMWRygqwZa_40MzxtHMK0_1qXD262BDFOLAg',
//                 }}
//                 style={styles.categoryImage}
//               />
//               <View style={styles.imageOverlay}>
//                 <Text style={styles.categoryText}>Fresh / ताज़ा</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         {/* FAB */}
//         <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
//           <Icon name="plus" size={28} color="#582200" />
//         </TouchableOpacity>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },

//   safeArea: {
//     flex: 1,
//   },

//   content: {
//     paddingHorizontal: 20,
//     paddingBottom: 140,
//   },

//   greetingSection: {
//     marginTop: 24,
//     marginBottom: 28,
//   },

//   greeting: {
//     fontSize: 34,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },

//   subGreeting: {
//     marginTop: 6,
//     fontSize: 16,
//     color: COLORS.textSecondary,
//   },

//   heroCard: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 24,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginBottom: 24,
//     overflow: 'hidden',
//   },

//   cardDecorativeCircle: {
//     position: 'absolute',
//     top: -48,
//     right: -48,
//     width: 128,
//     height: 128,
//     borderRadius: 64,
//     backgroundColor: 'rgba(249, 115, 22, 0.1)',
//   },

//   heroTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   activeBadge: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     backgroundColor: COLORS.successLight,
//     marginBottom: 10,
//   },

//   activeBadgeText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: '#003b17',
//   },

//   heroTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },

//   heroSubtitle: {
//     marginTop: 4,
//     fontSize: 12,
//     color: COLORS.textSecondary,
//   },

//   statsRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 20,
//     marginBottom: 20,
//   },

//   statCard: {
//     flex: 1,
//     backgroundColor: '#f5f1eb',
//     borderRadius: 16,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },

//   statNumber: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },

//   statLabel: {
//     marginTop: 4,
//     fontSize: 11,
//     color: COLORS.textSecondary,
//   },

//   openButton: {
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: '#ffdac5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 8,
//   },

//   openButtonText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#582200',
//   },

//   quickStats: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 28,
//   },

//   quickCard: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//     borderRadius: 18,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },

//   quickIconWrap: {
//     width: 48,
//     height: 48,
//     borderRadius: 999,
//     backgroundColor: '#e8fff0',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   quickLabel: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//   },

//   quickValue: {
//     marginTop: 2,
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },

//   section: {
//     marginBottom: 28,
//   },

//   sectionHeader: {
//     marginBottom: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//   },

//   viewAll: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: COLORS.primary,
//   },

//   recentCard: {
//     width: 220,
//     padding: 16,
//     borderRadius: 20,
//     backgroundColor: COLORS.surface,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginRight: 14,
//   },

//   recentTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 10,
//   },

//   recentTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//   },

//   recentItems: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//     marginBottom: 16,
//   },

//   progressTrack: {
//     height: 6,
//     borderRadius: 999,
//     backgroundColor: '#ece7e0',
//     overflow: 'hidden',
//     marginBottom: 16,
//   },

//   progressFill: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: COLORS.success,
//   },

//   reorderButton: {
//     height: 40,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#d7d1ca',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   reorderText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: COLORS.textSecondary,
//   },

//   shopGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },

//   shopCard: {
//     flex: 1,
//     height: 140,
//     borderRadius: 22,
//     overflow: 'hidden',
//   },

//   shopImage: {
//     width: '100%',
//     height: '100%',
//   },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.28)',
//   },
//   categoryGrid: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   categoryCard: {
//     flex: 1,
//     height: 128,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.textSecondary,
//     position: 'relative',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(28, 28, 25, 0.4)',
//     justifyContent: 'flex-end',
//     padding: 16,
//   },
//   categoryText: {
//     color: '#ffffff',
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   shopText: {
//     position: 'absolute',
//     bottom: 14,
//     left: 14,
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   fab: {
//     position: 'absolute',
//     right: 24,
//     bottom: 90,
//     width: 58,
//     height: 58,
//     borderRadius: 999,
//     backgroundColor: '#ffdac5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 6,
//   },
// });

// export default HomeScreen;
