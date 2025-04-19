import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart } from 'lucide-react';

const MobileHome = () => {
  const [restaurantName, setRestaurantName] = useState<string>('المطعم');
  const [stats, setStats] = useState({
    totalProducts: 0,
  });
  const navigate = useNavigate();
  
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
    
    const fetchStats = async () => {
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (restaurantId) {
        try {
          // Get total products
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('company_id', restaurantId);
            
          if (productsError) throw productsError;
          
          setStats({
            totalProducts: products?.length || 0,
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    };
    
    fetchRestaurantInfo();
    fetchStats();
  }, []);
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-medium">مرحباً بك في</h2>
        <h1 className="text-3xl font-bold">{restaurantName}</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-primary/10">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <ShoppingCart className="h-8 w-8 text-primary mb-1" />
            <span className="text-2xl font-bold">{stats.totalProducts}</span>
            <span className="text-xs text-muted-foreground">إجمالي المنتجات</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileHome;
