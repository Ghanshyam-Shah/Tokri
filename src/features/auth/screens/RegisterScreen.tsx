// src/features/auth/screens/RegisterScreen.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types/navigationTypes';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearError, sendRegisterOtp } from '../store/authSlice';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  MIN_PASSWORD,
} from '../utils/validators';

import AuthScreen from '../components/AuthScreen';
import AuthHeading from '../components/AuthHeading';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthMessage from '../components/AuthMessage';
import AuthFooterLink from '../components/AuthFooterLink';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { spacing } = theme;
  const { loading, error, errorCode } = useAppSelector(s => s.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearError());
    return () => void dispatch(clearError());
  }, [dispatch]);

  const submit = () => {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Enter your name';
    if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!isValidPhone(phone)) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!isValidPassword(password)) {
      errs.password = `Password must be at least ${MIN_PASSWORD} characters`;
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    dispatch(
      sendRegisterOtp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone,
        password,
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
          text="Already have an account?"
          linkLabel="Login"
          onPress={() => navigation.navigate('Login')}
        />
      }
    >
      <AuthHeading
        title="Create your account"
        subtitle="Set up Tokri in a minute"
      />

      <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        <AuthInput
          label="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Your name"
          error={fieldErrors.name}
        />
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
          label="Mobile number"
          prefix="+91"
          value={phone}
          onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          placeholder="98765 43210"
          maxLength={10}
          error={fieldErrors.phone}
        />
        <AuthInput
          label="Password"
          secure
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholder={`At least ${MIN_PASSWORD} characters`}
          error={fieldErrors.password}
        />

        {error ? (
          <AuthMessage
            type="error"
            text={error}
            actionLabel={errorCode === 'ALREADY_REGISTERED' ? 'Login' : undefined}
            onAction={() => navigation.navigate('Login')}
          />
        ) : null}

        <AuthButton
          title="Register & send OTP"
          rightIcon="arrow-right"
          onPress={submit}
          loading={loading}
        />
      </View>
    </AuthScreen>
  );
};

export default RegisterScreen;
