
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
  // Never show the network error by default
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
    // Always skip error screen even for non-authenticated users
    setShowNetworkError(false);
    setErrorTransitionActive(false);
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
      
      // Show toast instead of full error screen
      toast({
        variant: "destructive",
        title: "خطأ في جلب البيانات",
        description: "سيتم إعادة المحاولة تلقائيًا"
      });
    }
  }, [error]);

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

  // Always show inventory UI and never show the error screen
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
