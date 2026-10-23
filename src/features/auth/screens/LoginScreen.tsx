// src/features/auth/screens/LoginScreen.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types/navigationTypes';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
  clearError,
  loginWithEmail,
  sendLoginOtp,
} from '../store/authSlice';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  MIN_PASSWORD,
} from '../utils/validators';

import AuthScreen from '../components/AuthScreen';
import AppLogo from '../components/AppLogo';
import AuthHeading from '../components/AuthHeading';
import AuthTabs from '../components/AuthTabs';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthMessage from '../components/AuthMessage';
import AuthFooterLink from '../components/AuthFooterLink';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type Tab = 'phone' | 'email';

const TABS: { id: Tab; label: string }[] = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { spacing } = theme;
  const { loading, error, errorCode, notice } = useAppSelector(s => s.auth);

  const [tab, setTab] = useState<Tab>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // tab badalne par / screen se jaate waqt purana error hata do
  useEffect(() => {
    dispatch(clearError());
    setFieldErrors({});
  }, [tab, dispatch]);
  useEffect(() => () => void dispatch(clearError()), [dispatch]);

  const submitPhone = () => {
    if (!isValidPhone(phone)) {
      setFieldErrors({ phone: 'Enter a valid 10-digit mobile number' });
      return;
    }
    setFieldErrors({});
    dispatch(sendLoginOtp(phone))
      .unwrap()
      .then(() => navigation.navigate('Otp'))
      .catch(() => {}); // error redux me hai, neeche message me dikhta hai
  };

  const submitEmail = () => {
    const errs: Record<string, string> = {};
    if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!isValidPassword(password)) {
      errs.password = `Password must be at least ${MIN_PASSWORD} characters`;
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    // success par status 'signedIn' ho jata hai, RootNavigator Home dikha deta hai
    dispatch(loginWithEmail({ email: email.trim().toLowerCase(), password }));
  };

  return (
    <AuthScreen
      footer={
        <AuthFooterLink
          text="New user?"
          linkLabel="Register"
          onPress={() => navigation.navigate('Register')}
        />
      }
    >
      <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
        <AppLogo tagline="Your grocery list, all in one place" />
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <AuthHeading title="Welcome back" subtitle="Log in to see your lists" />
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <AuthTabs items={TABS} selected={tab} onSelect={setTab} />
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        {notice ? <AuthMessage type="success" text={notice} /> : null}

        {tab === 'phone' ? (
          <>
            <AuthInput
              label="Mobile number"
              prefix="+91"
              value={phone}
              onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              placeholder="98765 43210"
              maxLength={10}
              error={fieldErrors.phone}
            />
            {error ? (
              <AuthMessage
                type="error"
                text={error}
                actionLabel={errorCode === 'USER_NOT_FOUND' ? 'Register' : undefined}
                onAction={() => navigation.navigate('Register')}
              />
            ) : null}
            <AuthButton
              title="Send OTP"
              rightIcon="arrow-right"
              onPress={submitPhone}
              loading={loading}
            />
          </>
        ) : (
          <>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              error={fieldErrors.email}
            />
            <AuthInput
              label="Password"
              secure
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              placeholder="Your password"
              error={fieldErrors.password}
            />
            <View style={{ alignItems: 'flex-end', marginTop: -spacing.sm }}>
              <AuthFooterLink
                text=""
                linkLabel="Forgot password?"
                onPress={() => navigation.navigate('ForgotPassword')}
              />
            </View>
            {error ? (
              <AuthMessage
                type="error"
                text={error}
                actionLabel={errorCode === 'USER_NOT_FOUND' ? 'Register' : undefined}
                onAction={() => navigation.navigate('Register')}
              />
            ) : null}
            <AuthButton title="Login" onPress={submitEmail} loading={loading} />
          </>
        )}
      </View>
    </AuthScreen>
  );
};

export default LoginScreen;
