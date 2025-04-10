
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  barcode?: string;
  status: string;
  addedBy: string;
  createdAt?: string;
  expiryDate?: Date;
}

export const useInventoryProducts = () => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');

  const fetchInventoryProducts = useCallback(async () => {
    // تعيين معرف المطعم الافتراضي إذا لم يكن موجودًا
    if (!restaurantId) {
      console.log("معرف المطعم غير موجود، تعيين معرف افتراضي");
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }

    try {
      setLoading(true);
      console.log("بدء جلب المنتجات المخزنة للمطعم:", localStorage.getItem('restaurantId'));
      
      // إنشاء بيانات المنتجات المخزنة الوهمية للعرض التجريبي
      const today = new Date();
      const mockInventoryProducts: InventoryProduct[] = [
        {
          id: '67890',
          name: 'دقيق',
          category: 'بقالة',
          unit: 'كيلوغرام',
          quantity: 25,
          barcode: '67890',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 25).toLocaleDateString('ar-SA'),
          expiryDate: new Date(2025, 8, 25)
        },
        {
          id: '54321',
          name: 'طماطم',
          category: 'خضروات',
          unit: 'كيلوغرام',
          quantity: 10,
          barcode: '54321',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 24).toLocaleDateString('ar-SA'),
          expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5) // تنتهي بعد 5 أيام
        },
        {
          id: '12345',
          name: 'زيت زيتون',
          category: 'بقالة',
          unit: 'لتر',
          quantity: 15,
          barcode: '12345',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 23).toLocaleDateString('ar-SA'),
          expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10) // منتهي الصلاحية
        },
        {
          id: '98765',
          name: 'جبنة بيضاء',
          category: 'ألبان',
          unit: 'كيلوغرام',
          quantity: 8,
          barcode: '98765',
          status: 'active',
          addedBy: 'سارة الاحمد',
          createdAt: new Date(2025, 3, 20).toLocaleDateString('ar-SA'),
          expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2) // تنتهي بعد يومين
        }
      ];
      
      console.log("تم تجهيز منتجات المخزون للعرض التجريبي:", mockInventoryProducts.length);
      setProducts(mockInventoryProducts);
    } catch (error) {
      console.error("Error fetching inventory products:", error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء جلب المنتجات المخزنة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [restaurantId, toast]);

  useEffect(() => {
    console.log("تشغيل useEffect في useInventoryProducts");
    // إعداد البيانات الافتراضية للعرض التجريبي
    if (!localStorage.getItem('restaurantId')) {
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }
    
    fetchInventoryProducts();
  }, [fetchInventoryProducts]);

  return {
    products,
    loading,
    refreshProducts: fetchInventoryProducts
  };
};
