
import { useState, useCallback } from 'react';
import type { ToastAPI } from '@/hooks/use-toast.d';

export const useFetchProductInfo = (toast: ToastAPI) => {
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProductInfo = useCallback(async (code: string) => {
    console.log("Fetching product info for barcode:", code);
    setLoading(true);
    try {
      // في الوضع التجريبي، نبحث عن المنتج في البيانات المحلية
      const mockProducts = [
        {
          id: '67890',
          name: 'دقيق',
          category: 'بقالة',
          unit: 'كيلوغرام',
          quantity: 0,
          barcode: '67890',
          description: 'دقيق متعدد الاستخدامات للخبز والطبخ',
          expiryDate: { toDate: () => new Date(2025, 11, 31) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '54321',
          name: 'طماطم',
          category: 'خضروات',
          unit: 'كيلوغرام',
          quantity: 0,
          barcode: '54321',
          description: 'طماطم طازجة',
          expiryDate: { toDate: () => new Date(2025, 4, 30) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '12345',
          name: 'زيت زيتون',
          category: 'بقالة',
          unit: 'لتر',
          quantity: 0,
          barcode: '12345',
          description: 'زيت زيتون عالي الجودة',
          expiryDate: { toDate: () => new Date(2026, 5, 15) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        }
      ];
      
      const product = mockProducts.find(p => p.id === code || p.barcode === code);
      
      if (product) {
        console.log("Product found:", product);
        setProductInfo(product);
      } else {
        console.log("Product not found in mock data");
        toast({
          title: "المنتج غير موجود",
          description: "هذا المنتج غير مسجل في قاعدة البيانات",
          variant: "destructive"
        });
        setProductInfo(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء البحث عن المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { productInfo, loading, fetchProductInfo };
};
