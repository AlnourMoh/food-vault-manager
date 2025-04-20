
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // التحقق من وجود جلسة مسؤول نشطة عند تحميل الصفحة
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // هنا نضيف تأخيرًا بسيطًا لمحاكاة الاتصال بالخادم
    setTimeout(() => {
      console.log('محاولة تسجيل دخول بـ:', { email, password });
      
      // التحقق من بيانات تسجيل الدخول للمسؤول
      if (email === 'admin@system.com' && password === 'admin123') {
        console.log('تسجيل الدخول ناجح');
        
        // تخزين معلومات المسؤول في localStorage
        localStorage.setItem('isAdminLogin', 'true');
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة المطاعم",
        });
        
        // التوجيه إلى صفحة لوحة تحكم المسؤول
        navigate('/admin/dashboard');
      } else {
        console.log('فشل تسجيل الدخول: بيانات اعتماد غير صحيحة');
        
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: "بيانات الاعتماد غير صحيحة",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="rtl min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            تسجيل دخول المسؤول
          </CardTitle>
          <CardDescription className="text-center">
            أدخل بيانات الاعتماد الخاصة بك للوصول إلى نظام إدارة المطاعم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@system.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/')}>
            العودة إلى الصفحة الرئيسية
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
