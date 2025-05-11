
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { AppSettingsOpener } from './permission/AppSettingsOpener';
import { PermissionHandlerFactory } from './permission/PermissionHandlerFactory';

/**
 * خدمة إدارة أذونات الماسح الضوئي
 */
export class ScannerPermissionService {
  private static instance: ScannerPermissionService;
  private permissionRequestCount: number = 0;
  private lastPermissionRequest: number = 0;
  private mockMode: boolean = false;

  private constructor() {
    console.log('[ScannerPermissionService] تهيئة خدمة الأذونات');
  }
  
  /**
   * الحصول على مثيل الخدمة (Singleton)
   */
  public static getInstance(): ScannerPermissionService {
    if (!this.instance) {
      this.instance = new ScannerPermissionService();
    }
    return this.instance;
  }
  
  /**
   * تعيين وضع المحاكاة
   */
  public setMockMode(enabled: boolean): void {
    this.mockMode = enabled;
    PermissionHandlerFactory.setMockMode(enabled);
    console.log(`[ScannerPermissionService] تم ${enabled ? 'تمكين' : 'تعطيل'} وضع المحاكاة`);
  }
  
  /**
   * التحقق من دعم الماسح الضوئي على الجهاز
   */
  public async isSupported(): Promise<boolean> {
    // في وضع المحاكاة، نفترض أن الماسح مدعوم
    if (this.mockMode) {
      return true;
    }
    
    // في بيئة الويب، نفترض أن الكاميرا مدعومة
    if (!Capacitor.isNativePlatform()) {
      return true;
    }
    
    // التحقق من توفر الملحق
    return Capacitor.isPluginAvailable('MLKitBarcodeScanner') ||
           Capacitor.isPluginAvailable('Camera');
  }
  
  /**
   * التحقق من وجود إذن الكاميرا
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] التحقق من إذن الكاميرا');
      
      // الحصول على معالج الأذونات المناسب
      const handler = PermissionHandlerFactory.getHandler();
      
      // استخدام المعالج للتحقق من الإذن
      const { isGranted } = await handler.checkPermission();
      return isGranted;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] طلب إذن الكاميرا');
      
      // زيادة عداد طلبات الإذن وتسجيل وقت الطلب
      this.permissionRequestCount++;
      this.lastPermissionRequest = Date.now();
      
      // الحصول على معالج الأذونات المناسب
      const handler = PermissionHandlerFactory.getHandler();
      
      // طلب الإذن
      const granted = await handler.requestPermission();
      
      // إذا تم منح الإذن، إعادة تعيين العداد
      if (granted) {
        this.permissionRequestCount = 0;
        return true;
      }
      
      // إذا وصلنا لأكثر من محاولتين ورفض المستخدم، نفتح الإعدادات
      if (this.permissionRequestCount >= 2) {
        console.log('[ScannerPermissionService] تم رفض الإذن مرتين، توجيه المستخدم إلى الإعدادات');
        
        await Toast.show({
          text: 'يجب تفعيل إذن الكاميرا من إعدادات التطبيق',
          duration: 'long'
        });
        
        // توجيه المستخدم إلى إعدادات التطبيق
        setTimeout(async () => {
          await this.openAppSettings();
        }, 1000);
      }
      
      return granted;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      return false;
    }
  }
  
  /**
   * فتح إعدادات التطبيق
   */
  public async openAppSettings(): Promise<boolean> {
    return await AppSettingsOpener.openAppSettings();
  }
}

// تصدير مثيل الخدمة
export const scannerPermissionService = ScannerPermissionService.getInstance();
