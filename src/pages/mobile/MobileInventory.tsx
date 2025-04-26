
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MobileProductGrid from '@/components/mobile/inventory/MobileProductGrid';
import MobileInventoryHeader from '@/components/mobile/inventory/MobileInventoryHeader';
import MobileInventoryEmpty from '@/components/mobile/inventory/MobileInventoryEmpty';
import MobileProductSkeleton from '@/components/mobile/inventory/MobileProductSkeleton';
import NetworkErrorView from '@/components/mobile/NetworkErrorView';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useServerConnection } from '@/hooks/network/useServerConnection';

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
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const { forceReconnect } = useServerConnection();
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['mobile-products', restaurantId, retryAttempt],
    queryFn: async () => {
      console.log('Fetching products for restaurant ID:', restaurantId);
      if (!restaurantId) {
        const errorMsg = 'لم يتم العثور على معرف المطعم في الذاكرة المحلية';
        console.error(errorMsg);
        setErrorDetails(errorMsg);
        setHasError(true);
        throw new Error(errorMsg);
      }
      
      try {
        console.log('Making API request to Supabase');
        const startTime = Date.now();
        
        // Set up a timeout for the request
        const timeoutDuration = 10000; // 10 seconds
        
        const fetchPromise = supabase
          .from('products')
          .select('*')
          .eq('company_id', restaurantId)
          .eq('status', 'active');
          
        // Use Promise.race to implement timeout
        const { data, error } = await Promise.race([
          fetchPromise,
          new Promise<{data: null, error: Error}>((_resolve, reject) => {
            setTimeout(() => {
              reject({ data: null, error: new Error('Request timed out after 10 seconds') });
            }, timeoutDuration);
          })
        ]);
          
        const requestTime = Date.now() - startTime;
        console.log(`API request completed in ${requestTime}ms`);
          
        if (error) {
          console.error('Error fetching products:', error);
          setErrorDetails(`خطأ في جلب المنتجات: ${error.message}`);
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
        setErrorDetails(error instanceof Error ? error.message : 'خطأ غير معروف في جلب البيانات');
        setHasError(true);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Handle successful data fetching after previous error
  useEffect(() => {
    if (products && hasError) {
      toast({
        title: "تم استرجاع البيانات بنجاح",
        description: "تم تحميل بيانات المخزون بنجاح",
      });
      setHasError(false);
    }
  }, [products, hasError]);

  // Add effect to auto-retry on network reconnect
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      if (navigator.onLine && hasError) {
        console.log('Device came online, retrying product fetch');
        handleRetry();
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    return () => window.removeEventListener('online', handleOnlineStatusChange);
  }, [hasError]);

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
  const handleRetry = async () => {
    console.log('Retrying product fetch');
    
    toast({
      title: "إعادة محاولة تحميل البيانات",
      description: "جاري تحميل بيانات المخزون مرة أخرى",
    });
    
    // First try to check server connection
    const serverConnected = await forceReconnect();
    
    if (serverConnected) {
      setRetryAttempt(prev => prev + 1);
      setHasError(false);
      refetch();
    } else {
      toast({
        title: "فشل الاتصال بالخادم",
        description: "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  // If there is an error, show network error view
  if (hasError) {
    return (
      <NetworkErrorView 
        onRetry={handleRetry} 
        additionalInfo={`فشل في تحميل بيانات المخزون. ${errorDetails}`}
      />
    );
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
