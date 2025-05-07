
import { Toast } from '@capacitor/toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * خدمة تتعامل مع معالجة نتائج المسح
 */
export class ScannerResultService {
  private static instance: ScannerResultService;
  
  private constructor() {}
  
  public static getInstance(): ScannerResultService {
    if (!ScannerResultService.instance) {
      ScannerResultService.instance = new ScannerResultService();
    }
    return ScannerResultService.instance;
  }
  
  /**
   * معالجة نتائج المسح الناجح
   */
  public async processSuccessfulScan(code: string, scanType: string = 'check'): Promise<boolean> {
    try {
      console.log(`[ScannerResultService] معالجة المسح الناجح للرمز: ${code}`);
      
      // يمكن هنا تسجيل عملية المسح إذا كان مطلوباً
      const restaurantId = localStorage.getItem('restaurantId');
      if (restaurantId) {
        try {
          await supabase
            .from('product_scans')
            .insert({
              qr_code: code,
              scan_type: scanType,
              scanned_by: restaurantId
            });
            
          console.log('[ScannerResultService] تم تسجيل عملية المسح بنجاح');
        } catch (error) {
          console.error('[ScannerResultService] خطأ في تسجيل عملية المسح:', error);
          // نتابع حتى لو فشل التسجيل لأنه ليس حرجاً
        }
      }
      
      return true;
    } catch (error) {
      console.error('[ScannerResultService] خطأ في معالجة نتيجة المسح:', error);
      return false;
    }
  }
  
  /**
   * معالجة فشل المسح
   */
  public async handleScanFailure(error: any = null): Promise<void> {
    try {
      console.error('[ScannerResultService] فشل في عملية المسح:', error);
      
      // عرض رسالة للمستخدم
      await Toast.show({
        text: 'لم يتم العثور على باركود. يرجى المحاولة مرة أخرى.',
        duration: 'long'
      });
    } catch (toastError) {
      console.error('[ScannerResultService] خطأ في عرض رسالة الفشل:', toastError);
    }
  }
  
  /**
   * معالجة نتيجة المسح - سواء كانت ناجحة أو فاشلة
   */
  public async processScanResult(result: any, onSuccess: (code: string) => void): Promise<boolean> {
    try {
      if (result && result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue || '';
        
        if (code) {
          console.log('[ScannerResultService] تم العثور على باركود:', code);
          await this.processSuccessfulScan(code);
          onSuccess(code);
          return true;
        }
      }
      
      // لم يتم العثور على باركود
      await this.handleScanFailure();
      return false;
    } catch (error) {
      console.error('[ScannerResultService] خطأ في معالجة نتيجة المسح:', error);
      await this.handleScanFailure(error);
      return false;
    }
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerResultService = ScannerResultService.getInstance();
