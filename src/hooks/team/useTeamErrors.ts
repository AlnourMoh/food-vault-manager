
import { useState } from 'react';

export const useTeamErrors = () => {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const resetErrors = () => {
    setPhoneError(null);
    setEmailError(null);
  };

  const setErrors = (error: Error) => {
    if (error.message.includes('رقم الهاتف')) {
      setPhoneError(error.message);
    } else if (error.message.includes('البريد الإلكتروني')) {
      setEmailError(error.message);
    }
  };

  return {
    phoneError,
    emailError,
    resetErrors,
    setErrors
  };
};
