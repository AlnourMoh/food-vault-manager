
/**
 * تنفيذ خدمة الماسح الضوئي باستخدام مكتبة ZXing
 * تم تقسيمها إلى مكونات أصغر لتحسين قابلية الصيانة
 */

import { ZXingScanOptions, ZXingScanResult } from '@/types/zxing-scanner';
import { BaseScannerService } from '../base/BaseScannerService';
import { ZXingPermissionHandler } from './handlers/ZXingPermissionHandler';
import { ZXingUIManager } from './ui/ZXingUIManager';
import { ZXingScannerCore } from './core/ZXingScannerCore';

export class ZXingImplementation extends BaseScannerService {
  private permissionHandler: ZXingPermissionHandler;
  private uiManager: ZXingUIManager;
  private scannerCore: ZXingScannerCore;
  
  constructor() {
    super();
    this.permissionHandler = new ZXingPermissionHandler();
    this.uiManager = new ZXingUIManager();
    this.scannerCore = new ZXingScannerCore();
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    return this.permissionHandler.isSupported();
  }
  
  /**
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<{ granted: boolean; error?: string }> {
    const result = await this.permissionHandler.requestPermission();
    this.hasPermission = result.granted;
    return result;
  }
  
  /**
   * بدء عملية المسح
   */
  public async startScan(options: ZXingScanOptions = {}, onScan: (result: ZXingScanResult) => void): Promise<boolean> {
    try {
      if (this.isScanning) {
        console.log('[ZXingImplementation] الماسح نشط بالفعل');
        return true;
      }
      
      // التحقق من الإذن أولاً
      if (!this.hasPermission) {
        const permissionStatus = await this.requestPermission();
        if (!permissionStatus.granted) {
          return false;
        }
      }
      
      // إنشاء عنصر الفيديو وتفعيل واجهة المستخدم
      const videoElement = this.uiManager.createVideoElement();
      this.uiManager.activateScanningUI();
      
      // بدء المسح المستمر
      this.isScanning = true;
      
      // إنشاء معالج نتيجة المسح الذي يتضمن إيقاف المسح بعد العثور على نتيجة
      const handleScanResult = (result: ZXingScanResult) => {
        onScan(result);
        this.stopScan(); // إيقاف المسح بعد العثور على نتيجة
      };
      
      // بدء المسح باستخدام نواة الماسح
      const success = await this.scannerCore.startScanFromVideo(videoElement, options, handleScanResult);
      
      if (!success) {
        this.isScanning = false;
        return false;
      }
      
      console.log('[ZXingImplementation] بدأ المسح بنجاح');
      return true;
    } catch (error) {
      console.error('[ZXingImplementation] خطأ في بدء المسح:', error);
      this.stopScan();
      return false;
    }
  }
  
  /**
   * إيقاف عملية المسح
   */
  public async stopScan(): Promise<void> {
    try {
      if (!this.isScanning) {
        return;
      }
      
      console.log('[ZXingImplementation] إيقاف المسح...');
      
      // إيقاف عملية المسح
      this.scannerCore.reset();
      
      // تنظيف عنصر الفيديو
      this.uiManager.cleanupVideoElement();
      this.uiManager.deactivateScanningUI();
      
      // إعادة تعيين الحالة
      this.isScanning = false;
      
      console.log('[ZXingImplementation] تم إيقاف المسح بنجاح');
    } catch (error) {
      console.error('[ZXingImplementation] خطأ في إيقاف المسح:', error);
      
      // تأكيد على إعادة تعيين الحالة حتى في حالة الخطأ
      this.isScanning = false;
    }
  }
  
  /**
   * مسح الباركود من صورة
   */
  public async scanFromImage(imageSource: string | Blob | File): Promise<ZXingScanResult | null> {
    return this.scannerCore.scanFromImage(imageSource);
  }
  
  /**
   * التنظيف عند إلغاء الخدمة
   */
  public dispose(): void {
    this.stopScan().catch(console.error);
    
    this.scannerCore.dispose();
    this.uiManager.dispose();
  }
}
