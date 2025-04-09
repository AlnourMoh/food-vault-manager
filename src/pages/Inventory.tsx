
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';
import { Product } from '@/types';

const Inventory = () => {
  const navigate = useNavigate();
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
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', restaurantId)
          .eq('status', 'active');
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match our Product type
        const transformedProducts = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          expiryDate: new Date(item.expiry_date),
          entryDate: new Date(item.production_date),
          restaurantId: item.company_id,
          status: item.status,
          imageUrl: item.imageUrl || '',
          restaurantName: '',
          addedBy: '',
          unit: ''
        }));
        
        setProducts(transformedProducts);
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">المخزون</h1>
          <Button onClick={() => navigate(addProductPath)} className="bg-fvm-primary hover:bg-fvm-primary-light">
            <Plus className="h-4 w-4 mr-2" /> إضافة منتج
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fvm-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium">لا توجد منتجات في المخزون</h3>
            <p className="text-gray-500 mt-2">قم بإضافة منتجات جديدة للبدء</p>
            <Button onClick={() => navigate(addProductPath)} className="mt-4 bg-fvm-primary hover:bg-fvm-primary-light">
              <Plus className="h-4 w-4 mr-2" /> إضافة منتج جديد
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm">
                {product.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">التصنيف:</span> {product.category}</p>
                    <p><span className="font-medium">الكمية:</span> {product.quantity}</p>
                    <p><span className="font-medium">تاريخ الانتهاء:</span> {product.expiryDate.toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Inventory;
