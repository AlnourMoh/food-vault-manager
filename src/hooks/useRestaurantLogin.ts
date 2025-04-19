
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

    try {
      const { data, error } = await supabase.rpc('authenticate_restaurant', {
        p_email: email,
        p_password: password
      });

      if (error) {
        throw error;
      }

      const authData = data as unknown as AuthResponse;
      
      if (authData && authData.authenticated) {
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

  return { handleLogin, isLoading };
};
