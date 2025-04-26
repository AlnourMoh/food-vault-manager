
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SupabaseProduct {
  id: string;
  name: string;
  category: string;
  unit: string | null;
  quantity: number;
  expiry_date: string;
  production_date: string;
  company_id: string;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useMobileProducts = (retryAttempt: number) => {
  const restaurantId = localStorage.getItem('restaurantId');
  
  return useQuery({
    queryKey: ['mobile-products', restaurantId, retryAttempt],
    queryFn: async () => {
      console.log('Fetching products for restaurant ID:', restaurantId);
      if (!restaurantId) {
        const errorMsg = 'لم يتم العثور على معرف المطعم في الذاكرة المحلية';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      try {
        console.log('Making API request to Supabase');
        const startTime = Date.now();
        
        // Use Promise.race to implement timeout
        const result = await Promise.race([
          supabase
            .from('products')
            .select('*')
            .eq('company_id', restaurantId)
            .eq('status', 'active'),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Request timed out after 10 seconds'));
            }, 10000);
          })
        ]);
          
        const requestTime = Date.now() - startTime;
        console.log(`API request completed in ${requestTime}ms`);
        
        if ('error' in result && result.error) {
          console.error('Error fetching products:', result.error);
          throw result.error;
        }
        
        const data = 'data' in result ? result.data : null;
        console.log('Products fetched from Supabase:', data);
        
        if (!data) {
          throw new Error('لم يتم استلام بيانات من الخادم');
        }
        
        const transformedProducts: Product[] = (data as SupabaseProduct[]).map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          unit: item.unit || '',
          quantity: item.quantity,
          expiryDate: new Date(item.expiry_date),
          entryDate: new Date(item.production_date),
          restaurantId: item.company_id,
          restaurantName: '',
          addedBy: '',
          status: 'active',
          imageUrl: item.image_url || undefined
        }));
        
        console.log('Transformed products:', transformedProducts);
        return transformedProducts;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
