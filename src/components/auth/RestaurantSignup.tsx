
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const signupSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const RestaurantSignup = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const verifyEmail = async (email: string) => {
    console.log('Verifying email:', email);
    setVerifyingEmail(true);
    try {
      // أولاً نتحقق من جدول company_members
      const { data: member, error: memberError } = await supabase
        .from('company_members')
        .select('email')
        .eq('email', email)
        .single();

      if (memberError && memberError.code !== 'PGRST116') {
        console.error('Error checking company_members:', memberError);
        throw memberError;
      }

      // ثانياً نتحقق من جدول restaurant_access
      const { data: accessData, error: accessError } = await supabase
        .from('restaurant_access')
        .select('email, password_hash')
        .eq('email', email)
        .single();

      console.log('Access data from restaurant_access:', accessData);

      if (accessError && accessError.code !== 'PGRST116') {
        console.error('Error checking restaurant_access:', accessError);
        throw accessError;
      }

      // إذا وجدنا البريد في أحد الجدولين، نسمح بالتسجيل
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

  const onSubmit = async (data: SignupFormData) => {
    console.log('Form submitted:', data);
    if (!emailVerified) {
      await verifyEmail(data.email);
      return;
    }

    try {
      // تحديث كلمة المرور في جدول restaurant_access
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

      // إعادة تعيين النموذج
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل البريد الإلكتروني" 
                  {...field} 
                  disabled={emailVerified}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {emailVerified && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="أدخل كلمة المرور" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="أدخل كلمة المرور مرة أخرى" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={verifyingEmail}
        >
          {verifyingEmail ? 'جاري التحقق...' : emailVerified ? 'تسجيل' : 'تحقق من البريد الإلكتروني'}
        </Button>
      </form>
    </Form>
  );
};
