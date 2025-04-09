
import * as z from 'zod';

// Validation for phone country code
const phoneCountryCodeSchema = z.string().min(1, {
  message: 'مفتاح الدولة مطلوب'
});

// Validation for phone number
const phoneNumberSchema = z.string()
  .min(4, { message: 'رقم الهاتف يجب أن يكون أكثر من 3 أرقام' })
  .max(15, { message: 'رقم الهاتف لا يمكن أن يتجاوز 15 رقم' })
  .regex(/^\d+$/, { message: 'يجب أن يحتوي رقم الهاتف على أرقام فقط' });

// Define the form validation schema
export const restaurantFormSchema = z.object({
  name: z.string()
    .min(3, { message: 'اسم المطعم يجب أن يكون أكثر من 3 أحرف' })
    .max(100, { message: 'اسم المطعم لا يمكن أن يتجاوز 100 حرف' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9\s]+$/, { 
      message: 'اسم المطعم يجب أن يحتوي على أحرف عربية أو إنجليزية أو أرقام فقط' 
    }),
    
  manager: z.string()
    .min(3, { message: 'اسم المدير يجب أن يكون أكثر من 3 أحرف' })
    .max(100, { message: 'اسم المدير لا يمكن أن يتجاوز 100 حرف' })
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, { 
      message: 'اسم المدير يجب أن يحتوي على أحرف عربية أو إنجليزية فقط' 
    }),
    
  address: z.string()
    .min(5, { message: 'العنوان يجب أن يكون أكثر من 5 أحرف' })
    .max(255, { message: 'العنوان لا يمكن أن يتجاوز 255 حرف' }),
    
  phoneCountryCode: phoneCountryCodeSchema,
  
  phoneNumber: phoneNumberSchema,
  
  email: z.string()
    .email({ message: 'البريد الإلكتروني غير صحيح' })
    .max(255, { message: 'البريد الإلكتروني لا يمكن أن يتجاوز 255 حرف' }),
});

// Validate a complete phone number (country code + number)
export const validateFullPhoneNumber = (
  countryCode: string, 
  phoneNumber: string
): string | null => {
  // Check if both parts are present
  if (!countryCode || !phoneNumber) {
    return 'رقم الهاتف غير مكتمل';
  }
  
  // Remove any '+' prefix from country code
  const cleanCountryCode = countryCode.replace(/^\+/, '');
  
  // Validate the format
  const fullNumberRegex = new RegExp(`^\\+?${cleanCountryCode}${phoneNumber}$`);
  const testNumber = `+${cleanCountryCode}${phoneNumber}`;
  
  if (!fullNumberRegex.test(testNumber)) {
    return 'صيغة رقم الهاتف غير صحيحة';
  }
  
  return null; // No error
};

// Parse a full phone number into country code and phone number parts
export const parsePhoneNumber = (fullPhone: string): { countryCode: string, phoneNumber: string } => {
  if (!fullPhone) return { countryCode: '974', phoneNumber: '' };
  
  // تحقق ما إذا كان الرقم يبدأ ب +
  if (fullPhone.startsWith('+')) {
    // البحث عن مفتاح الدولة المطابق من القائمة المعروفة
    const knownCodes = ['974', '966', '971', '973', '965', '968', '20', '962', '961', '963'];
    
    for (const code of knownCodes) {
      if (fullPhone.startsWith(`+${code}`)) {
        return { 
          countryCode: code, 
          phoneNumber: fullPhone.substring(code.length + 1) 
        };
      }
    }
    
    // إذا لم يتم العثور على مفتاح معروف، نفترض أن أول 3 أرقام هي المفتاح
    const countryCode = fullPhone.substring(1, 4);
    const phoneNumber = fullPhone.substring(4);
    
    return { countryCode, phoneNumber };
  }
  
  // إذا لم يبدأ الرقم ب +، استخدم القيمة الافتراضية
  return { countryCode: '974', phoneNumber: fullPhone };
};

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;
