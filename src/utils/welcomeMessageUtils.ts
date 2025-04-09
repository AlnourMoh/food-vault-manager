
import { TeamMemberFormData } from '@/types/team';

export const generateWelcomeMessage = (memberData: TeamMemberFormData | null) => {
  if (!memberData) return '';
  
  const isSystemAdmin = memberData.role === 'إدارة النظام';
  const appUrl = isSystemAdmin 
    ? 'https://restaurant-system.example.com' 
    : 'https://storage-app.example.com/download';
  
  const appType = isSystemAdmin ? 'نظام إدارة المطعم' : 'تطبيق إدارة المخزن';
  const accessInfo = memberData.email || `+${memberData.phoneCountryCode}${memberData.phoneNumber}`;
  
  return `مرحباً ${memberData.name}،

نرحب بك في فريق ${memberData.role}. لتتمكن من الوصول إلى ${appType}، يرجى اتباع الخطوات التالية:

${isSystemAdmin 
  ? `1. قم بزيارة ${appUrl}
2. عند فتح النظام، قم بإدخال البريد الإلكتروني أو رقم الهاتف الذي تم تسجيلك به: ${accessInfo}
3. قم بإنشاء كلمة مرور خاصة بك للدخول إلى النظام
4. بعد تسجيل الدخول، يمكنك البدء في استخدام نظام إدارة المطعم` 
  : `1. قم بتحميل تطبيق إدارة المخزن من الرابط: ${appUrl}
2. عند فتح التطبيق، قم بإدخال البريد الإلكتروني أو رقم الهاتف الذي تم تسجيلك به: ${accessInfo}
3. قم بإنشاء كلمة مرور خاصة بك للدخول إلى النظام
4. بعد تسجيل الدخول، يمكنك البدء في استخدام التطبيق لإدارة المخزن وإدخال المنتجات الجديدة وإخراج المنتجات منتهية الصلاحية`}

إذا كان لديك أي استفسار، لا تتردد في التواصل مع مدير النظام.

مع تحياتنا،
فريق إدارة المطعم`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy message:', error);
    return false;
  }
};
