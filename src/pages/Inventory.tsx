
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import EmptyInventory from '@/components/inventory/EmptyInventory';

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine current route type
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const addProductPath = isRestaurantRoute ? '/restaurant/products/add' : '/products/add';

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const restaurantId = localStorage.getItem('restaurantId');
        
        if (!restaurantId) {
          toast({
            title: "خطأ في تحميل المنتجات",
            description: "لم يتم العثور على معرف المطعم",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Fetching products for restaurant:', restaurantId);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', restaurantId)
          .eq('status', 'active');
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Fetched products:', data);
        
        if (data) {
          // Transform the data to match our Product type
          const transformedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            expiryDate: new Date(item.expiry_date),
            entryDate: new Date(item.production_date),
            restaurantId: item.company_id,
            status: item.status as "active" | "expired" | "removed",
            imageUrl: null, // Set as null by default, since there's no imageUrl column in the database
            restaurantName: '',
            addedBy: '',
            unit: ''
          }));
          
          setProducts(transformedProducts);
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast({
          title: "خطأ في تحميل المنتجات",
          description: error.message || "حدث خطأ أثناء تحميل المنتجات",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  // Choose the appropriate layout based on the route
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="rtl space-y-6">
        <InventoryHeader addProductPath={addProductPath} />
        
        {isLoading ? (
          <ProductGrid products={[]} isLoading={true} isRestaurantRoute={isRestaurantRoute} />
        ) : products.length === 0 ? (
          <EmptyInventory addProductPath={addProductPath} />
        ) : (
          <ProductGrid 
            products={products} 
            isLoading={false} 
            isRestaurantRoute={isRestaurantRoute} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Inventory;
