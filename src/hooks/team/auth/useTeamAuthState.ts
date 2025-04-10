
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
    const storedIdentifier = localStorage.getItem('teamMemberIdentifier');
    const storedPassword = localStorage.getItem('teamMemberPassword');
    
    // If user just completed setup and has a stored identifier and password
    if (storedIdentifier && storedPassword) {
      // Determine identifier type
      if (storedIdentifier.includes('@')) {
        setIdentifierType('email');
        setEmail(storedIdentifier);
      } else {
        setIdentifierType('phone');
        // Extract phone number without country code
        if (storedIdentifier.startsWith('+')) {
          const phoneWithoutPlus = storedIdentifier.substring(1);
          const countryCode = phoneWithoutPlus.substring(0, 3);
          const phoneNum = phoneWithoutPlus.substring(3);
          setPhoneCountryCode(countryCode);
          setPhoneNumber(phoneNum);
        } else {
          setPhoneNumber(storedIdentifier);
        }
      }
      
      // Move directly to password step
      setLoginStep('password');
    }
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
