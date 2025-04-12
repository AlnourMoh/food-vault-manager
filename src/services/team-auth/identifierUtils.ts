
import { validEmailPatterns, validPhonePatterns } from './mockData';

/**
 * Normalizes an identifier (email or phone) for consistent comparison
 */
export const normalizeIdentifier = (identifier: string): string => {
  return identifier.replace(/\s+/g, '').toLowerCase();
};

/**
 * Checks if an email matches any valid pattern for testing
 */
export const isValidTestEmail = (email: string): boolean => {
  const normalizedEmail = normalizeIdentifier(email);
  
  return validEmailPatterns.some(pattern => 
    normalizedEmail === pattern || normalizedEmail.includes(pattern)
  );
};

/**
 * Checks if a phone number matches any valid pattern for testing
 */
export const isValidTestPhone = (phone: string): boolean => {
  const normalizedPhone = normalizeIdentifier(phone);
  
  return validPhonePatterns.some(pattern => 
    normalizedPhone.startsWith(pattern) || 
    normalizedPhone.endsWith(pattern) || 
    normalizedPhone.includes(pattern)
  );
};

/**
 * Determines if an identifier is an email or phone number
 */
export const isEmailIdentifier = (identifier: string): boolean => {
  return identifier.includes('@');
};
