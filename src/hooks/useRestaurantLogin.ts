
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthResponse {
  authenticated: boolean;
  restaurant_id: string;
}

export const useRestaurantLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Attempting login with:', { email });

    try {
      // التحقق من بيانات الاعتماد باستخدام وظيفة authenticate_restaurant
      const { data, error } = await supabase.rpc('authenticate_restaurant', {
        p_email: email,
        p_password: password
      });

      console.log('Authentication response:', data, error);

      if (error) {
        throw error;
      }

      const authData = data as unknown as AuthResponse;
      
      if (authData && authData.authenticated) {
        // تسجيل دخول ناجح
        localStorage.setItem('restaurantId', authData.restaurant_id);
        localStorage.setItem('isRestaurantLogin', 'true');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة المطعم",
        });
        
        navigate('/restaurant/dashboard');
        return;
      } 
      
      // التحقق المباشر من جدول restaurant_access
      const { data: accessData } = await supabase
        .from('restaurant_access')
        .select('restaurant_id, password_hash, email')
        .eq('email', email)
        .single();

      console.log('Direct database check:', accessData);

      if (accessData && accessData.password_hash === password) {
        localStorage.setItem('restaurantId', accessData.restaurant_id);
        localStorage.setItem('isRestaurantLogin', 'true');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة المطعم",
        });
        
        navigate('/restaurant/dashboard');
        return;
      } 
      
      // تسجيل دخول تجريبي
      if (email === 'admin@restaurant-system.com' && password === 'admin123') {
        const demoRestaurantId = '00000000-0000-0000-0000-000000000000';
        localStorage.setItem('restaurantId', demoRestaurantId);
        localStorage.setItem('isRestaurantLogin', 'true');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "تم تسجيل الدخول بنجاح (وضع تجريبي)",
          description: "مرحباً بك في نظام إدارة المطعم - الوضع التجريبي",
        });
        
        navigate('/restaurant/dashboard');
        return;
      }
      
      // إذا وصلنا إلى هنا، فبيانات الاعتماد غير صحيحة
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "بيانات الاعتماد غير صحيحة",
      });

    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
