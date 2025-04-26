
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
  const [errorTransitionActive, setErrorTransitionActive] = useState(false);
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

  // For authenticated users, we'll always try to show the inventory interface
  // even if there are network errors
  const isAuthenticated = localStorage.getItem('isRestaurantLogin') === 'true';

  useEffect(() => {
    // If authenticated, never show network error screen
    if (isAuthenticated) {
      setShowNetworkError(false);
      setErrorTransitionActive(false);
      return;
    }

    let timeoutId: number | undefined;
    
    if (hasError) {
      setErrorTransitionActive(true);
      timeoutId = window.setTimeout(() => {
        setShowNetworkError(true);
      }, 1500);
    } else {
      setShowNetworkError(false);
      // Add additional delay before allowing transitions again
      setTimeout(() => {
        setErrorTransitionActive(false);
      }, 1000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasError, isAuthenticated]);

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
      
      // Only set error if not authenticated
      if (!isAuthenticated) {
        setHasError(true);
      }
    }
  }, [error, isAuthenticated]);

  const handleRetry = async () => {
    console.log('Retrying product fetch');
    
    toast({
      title: "إعادة محاولة تحميل البيانات",
      description: "جاري تحميل بيانات المخزون مرة أخرى",
    });
    
    // Prevent multiple rapid reconnections
    if (!errorTransitionActive) {
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
    }
  };

  // For authenticated users, always show the inventory UI
  if (showNetworkError && !isAuthenticated) {
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
