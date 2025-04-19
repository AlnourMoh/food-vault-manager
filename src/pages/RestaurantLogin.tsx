
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';
import { Button } from '@/components/ui/button';
import { RestaurantSignup } from '@/components/auth/RestaurantSignup';

const RestaurantLogin = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="rtl min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {showSignup ? 'تسجيل عضو جديد' : 'تسجيل الدخول للمطعم'}
          </CardTitle>
          <CardDescription className="text-center">
            {showSignup 
              ? 'أدخل بريدك الإلكتروني للتحقق من إمكانية التسجيل'
              : 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى نظام إدارة المطعم'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSignup ? <RestaurantSignup /> : <LoginForm />}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {!showSignup && <ForgotPasswordDialog />}
          <Button 
            variant="ghost" 
            onClick={() => setShowSignup(!showSignup)}
            className="text-sm"
          >
            {showSignup ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'عضو جديد؟ تسجيل'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RestaurantLogin;
