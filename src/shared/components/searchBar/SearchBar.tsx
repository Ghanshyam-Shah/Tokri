// // src/features/catalog/components/SearchBar.tsx

// import React from 'react';
// import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const DARK = {
//   border: '#3a2418',
//   textPrimary: '#f6ded3',
//   textMuted: '#a78b7d',
//   searchBg: '#1e1208',
// };

// interface SearchBarProps {
//   searchQuery: string;
//   onSearchChange: (q: string) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({
//   searchQuery,
//   onSearchChange,
// }) => {
//   return (
//     <View style={styles.searchOuter}>
//       <View style={styles.searchBar}>
//         <Icon
//           name="magnify"
//           size={20}
//           color={DARK.textMuted}
//           style={{ marginRight: 8 }}
//         />

//         <TextInput
//           placeholder="Search catalog / सूची खोजें..."
//           placeholderTextColor={DARK.textMuted}
//           value={searchQuery}
//           onChangeText={onSearchChange}
//           style={styles.searchInput}
//         />

//         {searchQuery.length > 0 && (
//           <TouchableOpacity
//             onPress={() => onSearchChange('')}
//             hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//           >
//             <Icon name="close-circle" size={18} color={DARK.textMuted} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchOuter: {
//     paddingTop: 12,
//     paddingBottom: 14,
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
//   },
// });

// export default React.memo(SearchBar);

// src/features/catalog/components/SearchBar.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DARK = {
  border: '#3a2418',
  textPrimary: '#f6ded3',
  textMuted: '#a78b7d',
  searchBg: '#1e1208',
};

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon
          name="magnify"
          size={20}
          color={DARK.textMuted}
          style={styles.searchIcon}
        />

        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search catalog / सूची खोजें..."
          placeholderTextColor={DARK.textMuted}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Icon name="close-circle" size={18} color={DARK.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DARK.border,
    backgroundColor: DARK.searchBg,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK.textPrimary,
  },
});

export default React.memo(SearchBar);
