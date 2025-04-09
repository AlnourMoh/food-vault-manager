
import { TeamMemberFormData } from '@/types/team';

export const generateWelcomeMessage = (memberData: TeamMemberFormData | null) => {
  if (!memberData) return '';
  
  return `مرحباً ${memberData.name}،

نرحب بك في فريق إدارة المخزن. لتتمكن من الوصول إلى تطبيق إدارة المخزن، يرجى اتباع الخطوات التالية:

1. قم بتحميل تطبيق إدارة المخزن من الرابط: https://storage-app.example.com/download
2. عند فتح التطبيق، قم بإدخال البريد الإلكتروني أو رقم الهاتف الذي تم تسجيلك به: ${memberData.email || `+${memberData.phoneCountryCode}${memberData.phoneNumber}`}
3. قم بإنشاء كلمة مرور خاصة بك للدخول إلى النظام
4. بعد تسجيل الدخول، يمكنك البدء في استخدام النظام وإدارة المخزن

إذا كان لديك أي استفسار، لا تتردد في التواصل مع مدير النظام.

مع تحياتنا،
فريق إدارة المخزن`;
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
