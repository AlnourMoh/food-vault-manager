
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RestaurantData {
  id: string;
  name: string;
  email: string;
}

export const useRestaurantData = (restaurantId: string | undefined) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId || restaurantId === ':id') {
        console.log('Invalid restaurant ID:', restaurantId);
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log('Fetching restaurant with ID:', restaurantId);
        
        const { data, error } = await supabase
          .from('companies')
          .select('name, email')
          .eq('id', restaurantId)
          .single();

        if (error) {
          console.error("Error fetching restaurant:", error);
          toast({
            variant: "destructive",
            title: "خطأ في جلب بيانات المطعم",
            description: error.message,
          });
          return;
        }

        if (data) {
          setRestaurantName(data.name);
          setEmail(data.email || '');
        }
      } catch (error: any) {
        console.error("Unexpected error fetching restaurant:", error);
        toast({
          variant: "destructive",
          title: "خطأ غير متوقع",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, toast]);

  const updateEmail = (newEmail: string) => {
    setEmail(newEmail);
  };

  return {
    restaurantName,
    email,
    updateEmail,
    isLoading
  };
};
