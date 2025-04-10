
import { useState, useCallback } from 'react';
import type { Toast } from '@/hooks/use-toast.d';

// Accept the complete toast object from useToast()
export const useFetchProductInfo = (toast: ReturnType<typeof import('@/hooks/use-toast').useToast>) => {
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProductInfo = useCallback(async (code: string) => {
    console.log("Fetching product info for barcode:", code);
    setLoading(true);
    try {
      // في الوضع التجريبي، نبحث عن المنتج في البيانات المحلية
      const today = new Date();
      const mockProducts = [
        {
          id: '67890',
          name: 'دقيق',
          category: 'بقالة',
          unit: 'كيلوغرام',
          quantity: 25,
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
          quantity: 10,
          barcode: '54321',
          description: 'طماطم طازجة',
          expiryDate: { toDate: () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '12345',
          name: 'زيت زيتون',
          category: 'بقالة',
          unit: 'لتر',
          quantity: 15,
          barcode: '12345',
          description: 'زيت زيتون عالي الجودة',
          expiryDate: { toDate: () => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '34567',
          name: 'سكر',
          category: 'بقالة',
          unit: 'كيلوغرام',
          quantity: 3,
          barcode: '34567',
          description: 'سكر أبيض ناعم',
          expiryDate: { toDate: () => new Date(2025, 10, 15) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '45678',
          name: 'بصل',
          category: 'خضروات',
          unit: 'كيلوغرام',
          quantity: 2,
          barcode: '45678',
          description: 'بصل طازج',
          expiryDate: { toDate: () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        }
      ];
      
      const product = mockProducts.find(p => p.id === code || p.barcode === code);
      
      if (product) {
        console.log("Product found:", product);
        
        // Show notification for low stock or expiring products
        const expiry = new Date(product.expiryDate.toDate());
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (product.quantity < 5) {
          toast.toast({
            title: "تنبيه: مخزون منخفض",
            description: `المنتج ${product.name} مخزونه منخفض (${product.quantity})`,
            variant: "default"
          });
        }
        
        if (daysUntilExpiry <= 0) {
          toast.toast({
            title: "تنبيه: منتج منتهي الصلاحية",
            description: `المنتج ${product.name} منتهي الصلاحية!`,
            variant: "destructive"
          });
        } else if (daysUntilExpiry <= 30) {
          toast.toast({
            title: "تنبيه: تاريخ الانتهاء قريب",
            description: `المنتج ${product.name} ينتهي خلال ${daysUntilExpiry} يوم`,
            variant: "default"
          });
        }
        
        setProductInfo(product);
      } else {
        console.log("Product not found in mock data");
        toast.toast({
          title: "المنتج غير موجود",
          description: "هذا المنتج غير مسجل في قاعدة البيانات",
          variant: "destructive"
        });
        setProductInfo(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.toast({
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
