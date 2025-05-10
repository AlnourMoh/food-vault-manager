
/**
 * خدمة إدارة أذونات الماسح الضوئي
 */

export class ScannerPermissionService {
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق من دعم getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('[ScannerPermissionService] getUserMedia غير مدعوم في هذا المتصفح');
        return false;
      }

      // التحقق من دعم مدخلات الفيديو
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      
      if (!hasVideoInput) {
        console.warn('[ScannerPermissionService] لا توجد كاميرات متاحة على هذا الجهاز');
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ScannerPermissionService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<boolean> {
    try {
      if (!await this.isSupported()) {
        console.error('[ScannerPermissionService] الجهاز لا يدعم الماسح الضوئي');
        return false;
      }
      
      // محاولة الوصول إلى الكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // إغلاق المسار فوراً لأننا نحتاج فقط التحقق من الإذن
      stream.getTracks().forEach(track => track.stop());
      
      console.log('[ScannerPermissionService] تم الحصول على إذن الكاميرا بنجاح');
      
      return true;
    } catch (error: any) {
      console.error('[ScannerPermissionService] خطأ في طلب إذن الكاميرا:', error);
      
      // تحديد نوع الخطأ بشكل أفضل
      let errorMessage = 'حدث خطأ غير معروف';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'تم رفض إذن الكاميرا';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'لم يتم العثور على كاميرا في هذا الجهاز';
      } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
        errorMessage = 'الكاميرا قيد الاستخدام بالفعل من قبل تطبيق آخر';
      }
      
      console.error('[ScannerPermissionService] رسالة الخطأ:', errorMessage);
      return false;
    }
  }
}
