
import { supabase } from '@/integrations/supabase/client';

/**
 * تسجيل عملية مسح المنتج في قاعدة البيانات
 */
export const logProductScan = async (code: string, productId: string): Promise<boolean> => {
  try {
    // تجاهل تسجيل الرموز الوهمية في بيئة الاختبار
    if (code.startsWith('MOCK-') || code.startsWith('DEMO-')) {
      console.log('scanLogger: تجاهل تسجيل الرمز الوهمي:', code);
      return true;
    }
    
    console.log('scanLogger: تسجيل عملية المسح للمنتج:', productId);
    
    const userId = localStorage.getItem('userId') || 'unknown';
    const restaurantId = localStorage.getItem('restaurantId') || 'unknown';
    
    const { error } = await supabase
      .from('product_scan_logs')
      .insert({
        product_id: productId,
        scanned_by: userId,
        restaurant_id: restaurantId,
        scan_code: code,
      });
    
    if (error) {
      console.error('scanLogger: خطأ في تسجيل عملية المسح:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('scanLogger: خطأ غير متوقع في تسجيل عملية المسح:', error);
    return false;
  }
};
