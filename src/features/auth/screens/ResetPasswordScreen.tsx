// src/features/auth/screens/ResetPasswordScreen.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types/navigationTypes';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearError, resetPassword } from '../store/authSlice';
import { isValidPassword, MIN_PASSWORD } from '../utils/validators';

import AuthScreen from '../components/AuthScreen';
import AuthHeading from '../components/AuthHeading';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthMessage from '../components/AuthMessage';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { spacing } = theme;
  const { loading, error } = useAppSelector(s => s.auth);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearError());
    return () => void dispatch(clearError());
  }, [dispatch]);

  const submit = () => {
    const errs: Record<string, string> = {};
    if (!isValidPassword(password)) {
      errs.password = `Password must be at least ${MIN_PASSWORD} characters`;
    }
    if (confirm !== password) errs.confirm = 'Passwords do not match';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    dispatch(resetPassword(password))
      .unwrap()
      .then(() =>
        // Login screen par wapas (stack saaf karke). Wahan success message dikhega.
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
      )
      .catch(() => {});
  };

  return (
    <AuthScreen>
      <View style={{ height: spacing.lg }} />
      <AuthHeading
        icon="lock-check-outline"
        title="Set new password"
        subtitle="Choose a new password for your account"
        align="center"
      />

      <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        <AuthInput
          label="New password"
          secure
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholder={`At least ${MIN_PASSWORD} characters`}
          error={fieldErrors.password}
        />
        <AuthInput
          label="Confirm password"
          secure
          value={confirm}
          onChangeText={setConfirm}
          autoCapitalize="none"
          placeholder="Re-enter new password"
          error={fieldErrors.confirm}
        />

        {error ? <AuthMessage type="error" text={error} /> : null}

        <AuthButton title="Update password" onPress={submit} loading={loading} />
      </View>
    </AuthScreen>
  );
};

export default ResetPasswordScreen;
