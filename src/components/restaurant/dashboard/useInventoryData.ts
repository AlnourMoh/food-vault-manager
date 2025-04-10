
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, Movement } from './types';

export const useInventoryData = (activeDataTab: string) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');
  
  useEffect(() => {
    if (restaurantId) {
      if (activeDataTab === 'products') {
        fetchRecentProducts();
      } else {
        fetchRecentMovements();
      }
    }
  }, [restaurantId, activeDataTab]);
  
  const fetchRecentProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', restaurantId)
        .eq('status', 'active')
        .gt('quantity', 0)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }

      setRecentProducts(data || []);
    } catch (error) {
      console.error('Error fetching recent products:', error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء محاولة جلب المنتجات المضافة حديثًا",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecentMovements = async () => {
    setLoading(true);
    try {
      const { data: scans, error: scansError } = await supabase
        .from('product_scans')
        .select(`
          id,
          scan_type,
          created_at,
          product_id,
          scanned_by
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (scansError) throw scansError;
      
      // Get product details for each scan
      if (scans && scans.length > 0) {
        const productIds = scans.map(scan => scan.product_id);
        
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .in('id', productIds);
          
        if (productsError) throw productsError;
        
        // Map product names to scans
        const movementsWithDetails = scans.map(scan => {
          const product = products?.find(p => p.id === scan.product_id);
          return {
            ...scan,
            product_name: product?.name || 'منتج غير معروف'
          };
        });
        
        setRecentMovements(movementsWithDetails);
      } else {
        setRecentMovements([]);
      }
    } catch (error) {
      console.error('Error fetching movement history:', error);
      toast({
        title: "خطأ في جلب حركات المخزون",
        description: "حدث خطأ أثناء محاولة جلب حركات المخزون الأخيرة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    recentProducts,
    recentMovements,
    loading,
  };
};
