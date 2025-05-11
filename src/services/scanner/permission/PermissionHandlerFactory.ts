
import { Capacitor } from '@capacitor/core';
import { WebPermissionHandler } from './WebPermissionHandler';
import { MLKitPermissionHandler } from './MLKitPermissionHandler';
import { CameraPermissionHandler } from './CameraPermissionHandler';
import { MockPermissionHandler } from './MockPermissionHandler';
import { IPermissionHandler } from './types';

/**
 * مصنع معالجات الأذونات - يختار المعالج المناسب بناءً على البيئة والتوفر
 */
export class PermissionHandlerFactory {
  private static mockMode = false;
  
  /**
   * تعيين وضع المحاكاة
   */
  public static setMockMode(enabled: boolean): void {
    this.mockMode = enabled;
    console.log(`[PermissionHandlerFactory] تم ${enabled ? 'تمكين' : 'تعطيل'} وضع المحاكاة`);
  }
  
  /**
   * الحصول على معالج الأذونات المناسب
   */
  public static getHandler(): IPermissionHandler {
    // إذا كان وضع المحاكاة مفعل، استخدم المعالج الوهمي
    if (this.mockMode) {
      console.log('[PermissionHandlerFactory] استخدام معالج المحاكاة');
      return new MockPermissionHandler();
    }
    
    // إذا لم نكن في بيئة محمولة أصلية
    if (!Capacitor.isNativePlatform()) {
      console.log('[PermissionHandlerFactory] استخدام معالج الويب');
      return new WebPermissionHandler();
    }
    
    // قائمة بالمعالجات حسب الأولوية
    const handlers = [
      new MLKitPermissionHandler(),
      new CameraPermissionHandler()
    ];
    
    // اختر أول معالج متاح
    for (const handler of handlers) {
      if (handler.isAvailable()) {
        const handlerName = handler instanceof MLKitPermissionHandler 
          ? 'MLKit' 
          : 'Camera';
        console.log(`[PermissionHandlerFactory] استخدام معالج ${handlerName}`);
        return handler;
      }
    }
    
    // إذا لم يتوفر أي معالج، استخدم المعالج الوهمي
    console.log('[PermissionHandlerFactory] لا توجد معالجات متاحة، استخدام معالج المحاكاة');
    return new MockPermissionHandler();
  }
}
