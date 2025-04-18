
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MobileProductGrid from '@/components/mobile/inventory/MobileProductGrid';
import MobileInventoryHeader from '@/components/mobile/inventory/MobileInventoryHeader';
import MobileInventoryEmpty from '@/components/mobile/inventory/MobileInventoryEmpty';
import MobileProductSkeleton from '@/components/mobile/inventory/MobileProductSkeleton';
import { Product } from '@/types';

// Define a type for the raw product data from Supabase
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

const MobileInventory = () => {
  const restaurantId = localStorage.getItem('restaurantId');
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['mobile-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', restaurantId)
        .eq('status', 'active');
        
      if (error) throw error;
      
      // Transform the Supabase data to match our Product type
      const transformedProducts: Product[] = (data as SupabaseProduct[]).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit || '',
        quantity: item.quantity,
        expiryDate: new Date(item.expiry_date),
        entryDate: new Date(item.production_date),
        restaurantId: item.company_id,
        restaurantName: '', // This field is not available in the data
        addedBy: '', // This field is not available in the data
        status: 'active', // We're already filtering for active products
        imageUrl: item.image_url || undefined
      }));
      
      return transformedProducts;
    },
  });

  return (
    <div className="pb-16">
      <MobileInventoryHeader />
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 p-4">
          {[...Array(4)].map((_, index) => (
            <MobileProductSkeleton key={index} />
          ))}
        </div>
      ) : !products?.length ? (
        <MobileInventoryEmpty />
      ) : (
        <MobileProductGrid products={products} />
      )}
    </div>
  );
};

export default MobileInventory;
