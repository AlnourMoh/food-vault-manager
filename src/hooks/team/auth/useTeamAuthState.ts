
import { useState } from 'react';
import { IdentifierType, LoginStep, TeamAuthState, TeamAuthSetters } from './types';

export function useTeamAuthState(): TeamAuthState & TeamAuthSetters {
  const [identifierType, setIdentifierType] = useState<IdentifierType>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('974'); // قطر كقيمة افتراضية
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>('identifier');
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  return {
    identifierType,
    email,
    phoneNumber,
    phoneCountryCode,
    password,
    confirmPassword,
    showPassword,
    isLoading,
    loginStep,
    isFirstLogin,
    setIdentifierType,
    setEmail,
    setPhoneNumber,
    setPhoneCountryCode,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setIsLoading,
    setLoginStep,
    setIsFirstLogin
  };
}
