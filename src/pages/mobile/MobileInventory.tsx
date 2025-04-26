
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MobileProductGrid from '@/components/mobile/inventory/MobileProductGrid';
import MobileInventoryHeader from '@/components/mobile/inventory/MobileInventoryHeader';
import MobileInventoryEmpty from '@/components/mobile/inventory/MobileInventoryEmpty';
import MobileProductSkeleton from '@/components/mobile/inventory/MobileProductSkeleton';
import NetworkErrorView from '@/components/mobile/NetworkErrorView';
import { Product } from '@/types';

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
  console.log('MobileInventory component rendering');
  const restaurantId = localStorage.getItem('restaurantId');
  console.log('Restaurant ID from localStorage:', restaurantId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['mobile-products'],
    queryFn: async () => {
      console.log('Fetching products for restaurant ID:', restaurantId);
      if (!restaurantId) {
        console.error('No restaurant ID found in localStorage');
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', restaurantId)
          .eq('status', 'active');
          
        if (error) {
          console.error('Error fetching products:', error);
          setHasError(true);
          throw error;
        }
        
        console.log('Products fetched from Supabase:', data);
        
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
        setHasError(false);
        return transformedProducts;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setHasError(true);
        throw error;
      }
    },
    retry: 1,
  });

  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  console.log('Filtered products:', filteredProducts);
  console.log('Is loading:', isLoading);

  // Handle retry when error occurs
  const handleRetry = () => {
    setHasError(false);
    refetch();
  };

  // If there is an error, show network error view
  if (hasError) {
    return <NetworkErrorView onRetry={handleRetry} />;
  }

  return (
    <div className="pb-16">
      <MobileInventoryHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 p-4">
          {[...Array(4)].map((_, index) => (
            <MobileProductSkeleton key={index} />
          ))}
        </div>
      ) : !filteredProducts.length ? (
        <MobileInventoryEmpty />
      ) : (
        <MobileProductGrid 
          products={filteredProducts} 
          onProductUpdate={refetch}
        />
      )}
    </div>
  );
};

export default MobileInventory;
