// src/shared/components/headers/AppHeader.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const DARK = {
  bg: '#1c110b',
  textPrimary: '#f6ded3',
};

const HEADER_H = Platform.OS === 'ios' ? 52 : 58;
const H_PADDING = 16;

interface CatalogHeaderProps {
  title: string;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.headerIconBtn}
      >
        <Icon name="menu" size={28} color={DARK.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity style={styles.headerIconBtn}>
        <Icon name="bell-outline" size={22} color={DARK.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default React.memo(CatalogHeader);
