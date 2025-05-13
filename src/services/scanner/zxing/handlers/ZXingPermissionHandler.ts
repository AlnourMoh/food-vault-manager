
/**
 * مدير أذونات ZXing
 * يتعامل مع فحص وطلب أذونات الكاميرا
 */

import { ScannerPermissionService } from '../../permission/ScannerPermissionService';

export class ZXingPermissionHandler {
  private permissionService: ScannerPermissionService;
  private hasPermission: boolean = false;

  constructor() {
    this.permissionService = new ScannerPermissionService();
  }

  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    return this.permissionService.isSupported();
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<{ granted: boolean; error?: string }> {
    try {
      const result = await this.permissionService.requestPermission();
      this.hasPermission = result.granted;
      return result;
    } catch (error) {
      console.error('[ZXingPermissionHandler] خطأ في طلب إذن الكاميرا:', error);
      return { granted: false, error: 'حدث خطأ أثناء طلب إذن الكاميرا' };
    }
  }

  /**
   * الحصول على حالة الإذن الحالية
   */
  public getPermissionStatus(): boolean {
    return this.hasPermission;
  }

  /**
   * تعيين حالة الإذن
   */
  public setPermissionStatus(status: boolean): void {
    this.hasPermission = status;
  }
}
