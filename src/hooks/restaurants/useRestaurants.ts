
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Restaurant } from '@/types';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRestaurants = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our restaurant interface
      const formattedRestaurants = data.map((restaurant: any) => ({
        ...restaurant,
        isActive: true, // Assume all fetched restaurants are active for now
        manager: "مدير المطعم", // Placeholder for now
        registrationDate: restaurant.created_at
      }));

      setRestaurants(formattedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        variant: "destructive",
        title: "خطأ في جلب بيانات المطاعم",
        description: "حدث خطأ أثناء محاولة جلب بيانات المطاعم. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return {
    restaurants,
    isLoading,
    refreshRestaurants: fetchRestaurants
  };
};
