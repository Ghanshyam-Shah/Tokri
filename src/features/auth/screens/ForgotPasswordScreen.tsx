// src/features/auth/screens/ForgotPasswordScreen.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types/navigationTypes';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearError, sendResetOtp } from '../store/authSlice';
import { isValidEmail, isValidPhone } from '../utils/validators';

import AuthScreen from '../components/AuthScreen';
import AuthHeading from '../components/AuthHeading';
import AuthTabs from '../components/AuthTabs';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthMessage from '../components/AuthMessage';
import AuthFooterLink from '../components/AuthFooterLink';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
type Tab = 'phone' | 'email';

const TABS: { id: Tab; label: string }[] = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { spacing } = theme;
  const { loading, error } = useAppSelector(s => s.auth);

  const [tab, setTab] = useState<Tab>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearError());
    setFieldError(null);
  }, [tab, dispatch]);
  useEffect(() => () => void dispatch(clearError()), [dispatch]);

  const submit = () => {
    if (tab === 'phone' && !isValidPhone(phone)) {
      setFieldError('Enter a valid 10-digit mobile number');
      return;
    }
    if (tab === 'email' && !isValidEmail(email)) {
      setFieldError('Enter a valid email address');
      return;
    }
    setFieldError(null);

    dispatch(
      sendResetOtp({
        channel: tab,
        target: tab === 'phone' ? phone : email.trim().toLowerCase(),
      }),
    )
      .unwrap()
      .then(() => navigation.navigate('Otp'))
      .catch(() => {});
  };

  return (
    <AuthScreen
      showBack
      footer={
        <AuthFooterLink
          text="Remembered it?"
          linkLabel="Back to login"
          onPress={() => navigation.navigate('Login')}
        />
      }
    >
      <AuthHeading
        icon="lock-reset"
        title="Forgot password?"
        subtitle="Choose email or phone and we'll send you an OTP"
        align="center"
      />

      <View style={{ marginTop: spacing.xl }}>
        <AuthTabs items={TABS} selected={tab} onSelect={setTab} />
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        {tab === 'phone' ? (
          <AuthInput
            label="Mobile number"
            prefix="+91"
            value={phone}
            onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            placeholder="98765 43210"
            maxLength={10}
            error={fieldError}
          />
        ) : (
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            error={fieldError}
          />
        )}

        {error ? <AuthMessage type="error" text={error} /> : null}

        <AuthButton
          title="Send OTP"
          rightIcon="arrow-right"
          onPress={submit}
          loading={loading}
        />
      </View>
    </AuthScreen>
  );
};

export default ForgotPasswordScreen;
