
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { formatProductData } from './utils/productFormatter';

export const useScanProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * البحث عن منتج باستخدام رمز الباركود
   */
  const fetchProductByCode = async (code: string): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('البحث عن المنتج باستخدام الرمز:', code);
      
      // أولاً، نبحث عن الرمز في جدول رموز المنتجات
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id')
        .eq('qr_code', code)
        .maybeSingle();
      
      if (codeError) {
        console.error('خطأ في البحث عن رمز المنتج:', codeError);
        throw 'حدث خطأ أثناء البحث عن رمز المنتج';
      }
      
      if (!productCode) {
        throw 'لم يتم العثور على منتج بهذا الرمز';
      }
      
      // ثانيًا، نحصل على تفاصيل المنتج باستخدام المعرف
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .maybeSingle();
      
      if (productError) {
        console.error('خطأ في جلب تفاصيل المنتج:', productError);
        throw 'حدث خطأ أثناء جلب تفاصيل المنتج';
      }
      
      if (!productData) {
        throw 'لم يتم العثور على تفاصيل المنتج';
      }
      
      // استخدام دالة تنسيق بيانات المنتج لتحويل البيانات الخام إلى نوع المنتج المتوقع
      return formatProductData(productData);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'حدث خطأ غير معروف');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * تسجيل عملية مسح منتج
   */
  const logProductScan = async (code: string, productId: string, scanType: 'check' | 'in' | 'out' = 'check') => {
    try {
      console.log(`تسجيل عملية مسح من نوع ${scanType} للمنتج:`, productId);
      
      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        console.warn('لم يتم العثور على معرف المطعم، لا يمكن تسجيل عملية المسح');
        return;
      }
      
      const { error } = await supabase
        .from('product_scans')
        .insert({
          product_id: productId,
          qr_code: code,
          scan_type: scanType,
          scanned_by: restaurantId
        });
      
      if (error) {
        console.error('خطأ في تسجيل عملية المسح:', error);
      } else {
        console.log('تم تسجيل عملية المسح بنجاح');
      }
    } catch (error) {
      console.error('خطأ غير متوقع في تسجيل عملية المسح:', error);
    }
  };

  return {
    isLoading,
    error,
    fetchProductByCode,
    logProductScan,
    setError
  };
};
