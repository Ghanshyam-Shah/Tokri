import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// component ke andar:

import AppHeader from '../../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

const FAQS = [
  {
    q: 'Nayi list kaise banau?',
    a: 'Neeche beech ke + button pe tap karo, list ka naam daalo aur Create dabao. Phir items chun ke Continue karo.',
  },
  {
    q: 'Catalog me naya product kaise jodu?',
    a: 'Catalog tab kholo aur upar + icon dabao. Naam, category, price aur quantity bharke Add Item karo.',
  },
  {
    q: 'Product edit ya delete kaise karu?',
    a: 'Catalog me product card ke Edit button pe tap karo. Delete ka icon edit screen ke upar right side me hai.',
  },
  {
    q: 'Purani list dobara kaise use karu?',
    a: 'History tab me list dhundho aur Reuse dabao.',
  },
  {
    q: 'List share kaise karu?',
    a: 'List screen ke neeche PDF, Image ya WhatsApp button se share kar sakte ho.',
  },
];

const Help = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <AppHeader title="Help" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Aksar poochhe jaane wale sawal</Text>

        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <TouchableOpacity
              key={item.q}
              activeOpacity={0.85}
              style={styles.card}
              onPress={() => setOpenIndex(open ? null : i)}
            >
              <View style={styles.qRow}>
                <Text style={styles.question}>{item.q}</Text>
                <Icon
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={colors.textMuted}
                />
              </View>
              {open && <Text style={styles.answer}>{item.a}</Text>}
            </TouchableOpacity>
          );
        })}
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
    heading: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
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
    qRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    question: {
      flex: 1,
      fontSize: typography.md,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
      marginRight: spacing.sm,
    },
    answer: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textSecondary,
      lineHeight: 22,
      marginTop: spacing.sm,
    },
  });
};

export default Help;