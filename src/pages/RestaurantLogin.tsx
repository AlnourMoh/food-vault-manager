
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface AuthResponse {
  authenticated: boolean;
  restaurant_id: string;
}

const RestaurantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use raw SQL query to safely fetch the restaurant credentials without type errors
      const { data, error } = await supabase.rpc('authenticate_restaurant', {
        p_email: email,
        p_password: password
      });

      if (error) {
        throw error;
      }

      // First cast data to unknown, then to our interface to fix TypeScript error
      const authData = data as unknown as AuthResponse;
      
      if (authData && authData.authenticated) {
        // Store restaurant ID in localStorage for now (in a real app, use secure auth)
        localStorage.setItem('restaurantId', authData.restaurant_id);
        localStorage.setItem('isRestaurantLogin', 'true');
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة المطعم",
        });
        
        navigate('/restaurant/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: "بيانات الاعتماد غير صحيحة",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
      });
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      // Send forgot password request to the restaurant admin
      const { error } = await supabase.rpc('request_password_reset', {
        p_email: forgotPasswordEmail
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب استعادة كلمة المرور إلى إدارة المطعم",
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الطلب",
        description: error.message || "حدث خطأ أثناء محاولة إرسال طلب استعادة كلمة المرور",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rtl min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول للمطعم</CardTitle>
          <CardDescription className="text-center">أدخل بيانات الاعتماد الخاصة بك للوصول إلى نظام إدارة المطعم</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="البريد الإلكتروني" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
              <Input 
                id="password" 
                type="password" 
                placeholder="كلمة المرور" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white"
              disabled={isLoading}
            >
              {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-sm text-primary hover:text-primary/80"
              >
                نسيت كلمة المرور؟
              </Button>
            </DialogTrigger>
            <DialogContent className="rtl">
              <DialogHeader>
                <DialogTitle>استعادة كلمة المرور</DialogTitle>
                <DialogDescription>
                  أدخل بريدك الإلكتروني وسيتم إرسال طلب استعادة كلمة المرور إلى إدارة المطعم
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleForgotPassword}
                  disabled={isLoading || !forgotPasswordEmail}
                  className="w-full"
                >
                  {isLoading ? "جاري الإرسال..." : "إرسال طلب استعادة كلمة المرور"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-sm"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RestaurantLogin;
