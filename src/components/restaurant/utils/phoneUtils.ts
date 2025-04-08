
/**
 * Parses a phone number to extract country code and number
 */
export const parsePhoneNumber = (phone: string) => {
  if (!phone) return { countryCode: '974', number: '' };

  // Check if the phone starts with + and has a country code
  if (phone.startsWith('+')) {
    // Extract country code (assuming it's between 1-4 digits after the +)
    const match = phone.match(/^\+(\d{1,4})(\d+)$/);
    if (match) {
      return {
        countryCode: match[1],
        number: match[2]
      };
    }
  }

  // Default to Qatar country code if no valid format is found
  return { countryCode: '974', number: phone.replace(/^\+974/, '') };
};

/**
 * Formats phone number with country code
 */
export const formatPhoneNumber = (countryCode: string, phoneNumber: string) => {
  // Clean the phoneNumber by removing any potential country code prefixes
  const cleanNumber = phoneNumber.replace(/^\+?\d{1,4}/, '');
  return `+${countryCode}${cleanNumber}`;
};
