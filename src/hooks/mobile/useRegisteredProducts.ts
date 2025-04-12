
import { useState, useEffect, useCallback } from 'react';
import { db, collection, query, where, getDocs } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface RegisteredProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  barcode?: string;
  status: string;
  addedBy: string;
  createdAt?: string;
}

export const useRegisteredProducts = () => {
  const [products, setProducts] = useState<RegisteredProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');

  const fetchRegisteredProducts = useCallback(async () => {
    // تعيين معرف المطعم الافتراضي إذا لم يكن موجودًا
    if (!restaurantId) {
      console.log("معرف المطعم غير موجود، تعيين معرف افتراضي");
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }

    try {
      setLoading(true);
      console.log("بدء جلب المنتجات المسجلة للمطعم:", localStorage.getItem('restaurantId'));
      
      // إنشاء بيانات المنتجات المسجلة الوهمية للعرض التجريبي
      const mockRegisteredProducts: RegisteredProduct[] = [
        {
          id: '67890',
          name: 'دقيق',
          category: 'بقالة',
          unit: 'كيلوغرام',
          quantity: 0,
          barcode: '67890',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 25).toLocaleDateString('ar-SA')
        },
        {
          id: '54321',
          name: 'طماطم',
          category: 'خضروات',
          unit: 'كيلوغرام',
          quantity: 0,
          barcode: '54321',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 24).toLocaleDateString('ar-SA')
        },
        {
          id: '12345',
          name: 'زيت زيتون',
          category: 'بقالة',
          unit: 'لتر',
          quantity: 0,
          barcode: '12345',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 23).toLocaleDateString('ar-SA')
        }
      ];
      
      console.log("تم تجهيز منتجات العرض التجريبي:", mockRegisteredProducts.length);
      setProducts(mockRegisteredProducts);
    } catch (error) {
      console.error("Error fetching registered products:", error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء جلب المنتجات المسجلة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [restaurantId, toast]);

  useEffect(() => {
    console.log("تشغيل useEffect في useRegisteredProducts");
    // إعداد البيانات الافتراضية للعرض التجريبي
    if (!localStorage.getItem('restaurantId')) {
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }
    
    if (!localStorage.getItem('teamMemberId')) {
      localStorage.setItem('teamMemberId', 'user-demo-123');
    }
    
    if (!localStorage.getItem('teamMemberName')) {
      localStorage.setItem('teamMemberName', 'سارة الاحمد');
    }
    
    fetchRegisteredProducts();
  }, [fetchRegisteredProducts]);

  return {
    products,
    loading,
    refreshProducts: fetchRegisteredProducts
  };
};
