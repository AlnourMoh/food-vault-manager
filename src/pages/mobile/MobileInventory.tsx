
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MobileProductGrid from '@/components/mobile/inventory/MobileProductGrid';
import MobileInventoryHeader from '@/components/mobile/inventory/MobileInventoryHeader';
import MobileInventoryEmpty from '@/components/mobile/inventory/MobileInventoryEmpty';
import MobileProductSkeleton from '@/components/mobile/inventory/MobileProductSkeleton';
import { Product } from '@/types';

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
      return data as Product[];
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
