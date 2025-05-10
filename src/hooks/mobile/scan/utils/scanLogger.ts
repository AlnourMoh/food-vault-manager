
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs a product scan event in the database
 * @param code The scanned QR/barcode
 * @param productId The product ID associated with the scan
 */
export const logProductScan = async (code: string, productId: string): Promise<void> => {
  const restaurantId = localStorage.getItem('restaurantId');
  
  if (restaurantId) {
    console.log('scanLogger: تسجيل عملية المسح للمطعم:', restaurantId);
    
    await supabase
      .from('product_scans')
      .insert({
        product_id: productId,
        qr_code: code,
        scan_type: 'check',
        scanned_by: restaurantId
      });
  } else {
    console.warn('scanLogger: لم يتم العثور على معرف المطعم للتسجيل');
  }
};
