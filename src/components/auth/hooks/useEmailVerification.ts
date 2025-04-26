
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
      console.log('التحقق من البريد الإلكتروني:', email);
      
      // 1. التحقق من وجود البريد في جدول company_members 
      const { data: member, error: memberError } = await supabase
        .from('company_members')
        .select('email, role, name, company_id')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      console.log('نتيجة البحث في company_members:', { member, memberError });

      if (memberError && memberError.code !== 'PGRST116') {
        console.error('خطأ في التحقق من company_members:', memberError);
        throw memberError;
      }

      // 2. التحقق من وجود البريد في جدول restaurant_access
      const { data: accessData, error: accessError } = await supabase
        .from('restaurant_access')
        .select('email, password_hash, restaurant_id')
        .eq('email', email)
        .maybeSingle();

      console.log('نتيجة البحث في restaurant_access:', { accessData, accessError });

      if (accessError && accessError.code !== 'PGRST116') {
        console.error('خطأ في التحقق من restaurant_access:', accessError);
        throw accessError;
      }

      // 3. التحقق من وجود البريد في أي من الجداول
      if (member || accessData) {
        // التحقق من وجود البريد في جدول restaurant_access مع كلمة مرور مؤقتة
        const needsPasswordReset = accessData && accessData.password_hash === 'temporary_password';

        // إذا لم يكن موجوداً في restaurant_access، إضافته
        if (!accessData && member) {
          // استخراج restaurant_id من member
          const restaurantId = member.company_id;
          
          // إضافة السجل في restaurant_access مع كلمة مرور مؤقتة
          await supabase
            .from('restaurant_access')
            .insert({
              email: email,
              restaurant_id: restaurantId,
              password_hash: 'temporary_password'
            });
          console.log('تم إضافة البريد إلى restaurant_access بكلمة مرور مؤقتة');
        }

        if (needsPasswordReset || (member && !accessData)) {
          // يحتاج إلى تعيين كلمة مرور جديدة
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
        }
      } else {
        toast({
          variant: "destructive",
          title: "البريد الإلكتروني غير مسجل",
          description: "هذا البريد الإلكتروني غير مسجل في أي من المطاعم. يرجى التواصل مع مسؤول الحساب الخاص بك للتسجيل في النظام.",
        });
      }
    } catch (error: any) {
      console.error('خطأ في التحقق من البريد الإلكتروني:', error);
      toast({
        variant: "destructive",
        title: "خطأ في التحقق",
        description: error.message || "حدث خطأ أثناء التحقق من البريد الإلكتروني",
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
