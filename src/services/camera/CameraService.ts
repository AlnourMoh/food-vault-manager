
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

      // التأكد من وجود كاميرات متاحة
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoCameras = devices.filter(device => device.kind === 'videoinput');
      
      if (videoCameras.length === 0) {
        throw new Error('لم يتم العثور على كاميرات في هذا الجهاز');
      }
      
      console.log(`CameraService: تم العثور على ${videoCameras.length} كاميرا`);
      
      // طلب دفق الوسائط
      console.log('CameraService: طلب دفق الكاميرا مع المحددات:', JSON.stringify(this.streamConstraints));
      const stream = await navigator.mediaDevices.getUserMedia(this.streamConstraints);
      this.activeStream = stream;
      
      // التحقق من وجود مسارات فيديو
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('تم الوصول للكاميرا ولكن بدون مسارات فيديو');
      }
      
      console.log(`CameraService: تم الحصول على الكاميرا: ${videoTracks[0].label}`);

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
      
      // تطبيق الأنماط للتأكد من رؤية الفيديو
      this.applyVideoStyles(video);

      // محاولة تشغيل الفيديو
      try {
        await video.play();
        console.log('CameraService: تم تشغيل بث الفيديو بنجاح');
      } catch (playError) {
        console.error('CameraService: خطأ في تشغيل الفيديو:', playError);
        
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
      
      // محاولة استخدام خيارات أبسط إذا فشل الطلب الأول
      if (error instanceof Error && error.message.includes('starting')) {
        console.log('CameraService: محاولة تشغيل الكاميرا بخيارات أبسط...');
        
        try {
          // محاولة مع محددات أبسط
          const simpleStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = document.createElement('video');
          video.id = 'camera-service-video-simple-' + Date.now();
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          video.srcObject = simpleStream;
          
          // تطبيق الأنماط
          this.applyVideoStyles(video);
          
          // تشغيل الفيديو
          await video.play();
          
          this.activeStream = simpleStream;
          this.activeVideoElement = video;
          this.startKeepAlive();
          
          console.log('CameraService: نجحت المحاولة البديلة لتشغيل الكاميرا');
          return video;
        } catch (fallbackError) {
          console.error('CameraService: فشلت المحاولة البديلة أيضًا:', fallbackError);
        }
      }
      
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
        console.log(`CameraService: إيقاف مسار ${track.kind} - ${track.label}`);
        track.stop();
      });
      this.activeStream = null;
    }

    // تنظيف عنصر الفيديو
    if (this.activeVideoElement) {
      console.log('CameraService: تنظيف عنصر الفيديو');
      this.activeVideoElement.srcObject = null;
      
      // إذا كان العنصر جزءًا من DOM، نحاول إزالته
      if (this.activeVideoElement.parentNode) {
        this.activeVideoElement.parentNode.removeChild(this.activeVideoElement);
      }
      
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

      // التحقق من وجود كاميرات
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      if (cameras.length === 0) {
        return {
          success: false,
          message: 'لم يتم العثور على كاميرات في هذا الجهاز'
        };
      }

      // طلب دفق الوسائط لاختباره
      const stream = await navigator.mediaDevices.getUserMedia(this.streamConstraints);
      
      // التحقق من وجود مسارات فيديو
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length === 0) {
        // إيقاف المسارات
        stream.getTracks().forEach(track => track.stop());
        
        return {
          success: false,
          message: 'تم الوصول للجهاز لكن بدون مسارات فيديو'
        };
      }
      
      // عرض معلومات الكاميرا
      const cameraInfo = videoTracks[0].label || 'كاميرا غير معروفة';
      console.log(`CameraService: تم اختبار الكاميرا بنجاح: ${cameraInfo}`);
      
      // الاختبار ناجح، إيقاف المسارات
      videoTracks.forEach(track => track.stop());

      return {
        success: true,
        message: `الكاميرا تعمل بشكل صحيح: ${cameraInfo}`
      };
    } catch (error) {
      console.error('CameraService: فشل اختبار الكاميرا:', error);
      return {
        success: false,
        message: `فشل اختبار الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }

  /**
   * تطبيق أنماط على عنصر الفيديو للتأكد من ظهوره بشكل صحيح
   */
  private applyVideoStyles(video: HTMLVideoElement): void {
    // تطبيق كل الأنماط المطلوبة لضمان رؤية الفيديو
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
    video.style.backgroundColor = '#000000';
    
    // إضافة كلاس مخصص للفيديو
    video.classList.add('scanner-video');
    video.classList.add('camera-view-video');
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
}

// تصدير نسخة واحدة من الخدمة
export const cameraService = CameraService.getInstance();
