
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  BarcodeScan, 
  ShoppingCart, 
  Calendar, 
  AlertTriangle,
  ArrowUpRight,
  Utensils
} from 'lucide-react';

const MobileHome = () => {
  const [restaurantName, setRestaurantName] = useState<string>('المطعم');
  const [stats, setStats] = useState({
    totalProducts: 0,
    expiringProducts: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
          
          // Get expiring products (within 7 days)
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
          
          const { data: expiringProducts, error: expiringError } = await supabase
            .from('products')
            .select('id')
            .eq('company_id', restaurantId)
            .lt('expiry_date', sevenDaysFromNow.toISOString())
            .gt('expiry_date', new Date().toISOString());
            
          if (expiringError) throw expiringError;
          
          setStats({
            totalProducts: products?.length || 0,
            expiringProducts: expiringProducts?.length || 0
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
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/10">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <ShoppingCart className="h-8 w-8 text-primary mb-1" />
            <span className="text-2xl font-bold">{stats.totalProducts}</span>
            <span className="text-xs text-muted-foreground">إجمالي المنتجات</span>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/10">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <AlertTriangle className="h-8 w-8 text-destructive mb-1" />
            <span className="text-2xl font-bold">{stats.expiringProducts}</span>
            <span className="text-xs text-muted-foreground">منتجات قاربت على الانتهاء</span>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold">العمليات السريعة</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/mobile/scan')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <BarcodeScan className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium">مسح باركود</span>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/mobile/inventory')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium">تصفح المخزون</span>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/mobile/expiry')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="p-3 bg-destructive/10 rounded-full mb-3">
              <Calendar className="h-6 w-6 text-destructive" />
            </div>
            <span className="font-medium">المنتجات المنتهية</span>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/mobile/add-product')}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium">إضافة منتج</span>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>المنتجات قاربت على الانتهاء</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.expiringProducts > 0 ? (
            <p className="text-sm text-muted-foreground">
              لديك {stats.expiringProducts} منتجات ستنتهي خلال 7 أيام. تحقق منها الآن لتجنب الهدر.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              ليس لديك منتجات على وشك الانتهاء خلال 7 أيام القادمة.
            </p>
          )}
          
          <Button 
            variant="link" 
            className="p-0 h-auto mt-2" 
            onClick={() => navigate('/mobile/expiry')}
          >
            عرض المنتجات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileHome;
