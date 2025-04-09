
// Helper functions for restaurant form

// Extract country code and phone number from a full phone number
export const extractPhoneInfo = (phone: string | undefined) => {
  if (!phone) return { countryCode: '974', phoneNumber: '' };
  
  // تحقق ما إذا كان الرقم يبدأ ب +
  if (phone.startsWith('+')) {
    // البحث عن مفتاح الدولة المطابق من القائمة المعروفة
    const knownCodes = ['974', '966', '971', '973', '965', '968', '20', '962', '961', '963'];
    
    for (const code of knownCodes) {
      if (phone.startsWith(`+${code}`)) {
        return { 
          countryCode: code, 
          phoneNumber: phone.substring(code.length + 1) 
        };
      }
    }
    
    // إذا لم يتم العثور على مفتاح معروف، نفترض أن أول 3 أرقام هي المفتاح
    const countryCode = phone.substring(1, 4);
    const phoneNumber = phone.substring(4);
    
    return { countryCode, phoneNumber };
  }
  
  // إذا لم يبدأ الرقم ب +، استخدم القيمة الافتراضية
  return { countryCode: '974', phoneNumber: phone };
};

// Format a phone number to ensure it's in the correct format
export const formatPhoneNumber = (countryCode: string, phoneNumber: string): string => {
  // Remove any '+' prefix from country code
  const cleanCountryCode = countryCode.replace(/^\+/, '');
  
  // Remove any non-numeric characters from phone number
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  
  return `+${cleanCountryCode}${cleanPhoneNumber}`;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
