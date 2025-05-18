
import { Toast } from '@capacitor/toast';

/**
 * خدمة لإدارة الكاميرا وحل مشاكل الشاشة السوداء
 */
export class CameraService {
  private static instance: CameraService;
  private activeStream: MediaStream | null = null;
  private activeVideoElement: HTMLVideoElement | null = null;
  private keepAliveInterval: number | null = null;
  private streamConstraints = { 
    video: { 
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    } 
  };

  private constructor() {}

  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  /**
   * تشغيل الكاميرا وربطها بعنصر فيديو
   */
  public async startCamera(videoElement?: HTMLVideoElement): Promise<HTMLVideoElement> {
    try {
      // تحرير أي موارد سابقة
      await this.stopCamera();

      console.log('CameraService: بدء تشغيل الكاميرا...');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('واجهة mediaDevices غير مدعومة في هذا المتصفح');
      }

      // طلب دفق الوسائط
      const stream = await navigator.mediaDevices.getUserMedia(this.streamConstraints);
      this.activeStream = stream;

      // تحضير عنصر الفيديو
      let video: HTMLVideoElement;
      if (videoElement) {
        video = videoElement;
      } else {
        video = document.createElement('video');
        video.id = 'camera-service-video-' + Date.now();
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
      }

      // تعيين خصائص الفيديو
      video.srcObject = stream;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      video.style.display = 'block';
      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.zIndex = '999';

      // محاولة تشغيل الفيديو
      try {
        await video.play();
        console.log('CameraService: تم تشغيل بث الفيديو بنجاح');
      } catch (playError) {
        console.error('CameraService: خطأ في تشغيل الفيديو:', playError);
        
        // الإبلاغ عن الخطأ للمستخدم
        await Toast.show({
          text: `فشل في تشغيل الفيديو: ${playError instanceof Error ? playError.message : 'خطأ غير معروف'}`,
          duration: 'short'
        }).catch(() => {});

        // محاولة تشغيل تلقائي بعد تأخير قصير
        setTimeout(() => {
          video.play().catch((err) => {
            console.error('CameraService: فشلت محاولة التشغيل التلقائي:', err);
          });
        }, 1000);
      }

      this.activeVideoElement = video;

      // بدء خاصية الإبقاء نشطة
      this.startKeepAlive();

      return video;
    } catch (error) {
      console.error('CameraService: فشل في بدء الكاميرا:', error);
      
      // الإبلاغ عن الخطأ للمستخدم
      await Toast.show({
        text: `فشل في تشغيل الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        duration: 'short'
      }).catch(() => {});

      throw error;
    }
  }

  /**
   * إيقاف الكاميرا وتحرير الموارد
   */
  public async stopCamera(): Promise<void> {
    console.log('CameraService: إيقاف الكاميرا...');
    
    // إيقاف خاصية الإبقاء نشطة
    this.stopKeepAlive();

    // إيقاف المسارات
    if (this.activeStream) {
      this.activeStream.getTracks().forEach(track => {
        track.stop();
      });
      this.activeStream = null;
    }

    // تنظيف عنصر الفيديو
    if (this.activeVideoElement) {
      this.activeVideoElement.srcObject = null;
      this.activeVideoElement.remove();
      this.activeVideoElement = null;
    }
  }

  /**
   * فحص الكاميرات المتاحة
   */
  public async checkAvailableCameras(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error('واجهة enumerateDevices غير مدعومة في هذا المتصفح');
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');

    console.log(`CameraService: تم العثور على ${cameras.length} كاميرا متاحة`);
    cameras.forEach((camera, index) => {
      console.log(`كاميرا ${index + 1}: ${camera.label || 'بدون تسمية'}`);
    });

    return cameras;
  }

  /**
   * بدء عملية الحفاظ على نشاط الكاميرا
   */
  private startKeepAlive(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }

    this.keepAliveInterval = window.setInterval(() => {
      if (this.activeVideoElement && this.activeVideoElement.paused && this.activeVideoElement.srcObject) {
        console.log('CameraService: إعادة تشغيل الفيديو المتوقف');
        this.activeVideoElement.play().catch(err => {
          console.error('CameraService: خطأ في إعادة تشغيل الفيديو:', err);
        });
      }
    }, 2000);
  }

  /**
   * إيقاف عملية الحفاظ على نشاط الكاميرا
   */
  private stopKeepAlive(): void {
    if (this.keepAliveInterval !== null) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * اختبار سريع للكاميرا بدون إنشاء عنصر فيديو
   */
  public async quickCameraTest(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('CameraService: اختبار سريع للكاميرا...');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          success: false,
          message: 'واجهة mediaDevices غير مدعومة في هذا المتصفح'
        };
      }

      // طلب دفق الوسائط لاختباره
      const stream = await navigator.mediaDevices.getUserMedia(this.streamConstraints);
      
      // الاختبار ناجح، إيقاف المسارات
      stream.getTracks().forEach(track => {
        track.stop();
      });

      return {
        success: true,
        message: 'الكاميرا تعمل بشكل صحيح'
      };
    } catch (error) {
      console.error('CameraService: فشل اختبار الكاميرا:', error);
      return {
        success: false,
        message: `فشل اختبار الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }
}

// تصدير نسخة واحدة من الخدمة
export const cameraService = CameraService.getInstance();
