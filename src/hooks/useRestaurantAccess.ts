
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRestaurantAccess = (restaurantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOpenAccount = async () => {
    if (!restaurantId || restaurantId === ':id') {
      console.log('Invalid restaurant ID:', restaurantId);
      toast({
        variant: 'destructive',
        title: 'خطأ في الوصول',
        description: 'معرّف المطعم غير صحيح. الرجاء العودة واختيار مطعم صحيح.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if restaurant has credentials set up
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('restaurant_access')
        .select('*')
        .eq('restaurant_id', restaurantId);
      
      if (credentialsError) {
        throw credentialsError;
      }
      
      // If credentials exist (array has items), simulate login
      if (credentialsData && credentialsData.length > 0) {
        localStorage.setItem('restaurantId', restaurantId);
        localStorage.setItem('isRestaurantLogin', 'true');
        
        toast({
          title: "تم فتح حساب المطعم",
          description: "تم تسجيل الدخول إلى حساب المطعم بنجاح",
        });
        
        navigate('/restaurant/dashboard');
      } else {
        // No credentials, alert user
        toast({
          variant: "destructive",
          title: "لم يتم إعداد الحساب بعد",
          description: "يجب على مدير المطعم إعداد كلمة المرور أولاً",
        });
      }
    } catch (error: any) {
      console.error("Error accessing restaurant account:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الوصول إلى حساب المطعم",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleOpenAccount,
    isLoading
  };
};
