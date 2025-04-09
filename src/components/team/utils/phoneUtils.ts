
export const extractPhoneInfo = (phone: string | undefined) => {
  if (!phone) {
    return { countryCode: '974', phoneNumber: '' };
  }
  
  // Remove the '+' sign if present
  const phoneWithoutPlus = phone.startsWith('+') ? phone.substring(1) : phone;
  
  // Assume countryCode is 3 digits (like '974')
  const countryCode = phoneWithoutPlus.substring(0, 3);
  const phoneNumber = phoneWithoutPlus.substring(3);
  
  return { countryCode, phoneNumber };
};
