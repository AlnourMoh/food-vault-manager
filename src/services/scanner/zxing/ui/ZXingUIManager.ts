
/**
 * مدير واجهة المستخدم ZXing
 * يتعامل مع إنشاء وإدارة عناصر واجهة المستخدم للماسح
 */

import { ScannerUIService } from '../../ui/ScannerUIService';

export class ZXingUIManager {
  private uiService: ScannerUIService;
  private videoElement: HTMLVideoElement | null = null;
  
  constructor() {
    this.uiService = new ScannerUIService();
  }
  
  /**
   * إنشاء عنصر الفيديو للماسح
   */
  public createVideoElement(): HTMLVideoElement {
    this.videoElement = this.uiService.createVideoElement();
    return this.videoElement;
  }
  
  /**
   * تفعيل واجهة المستخدم للمسح
   */
  public activateScanningUI(): void {
    if (this.videoElement) {
      this.uiService.activateScanningUI(this.videoElement);
    }
  }
  
  /**
   * إيقاف تفعيل واجهة المستخدم للمسح
   */
  public deactivateScanningUI(): void {
    this.uiService.deactivateScanningUI();
  }
  
  /**
   * الحصول على عنصر الفيديو الحالي
   */
  public getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }
  
  /**
   * إيقاف تشغيل مسارات الفيديو وتنظيف العناصر
   */
  public cleanupVideoElement(): void {
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
      this.videoElement.style.opacity = '0';
    }
  }
  
  /**
   * تنظيف الموارد
   */
  public dispose(): void {
    this.cleanupVideoElement();
    this.uiService.dispose();
    this.videoElement = null;
  }
}
