// src/features/catalog/components/CatalogListEmpty.tsx
// Catalog grid ka khali state: loading spinner / error / "koi product nahi mila"

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import EmptyState from '../../../shared/components/states/EmptyState';

interface Props {
  loading: boolean;
  error: string | null;
}

const CatalogListEmpty = ({ loading, error }: Props) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ paddingVertical: theme.spacing.giant, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="cloud-off-outline"
        title="Could not load catalog"
        subtitle={`${error}. Pull down to retry.`}
      />
    );
  }

  return (
    <EmptyState
      icon="basket-off-outline"
      title="Koi product nahi mila"
      subtitle="Try another search or category"
    />
  );
};

export default CatalogListEmpty;
