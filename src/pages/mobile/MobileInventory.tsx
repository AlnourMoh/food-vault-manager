
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useServerConnection } from '@/hooks/network/useServerConnection';
import NetworkErrorView from '@/components/mobile/NetworkErrorView';
import MobileInventoryHeader from '@/components/mobile/inventory/MobileInventoryHeader';
import MobileInventoryContent from '@/components/mobile/inventory/MobileInventoryContent';
import { InventoryProvider, useInventory } from '@/contexts/InventoryContext';
import { useMobileProducts } from '@/hooks/products/useMobileProducts';

const InventoryContent = () => {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [showNetworkError, setShowNetworkError] = useState(false);
  const { forceReconnect } = useServerConnection();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    categories,
    setProducts
  } = useInventory();

  const { data: products, isLoading, error, refetch } = useMobileProducts(retryAttempt);

  // Delay showing error to prevent flickering
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (hasError) {
      timeoutId = window.setTimeout(() => {
        setShowNetworkError(true);
      }, 1000);
    } else {
      setShowNetworkError(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasError]);

  useEffect(() => {
    if (products) {
      setProducts(products);
      if (hasError) {
        toast({
          title: "تم استرجاع البيانات بنجاح",
          description: "تم تحميل بيانات المخزون بنجاح",
        });
        setHasError(false);
      }
    }
  }, [products, hasError, setProducts]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error);
      setErrorDetails(error instanceof Error ? error.message : 'خطأ غير معروف في جلب البيانات');
      setHasError(true);
    }
  }, [error]);

  const handleRetry = async () => {
    console.log('Retrying product fetch');
    
    toast({
      title: "إعادة محاولة تحميل البيانات",
      description: "جاري تحميل بيانات المخزون مرة أخرى",
    });
    
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

  if (showNetworkError) {
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
      
      <MobileInventoryContent
        products={products}
        isLoading={isLoading}
        onProductUpdate={refetch}
        filteredProducts={filteredProducts}
      />
    </div>
  );
};

const MobileInventory = () => {
  return (
    <InventoryProvider>
      <InventoryContent />
    </InventoryProvider>
  );
};

export default MobileInventory;
