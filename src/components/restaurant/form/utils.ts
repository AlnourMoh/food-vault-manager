
export const extractPhoneInfo = (phone: string | undefined) => {
  if (!phone) return { countryCode: '974', phoneNumber: '' };
  
  // تحقق ما إذا كان الرقم يبدأ ب +
  if (phone.startsWith('+')) {
    // البحث عن مفتاح الدولة المطابق
    const countryCode = phone.substring(1, 4);  // Assuming country code is 3 digits
    const phoneNumber = phone.substring(4);     // Rest is the phone number
    
    return { countryCode, phoneNumber };
  }
  
  // إذا لم يتم العثور على مفتاح دولة، استخدم القيمة الافتراضية
  return { countryCode: '974', phoneNumber: phone };
};
