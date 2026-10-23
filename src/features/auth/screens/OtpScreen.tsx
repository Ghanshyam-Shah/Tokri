// src/features/auth/screens/OtpScreen.tsx
//
// Ek hi screen 3 kaam ke liye: login / register / reset.
// Kya karna hai, ye Redux ka `otpFlow.purpose` batata hai.
//  - login, register  -> verify hote hi status 'signedIn' -> RootNavigator Home dikhata hai
//  - reset            -> ResetPassword screen par jata hai

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types/navigationTypes';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearError, resendOtp, verifyOtp } from '../store/authSlice';
import { isValidOtp } from '../utils/validators';

import AuthScreen from '../components/AuthScreen';
import AuthHeading from '../components/AuthHeading';
import OtpInput from '../components/OtpInput';
import AuthButton from '../components/AuthButton';
import AuthMessage from '../components/AuthMessage';
import AuthFooterLink from '../components/AuthFooterLink';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;

const RESEND_SECONDS = 30;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { colors, spacing, typography, fontFamilies } = theme;
  const flow = useAppSelector(s => s.auth.otpFlow);
  const { loading, error } = useAppSelector(s => s.auth);

  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  // resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  useEffect(() => {
    dispatch(clearError());
    return () => void dispatch(clearError());
  }, [dispatch]);

  if (!flow) return null; // login/register success ke baad flow null ho jata hai

  const isPhone = flow.channel === 'phone';
  const target = isPhone ? `+91 ${flow.target}` : flow.target;

  const submit = () => {
    if (!isValidOtp(otp)) {
      setLocalError('Enter the 6-digit OTP');
      return;
    }
    setLocalError(null);
    dispatch(verifyOtp(otp))
      .unwrap()
      .then(res => {
        if (res.purpose === 'reset') navigation.replace('ResetPassword');
      })
      .catch(() => {});
  };

  const resend = () => {
    dispatch(resendOtp())
      .unwrap()
      .then(() => {
        setOtp('');
        setLocalError(null);
        setSeconds(RESEND_SECONDS);
      })
      .catch(() => {});
  };

  return (
    <AuthScreen showBack>
      <AuthHeading
        icon="cellphone-message"
        title="Verify OTP"
        subtitle={`A 6-digit OTP has been sent to\n${target}`}
        align="center"
      />

      <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
        <AuthFooterLink
          text=""
          linkLabel={isPhone ? 'Change number' : 'Change email'}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <OtpInput
          value={otp}
          onChange={t => {
            setOtp(t);
            setLocalError(null);
          }}
          hasError={!!localError || !!error}
        />
      </View>

      {localError || error ? (
        <View style={{ marginTop: spacing.lg }}>
          <AuthMessage type="error" text={(localError ?? error) as string} />
        </View>
      ) : null}

      <View style={{ marginTop: spacing.xl, alignItems: 'center' }}>
        {seconds > 0 ? (
          <Text
            style={{
              fontSize: typography.sm,
              fontFamily: fontFamilies.regular,
              color: colors.textMuted,
            }}
          >
            Didn't get the OTP? Resend in{' '}
            <Text style={{ fontFamily: fontFamilies.bold, color: colors.textPrimary }}>
              0:{String(seconds).padStart(2, '0')}
            </Text>
          </Text>
        ) : (
          <AuthFooterLink
            text="Didn't get the OTP?"
            linkLabel="Resend OTP"
            onPress={resend}
          />
        )}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <AuthButton
          title="Verify"
          onPress={submit}
          loading={loading}
          disabled={otp.length < 6}
        />
      </View>
    </AuthScreen>
  );
};

export default OtpScreen;
