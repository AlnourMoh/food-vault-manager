
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
          // Add appropriate placeholder images based on category
          const transformedProducts: Product[] = data.map(item => {
            // Generate a relevant placeholder based on category
            let placeholderImage = null;
            if (item.category === 'خضروات') {
              placeholderImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
            } else if (item.category === 'لحوم') {
              placeholderImage = "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f";
            } else if (item.category === 'بهارات') {
              placeholderImage = "https://images.unsplash.com/photo-1532336414046-2a0e3a1dd7e5";
            } else if (item.category === 'بقالة') {
              placeholderImage = "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f";
            } else {
              // Default placeholder for other categories
              placeholderImage = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9";
            }
            
            return {
              id: item.id,
              name: item.name,
              category: item.category,
              quantity: item.quantity,
              expiryDate: new Date(item.expiry_date),
              entryDate: new Date(item.production_date),
              restaurantId: item.company_id,
              status: item.status as "active" | "expired" | "removed",
              imageUrl: placeholderImage, // Use placeholder image based on category
              restaurantName: '',
              addedBy: '',
              unit: ''
            };
          });
          
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
