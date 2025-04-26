
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useMobileProducts = (retryAttempt: number) => {
  return useQuery({
    queryKey: ['mobileProducts', retryAttempt],
    queryFn: async () => {
      console.log('Fetching mobile products...');
      
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        throw new Error('Restaurant ID not found');
      }
      
      // إضافة تأخير قصير للتأكد من قراءة البيانات من التخزين المؤقت
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', restaurantId)
        .eq('status', 'active');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No products found');
        return [];
      }
      
      console.log('Products fetched successfully:', data.length);
      
      const products: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || '',
        quantity: item.quantity || 0,
        expiryDate: new Date(item.expiry_date),
        entryDate: new Date(item.created_at || new Date()),
        restaurantId: item.company_id,
        restaurantName: '',
        addedBy: '',
        status: item.status as "active" | "expired" | "removed",
        imageUrl: item.image_url,
        unit: item.unit || ''
      }));
      
      return products;
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق قبل اعتبار البيانات قديمة
    retry: 2,
  });
};
