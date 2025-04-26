
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
      // 1. التحقق من بيانات الاعتماد باستخدام وظيفة authenticate_restaurant
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
      
      // 2. التحقق المباشر من جدول restaurant_access للمديرين
      const { data: accessData } = await supabase
        .from('restaurant_access')
        .select('restaurant_id, password_hash, email')
        .eq('email', email)
        .single();

      console.log('Direct database check for restaurant access:', accessData);

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
      
      // 3. التحقق من أعضاء فريق المخزن في company_members
      const { data: teamMemberData } = await supabase
        .from('company_members')
        .select('id, company_id, name, email, role, phone')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();
        
      console.log('Team member check:', teamMemberData);
      
      // التحقق من كلمة المرور في restaurant_access لعضو الفريق
      if (teamMemberData) {
        const { data: memberAccessData } = await supabase
          .from('restaurant_access')
          .select('password_hash')
          .eq('email', email)
          .maybeSingle();
          
        console.log('Team member password check:', memberAccessData);
        
        if (memberAccessData && memberAccessData.password_hash === password) {
          localStorage.setItem('restaurantId', teamMemberData.company_id);
          localStorage.setItem('isRestaurantLogin', 'true');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', teamMemberData.name);
          localStorage.setItem('userRole', teamMemberData.role);
          
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: `مرحباً ${teamMemberData.name} في نظام إدارة المخزن`,
          });
          
          navigate('/restaurant/dashboard');
          return;
        }
      }
      
      // 4. تسجيل دخول تجريبي
      if (email === 'admin@restaurant-system.com' && password === 'admin123') {
        const demoRestaurantId = '00000000-0000-0000-0000-000000000000';
        localStorage.setItem('restaurantId', demoRestaurantId);
        localStorage.setItem('isRestaurantLogin', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', 'مستخدم تجريبي');
        localStorage.setItem('userRole', 'admin');
        
        toast({
          title: "تم تسجيل الدخول بنجاح (وضع تجريبي)",
          description: "مرحباً بك في نظام إدارة المطعم - الوضع التجريبي",
        });
        
        navigate('/restaurant/dashboard');
        return;
      }
      
      // 5. إذا وصلنا إلى هنا، فبيانات الاعتماد غير صحيحة
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
