
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

export class DeviceSupportChecker {
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async checkDeviceSupport(): Promise<boolean> {
    try {
      // أولاً نتحقق من توفر الملحقات
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.isSupported();
        return result.supported;
      }
      
      // نتحقق من توفر الكاميرا على الأقل
      if (Capacitor.isPluginAvailable('Camera')) {
        return true;
      }
      
      // في بيئة الويب، نتحقق من دعم الكاميرا
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return true;
      }
      
      // في حالة عدم توفر أي دعم
      return false;
    } catch (error) {
      console.error('خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }
}
