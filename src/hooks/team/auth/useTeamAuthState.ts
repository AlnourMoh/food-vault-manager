
import { useState, useEffect } from 'react';
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

  // Check for stored identifier at initialization
  useEffect(() => {
    // Check if user is already logged in, if so don't do anything
    const teamMemberId = localStorage.getItem('teamMemberId');
    const teamMemberIdentifier = localStorage.getItem('teamMemberIdentifier');
    
    // If there's no stored identifier, stay at the identifier step
    if (!teamMemberIdentifier) {
      return;
    }
    
    // If user is already logged in, don't proceed
    if (teamMemberId) {
      return;
    }
    
    // Determine identifier type and pre-fill the form
    if (teamMemberIdentifier.includes('@')) {
      setIdentifierType('email');
      setEmail(teamMemberIdentifier);
    } else {
      setIdentifierType('phone');
      // Extract phone number without country code
      if (teamMemberIdentifier.startsWith('+')) {
        const phoneWithoutPlus = teamMemberIdentifier.substring(1);
        const countryCode = phoneWithoutPlus.substring(0, 3); // Assumes 3-digit country code
        const phoneNum = phoneWithoutPlus.substring(3);
        setPhoneCountryCode(countryCode);
        setPhoneNumber(phoneNum);
      } else {
        setPhoneNumber(teamMemberIdentifier);
      }
    }
    
    // Move directly to password step
    setLoginStep('password');
  }, []);

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
