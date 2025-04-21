
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { signupSchema, type SignupFormData } from './schemas/signupSchema';
import { useEmailVerification } from './hooks/useEmailVerification';
import { EmailField } from './components/EmailField';
import { PasswordFields } from './components/PasswordFields';

export const RestaurantSignup = () => {
  const { toast } = useToast();
  const { emailVerified, verifyingEmail, verifyEmail, setEmailVerified } = useEmailVerification();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleVerifyEmail = () => {
    const email = form.getValues('email');
    verifyEmail(email);
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!emailVerified) {
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('restaurant_access')
        .update({ password_hash: data.password })
        .eq('email', data.email);

      if (updateError) {
        console.error('Error updating password:', updateError);
        throw updateError;
      }

      toast({
        title: "تم التسجيل بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور",
      });

      form.reset();
      setEmailVerified(false);
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EmailField form={form} disabled={emailVerified} />
        
        {emailVerified && <PasswordFields form={form} />}

        {!emailVerified ? (
          <Button 
            type="button" 
            className="w-full"
            disabled={verifyingEmail}
            onClick={handleVerifyEmail}
          >
            {verifyingEmail ? 'جاري التحقق...' : 'تحقق من البريد الإلكتروني'}
          </Button>
        ) : (
          <Button 
            type="submit" 
            className="w-full"
            disabled={verifyingEmail}
          >
            تسجيل
          </Button>
        )}
      </form>
    </Form>
  );
};
