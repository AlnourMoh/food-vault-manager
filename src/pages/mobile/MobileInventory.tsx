
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useServerConnection } from '@/hooks/network/useServerConnection';
import MobileInventoryHeader from '@/components/mobile/inventory/MobileInventoryHeader';
import MobileInventoryContent from '@/components/mobile/inventory/MobileInventoryContent';
import { InventoryProvider, useInventory } from '@/contexts/InventoryContext';
import { useMobileProducts } from '@/hooks/products/useMobileProducts';

const InventoryContent = () => {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [hasError, setHasError] = useState(false);
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

  // تعيين المنتجات عند استلامها من API
  useEffect(() => {
    if (products) {
      console.log('Setting products in inventory context:', products);
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

  // إدارة الخطأ
  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error);
      setHasError(true);
      
      toast({
        variant: "destructive",
        title: "خطأ في جلب البيانات",
        description: "سيتم إعادة المحاولة تلقائيًا"
      });
    }
  }, [error]);

  // إعادة محاولة جلب البيانات
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

  console.log('Inventory render - products:', products);
  console.log('Inventory render - filteredProducts:', filteredProducts);
  console.log('Inventory render - categories:', categories);

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
        onProductUpdate={handleRetry}
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
