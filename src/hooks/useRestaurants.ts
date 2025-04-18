
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Restaurant } from '@/types';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const { toast } = useToast();

  const fetchRestaurants = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, email, phone, address, created_at, manager')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRestaurants = data.map((restaurant: any) => ({
        ...restaurant,
        isActive: true,
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

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', restaurantToDelete.id);

      if (error) throw error;

      toast({
        title: "تم حذف المطعم",
        description: `تم حذف المطعم ${restaurantToDelete.name} بنجاح.`,
      });
      
      fetchRestaurants();
    } catch (error: any) {
      console.error("Error deleting restaurant:", error);
      toast({
        variant: "destructive",
        title: "خطأ في حذف المطعم",
        description: error.message || "حدث خطأ أثناء محاولة حذف المطعم. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setRestaurantToDelete(null);
    }
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return {
    restaurants,
    isLoading,
    deleteDialogOpen,
    restaurantToDelete,
    setDeleteDialogOpen,
    handleDeleteClick,
    handleDeleteConfirm,
  };
};
