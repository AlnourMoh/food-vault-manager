
import { Toast } from '@capacitor/toast';

/**
 * خدمة لمعالجة نتائج المسح الضوئي
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
   * معالجة نتيجة المسح
   * @param result نتيجة المسح من ملحق الماسح الضوئي
   * @param onSuccess دالة يتم استدعاؤها عند نجاح المسح
   */
  public async processScanResult(
    result: { barcodes?: Array<{ rawValue?: string }> },
    onSuccess: (code: string) => void
  ): Promise<boolean> {
    try {
      console.log('[ScannerResultService] معالجة نتيجة المسح:', result);
      
      // التحقق من وجود باركود
      if (!result.barcodes || result.barcodes.length === 0) {
        console.log('[ScannerResultService] لم يتم العثور على باركود');
        await Toast.show({
          text: 'لم يتم العثور على باركود. يرجى المحاولة مرة أخرى.',
          duration: 'short'
        });
        return false;
      }
      
      // استخراج قيمة الباركود
      const barcode = result.barcodes[0];
      if (!barcode.rawValue) {
        console.log('[ScannerResultService] تم العثور على باركود لكن بدون قيمة');
        await Toast.show({
          text: 'تم العثور على باركود لكن لا يمكن قراءته. يرجى المحاولة مرة أخرى.',
          duration: 'short'
        });
        return false;
      }
      
      // استدعاء دالة النجاح مع قيمة الباركود
      const code = barcode.rawValue;
      console.log('[ScannerResultService] تم مسح الباركود بنجاح:', code);
      
      // عرض رسالة نجاح
      await Toast.show({
        text: `تم مسح الباركود بنجاح: ${code}`,
        duration: 'short'
      });
      
      // استدعاء دالة النجاح
      onSuccess(code);
      return true;
    } catch (error) {
      console.error('[ScannerResultService] خطأ في معالجة نتيجة المسح:', error);
      
      // عرض رسالة خطأ
      await Toast.show({
        text: 'حدث خطأ أثناء معالجة نتيجة المسح',
        duration: 'short'
      });
      
      return false;
    }
  }
  
  /**
   * التحقق من أن قيمة الباركود صالحة
   * @param code قيمة الباركود للتحقق منها
   */
  public validateBarcode(code: string): boolean {
    // يمكن إضافة منطق للتحقق من صحة الباركود هنا
    return code.length > 0;
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const scannerResultService = ScannerResultService.getInstance();
