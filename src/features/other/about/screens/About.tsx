import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

const APP_VERSION = '1.0.0'; // TODO: package.json / react-native-device-info se lo

const FEATURES = [
  { icon: 'clipboard-list-outline', text: 'Dukaan ki shopping list banao, items select karo aur quantity set karo.' },
  { icon: 'grid', text: 'Apna catalog manage karo: product add aur edit karo.' },
  { icon: 'history', text: 'Purani lists history me milti hain, ek tap me dobara use karo.' },
  { icon: 'share-variant-outline', text: 'List ko PDF, image ya WhatsApp se share karo.' },
];

const About = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <AppHeader title="About" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App identity */}
        <View style={styles.identity}>
          <View style={styles.logoWrap}>
            <Icon name="basket-outline" size={40} color={colors.primary} />
          </View>
          <Text style={styles.appName}>KiranaList</Text>
          <Text style={styles.version}>Version {APP_VERSION}</Text>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ye app kya karta hai</Text>
          <Text style={styles.body}>
            KiranaList kirana dukaan ke liye banayi gayi ek simple app hai, jisse
            aap apni shopping list jaldi bana aur share kar sakte ho.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features</Text>
          {FEATURES.map(f => (
            <View key={f.icon} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Icon name={f.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    content: { padding: spacing.lg, paddingBottom: spacing.giant },
    identity: { alignItems: 'center', marginVertical: spacing.xxl },
    logoWrap: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    appName: {
      fontSize: typography.xxl,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    version: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    cardTitle: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    body: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    featureIcon: {
      width: 34,
      height: 34,
      borderRadius: borderRadius.sm + 2,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    featureText: {
      flex: 1,
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
};

export default About;