
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useEmailVerification = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const { toast } = useToast();

  const verifyEmail = async (email: string) => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "البريد الإلكتروني مطلوب",
        description: "يرجى إدخال بريد إلكتروني للتحقق منه",
      });
      return;
    }

    setVerifyingEmail(true);
    try {
      const { data: member, error: memberError } = await supabase
        .from('company_members')
        .select('email')
        .eq('email', email)
        .single();

      if (memberError && memberError.code !== 'PGRST116') {
        console.error('Error checking company_members:', memberError);
        throw memberError;
      }

      const { data: accessData, error: accessError } = await supabase
        .from('restaurant_access')
        .select('email, password_hash')
        .eq('email', email)
        .single();

      if (accessError && accessError.code !== 'PGRST116') {
        console.error('Error checking restaurant_access:', accessError);
        throw accessError;
      }

      if (member || (accessData && accessData.password_hash === 'temporary_password')) {
        setEmailVerified(true);
        toast({
          title: "تم التحقق من البريد الإلكتروني",
          description: "يمكنك الآن إنشاء كلمة المرور الخاصة بك",
        });
      } else if (accessData && accessData.password_hash !== 'temporary_password') {
        toast({
          variant: "destructive",
          title: "البريد الإلكتروني مسجل بالفعل",
          description: "هذا البريد الإلكتروني لديه حساب بالفعل، يرجى تسجيل الدخول",
        });
      } else {
        toast({
          variant: "destructive",
          title: "البريد الإلكتروني غير مسجل",
          description: "هذا البريد الإلكتروني غير مسجل في أي من المطاعم. يرجى الرجوع إلى مسؤول الحساب الخاص بك ليقوم بإعادة تسجيلك في النظام.",
        });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      toast({
        variant: "destructive",
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من البريد الإلكتروني",
      });
    } finally {
      setVerifyingEmail(false);
    }
  };

  return {
    emailVerified,
    verifyingEmail,
    verifyEmail,
    setEmailVerified
  };
};
