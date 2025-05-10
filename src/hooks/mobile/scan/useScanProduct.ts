
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useState } from 'react';

export const useScanProduct = () => {
  const [scanError, setScanError] = useState<string | null>(null);
  
  const fetchProductByCode = async (code: string): Promise<Product | null> => {
    console.log('useScanProduct: جاري البحث عن بيانات المنتج للرمز:', code);
    try {
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
      
      // تحويل بيانات المنتج من قاعدة البيانات إلى تنسيق واجهة المنتج
      const normalizedStatus = ((): 'active' | 'expired' | 'removed' => {
        switch(product.status) {
          case 'active':
            return 'active';
          case 'expired':
            return 'expired';
          case 'removed':
            return 'removed';
          default:
            console.warn(`useScanProduct: حالة منتج غير متوقعة: ${product.status}، استخدام 'active' كقيمة افتراضية`);
            return 'active';
        }
      })();
      
      const formattedProduct: Product = {
        id: product.id,
        name: product.name,
        category: product.category,
        unit: product.unit || '',
        quantity: product.quantity,
        expiryDate: new Date(product.expiry_date),
        entryDate: new Date(product.production_date),
        restaurantId: product.company_id,
        restaurantName: '', 
        addedBy: '', 
        status: normalizedStatus,
        imageUrl: product.image_url,
      };
      
      console.log('useScanProduct: بيانات المنتج المنسقة:', formattedProduct);
      
      // Log scan in database
      await logProductScan(code, product.id);
      
      return formattedProduct;
    } catch (error) {
      if (typeof error === 'string') {
        throw error;
      }
      throw 'حدث خطأ أثناء البحث عن المنتج';
    }
  };

  const logProductScan = async (code: string, productId: string) => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (restaurantId) {
      console.log('useScanProduct: تسجيل عملية المسح للمطعم:', restaurantId);
      await supabase
        .from('product_scans')
        .insert({
          product_id: productId,
          qr_code: code,
          scan_type: 'check',
          scanned_by: restaurantId
        });
    }
  };
  
  return {
    fetchProductByCode,
    logProductScan,
    scanError
  };
};
