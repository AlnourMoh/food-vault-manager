
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  inventoryMovements: number;
  expiringProducts: number;
}

export const useDashboardData = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    inventoryMovements: 0,
    expiringProducts: 0
  });
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the user is viewing from a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShowMobileApp(isMobile);
  }, []);
  
  useEffect(() => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (restaurantId) {
      fetchDashboardStats(restaurantId);
    }
  }, []);
  
  const fetchDashboardStats = async (restaurantId: string) => {
    setLoading(true);
    try {
      // Get total products count
      const { count: totalProducts, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId)
        .eq('status', 'active');
      
      if (totalError) throw totalError;
      
      // Get low stock products count (quantity less than 5)
      const { count: lowStockProducts, error: lowStockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId)
        .eq('status', 'active')
        .lt('quantity', 5)
        .gt('quantity', 0);
      
      if (lowStockError) throw lowStockError;
      
      // Get inventory movements (product scans) in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: inventoryMovements, error: movementsError } = await supabase
        .from('product_scans')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', restaurantId)
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (movementsError) throw movementsError;
      
      // Get expiring products (expiring in next 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      const { count: expiringProducts, error: expiringError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId)
        .eq('status', 'active')
        .lt('expiry_date', sevenDaysFromNow.toISOString())
        .gt('expiry_date', new Date().toISOString());
      
      if (expiringError) throw expiringError;
      
      setStats({
        totalProducts: totalProducts || 0,
        lowStockProducts: lowStockProducts || 0,
        inventoryMovements: inventoryMovements || 0,
        expiringProducts: expiringProducts || 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب إحصائيات لوحة التحكم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    showMobileApp,
    stats,
    loading
  };
};
