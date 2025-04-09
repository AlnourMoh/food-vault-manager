
/**
 * Error handling utilities for team member operations
 */

/**
 * Sets appropriate error messages based on error response
 */
export const handleTeamMemberErrors = (
  error: any,
  setPhoneError: (error: string | null) => void,
  setEmailError: (error: string | null) => void
): void => {
  // Reset errors first
  setPhoneError(null);
  setEmailError(null);
  
  // Check for specific error messages related to phone or email
  if (error.message && typeof error.message === 'string') {
    if (error.message.includes('رقم الهاتف')) {
      setPhoneError(error.message);
    } else if (error.message.includes('البريد الإلكتروني')) {
      setEmailError(error.message);
    }
  }
};

/**
 * Reset validation errors
 */
export const resetValidationErrors = (
  setPhoneError: (error: string | null) => void,
  setEmailError: (error: string | null) => void
): void => {
  setPhoneError(null);
  setEmailError(null);
};
