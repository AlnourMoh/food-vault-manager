
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import EmptyInventory from '@/components/inventory/EmptyInventory';
import { Button } from '@/components/ui/button';
import { BarcodeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define a type for the raw product data from Supabase
interface RawProductData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiry_date: string;
  production_date: string;
  company_id: string;
  status: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
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
          const transformedProducts: Product[] = (data as RawProductData[]).map(item => {
            return {
              id: item.id,
              name: item.name,
              category: item.category,
              quantity: item.quantity,
              expiryDate: new Date(item.expiry_date),
              entryDate: new Date(item.production_date),
              restaurantId: item.company_id,
              status: item.status as "active" | "expired" | "removed",
              imageUrl: item.image_url || getPlaceholderImage(item.category), // Use actual image URL if available, otherwise use placeholder
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

  // Function to get placeholder image based on category
  const getPlaceholderImage = (category: string): string => {
    switch (category) {
      case 'خضروات':
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
      case 'لحوم':
        return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=200";
      case 'بهارات':
        return "https://images.unsplash.com/photo-1532336414046-2a0e3a1dd7e5?q=80&w=200";
      case 'بقالة':
        return "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=200";
      default:
        return "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=200";
    }
  };

  // Function to navigate to scanner
  const goToScanner = () => {
    navigate('/scan');
  };

  // Choose the appropriate layout based on the route
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="rtl space-y-6">
        <InventoryHeader addProductPath={addProductPath} />
        
        {/* إضافة زر المسح في أعلى الصفحة */}
        <div className="flex justify-center mb-4">
          <Button 
            onClick={goToScanner} 
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
          >
            <BarcodeIcon className="h-5 w-5" />
            مسح المنتجات
          </Button>
        </div>
        
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
