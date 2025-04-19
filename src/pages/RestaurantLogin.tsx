
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';

const RestaurantLogin = () => {
  return (
    <div className="rtl min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول للمطعم</CardTitle>
          <CardDescription className="text-center">أدخل بيانات الاعتماد الخاصة بك للوصول إلى نظام إدارة المطعم</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <ForgotPasswordDialog />
          {/* Removed the "Back to Home Page" button */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RestaurantLogin;
