import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart } from 'lucide-react';
import MobileProductGrid from '@/components/mobile/inventory/MobileProductGrid';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';

const MobileHome = () => {
  const [restaurantName, setRestaurantName] = useState<string>('المطعم');
  const [stats, setStats] = useState({
    totalProducts: 0,
  });
  
  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (restaurantId) {
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('name')
            .eq('id', restaurantId)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setRestaurantName(data.name);
          }
        } catch (error) {
          console.error('Error fetching restaurant name:', error);
        }
      }
    };
    
    fetchRestaurantInfo();
  }, []);
  
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['mobile-products'],
    queryFn: async () => {
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', restaurantId)
        .eq('status', 'active');
        
      if (error) throw error;
      
      if (data) {
        const transformedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          unit: item.unit || '',
          quantity: item.quantity,
          expiryDate: new Date(item.expiry_date),
          entryDate: new Date(item.created_at),
          restaurantId: item.company_id,
          restaurantName: '',
          addedBy: '',
          status: 'active',
          imageUrl: item.image_url
        }));
        
        setStats({ totalProducts: transformedProducts.length });
        return transformedProducts;
      }
      
      return [];
    },
  });
  
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="space-y-6">
        <div className="px-4 md:px-6 space-y-2">
          <h2 className="text-xl font-medium">مرحباً بك في</h2>
          <h1 className="text-3xl font-bold">{restaurantName}</h1>
        </div>
        
        <div className="px-4 md:px-6">
          <Card className="bg-primary/10">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <ShoppingCart className="h-8 w-8 text-primary mb-1" />
              <span className="text-2xl font-bold">{stats.totalProducts}</span>
              <span className="text-xs text-muted-foreground">إجمالي المنتجات</span>
            </CardContent>
          </Card>
        </div>
        
        <div className="px-4 md:px-6">
          <h2 className="text-xl font-bold mb-4">المنتجات</h2>
          
          {products && products.length > 0 ? (
            <MobileProductGrid 
              products={products} 
              onProductUpdate={refetch}
            />
          ) : (
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                لا توجد منتجات لعرضها
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
