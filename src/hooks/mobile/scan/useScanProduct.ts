
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useState } from 'react';
import { formatProductData } from './utils/productFormatter';
import { logProductScan } from './utils/scanLogger';

/**
 * Hook for scanning and fetching product information
 */
export const useScanProduct = () => {
  const [scanError, setScanError] = useState<string | null>(null);
  
  /**
   * Fetches product information by its barcode/QR code
   * @param code The product's barcode or QR code
   * @returns Product information if found, null otherwise
   */
  const fetchProductByCode = async (code: string): Promise<Product | null> => {
    console.log('useScanProduct: جاري البحث عن بيانات المنتج للرمز:', code);
    
    try {
      // التعامل مع الرموز الوهمية في بيئة الاختبار
      if (code.startsWith('MOCK-') || code.startsWith('DEMO-')) {
        console.log('useScanProduct: هذا رمز وهمي، إنشاء منتج وهمي للاختبار');
        
        // إنشاء منتج وهمي للاختبار
        const mockProduct: Product = {
          id: `mock-${Math.random().toString(36).substring(2, 9)}`,
          name: "منتج تجريبي",
          category: "خضروات",
          quantity: 10,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم من الآن
          entryDate: new Date(),
          restaurantId: localStorage.getItem('restaurantId') || "unknown",
          status: "active",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200",
          restaurantName: "",
          addedBy: "",
          unit: "piece"
        };
        
        return mockProduct;
      }
      
      // البحث عن معرف المنتج باستخدام الرمز الممسوح
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id')
        .eq('qr_code', code)
        .maybeSingle();
      
      if (codeError) {
        console.error('useScanProduct: خطأ في البحث عن رمز المنتج:', codeError);
        setScanError('لم يتم العثور على معلومات المنتج لهذا الباركود');
        throw 'لم يتم العثور على معلومات المنتج لهذا الباركود';
      }
      
      if (!productCode?.product_id) {
        console.error('useScanProduct: لم يتم العثور على معرف المنتج للرمز:', code);
        setScanError('لم يتم العثور على معلومات المنتج لهذا الباركود');
        throw 'لم يتم العثور على معلومات المنتج لهذا الباركود';
      }
      
      console.log('useScanProduct: تم العثور على معرف المنتج:', productCode.product_id);
      
      // البحث عن تفاصيل المنتج باستخدام المعرف
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .maybeSingle();
      
      if (productError) {
        console.error('useScanProduct: خطأ في البحث عن تفاصيل المنتج:', productError);
        setScanError('حدث خطأ أثناء جلب تفاصيل المنتج');
        throw 'حدث خطأ أثناء جلب تفاصيل المنتج';
      }
      
      if (!product) {
        console.error('useScanProduct: لم يتم العثور على بيانات المنتج:', productCode.product_id);
        setScanError('لم يتم العثور على بيانات المنتج');
        throw 'لم يتم العثور على بيانات المنتج المطلوب';
      }
      
      console.log('useScanProduct: تم جلب بيانات المنتج:', product);
      
      // تنسيق بيانات المنتج واستخدام المرافق المساعدة
      const formattedProduct = formatProductData(product);
      
      // تسجيل عملية المسح في قاعدة البيانات
      await logProductScan(code, product.id);
      
      return formattedProduct;
    } catch (error) {
      if (typeof error === 'string') {
        throw error;
      }
      throw 'حدث خطأ أثناء البحث عن المنتج';
    }
  };
  
  return {
    fetchProductByCode,
    logProductScan,
    scanError
  };
};
