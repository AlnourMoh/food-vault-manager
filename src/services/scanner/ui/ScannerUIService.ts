
/**
 * خدمة إدارة واجهة المستخدم للماسح الضوئي
 */

export class ScannerUIService {
  private videoElement: HTMLVideoElement | null = null;
  
  /**
   * إنشاء عنصر فيديو للمسح
   */
  public createVideoElement(): HTMLVideoElement {
    if (this.videoElement) {
      return this.videoElement;
    }
    
    const video = document.createElement('video');
    video.id = 'zxing-scanner-video';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.opacity = '0'; // جعله مخفياً
    video.style.pointerEvents = 'none'; // لا يتفاعل مع النقرات
    video.setAttribute('playsinline', 'true'); // ضروري لـ iOS
    video.setAttribute('muted', 'true');
    video.muted = true;
    
    // إضافة العنصر مؤقتًا إلى DOM
    document.body.appendChild(video);
    
    this.videoElement = video;
    return video;
  }
  
  /**
   * تفعيل نمط المسح في واجهة المستخدم
   */
  public activateScanningUI(videoElement: HTMLVideoElement): void {
    document.body.classList.add('zxing-scanning');
    if (videoElement) {
      videoElement.style.opacity = '1';
    }
  }
  
  /**
   * إزالة نمط المسح من واجهة المستخدم
   */
  public deactivateScanningUI(): void {
    document.body.classList.remove('zxing-scanning');
    if (this.videoElement) {
      this.videoElement.style.opacity = '0';
    }
  }
  
  /**
   * إزالة عنصر الفيديو
   */
  public removeVideoElement(): void {
    if (this.videoElement && document.body.contains(this.videoElement)) {
      document.body.removeChild(this.videoElement);
      this.videoElement = null;
    }
  }
  
  /**
   * تنظيف الموارد
   */
  public dispose(): void {
    this.deactivateScanningUI();
    this.removeVideoElement();
  }
  
  /**
   * تحويل صورة HTML canvas إلى ImageData
   */
  public static canvasToImageData(canvas: HTMLCanvasElement): ImageData | null {
    try {
      const context = canvas.getContext('2d');
      if (!context) return null;
      return context.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error('[ScannerUIService] خطأ في تحويل Canvas إلى ImageData:', error);
      return null;
    }
  }
}
