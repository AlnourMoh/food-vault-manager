
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { ZXingScannerOptions, ZXingScanResult, ZXingPermissionStatus } from '@/types/zxing-scanner';
import { Toast } from '@capacitor/toast';

/**
 * خدمة الماسح الضوئي باستخدام مكتبة ZXing
 */
export class ZXingService {
  private static instance: ZXingService;
  private reader: BrowserMultiFormatReader | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private isScanning: boolean = false;
  private hasPermission: boolean = false;
  private scanInterval: number | null = null;
  
  private constructor() {
    // إنشاء الماسح عند الحاجة فقط
    this.initReader();
  }
  
  public static getInstance(): ZXingService {
    if (!ZXingService.instance) {
      ZXingService.instance = new ZXingService();
    }
    return ZXingService.instance;
  }
  
  /**
   * تهيئة قارئ ZXing
   */
  private initReader(): void {
    try {
      if (!this.reader) {
        // تكوين القارئ مع إعدادات محسنة
        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.DATA_MATRIX,
          BarcodeFormat.ITF
        ]);
        
        this.reader = new BrowserMultiFormatReader(hints);
        console.log('[ZXingService] تمت تهيئة قارئ الباركود بنجاح');
      }
    } catch (error) {
      console.error('[ZXingService] خطأ في تهيئة قارئ الباركود:', error);
      this.reader = null;
    }
  }
  
  /**
   * التحقق من دعم الجهاز للماسح
   */
  public async isSupported(): Promise<boolean> {
    try {
      // التحقق من دعم getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('[ZXingService] getUserMedia غير مدعوم في هذا المتصفح');
        return false;
      }

      // التحقق من دعم مدخلات الفيديو
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      
      if (!hasVideoInput) {
        console.warn('[ZXingService] لا توجد كاميرات متاحة على هذا الجهاز');
        return false;
      }

      return true;
    } catch (error) {
      console.error('[ZXingService] خطأ في التحقق من الدعم:', error);
      return false;
    }
  }
  
  /**
   * إنشاء عنصر فيديو للمسح
   */
  private createVideoElement(): HTMLVideoElement {
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
   * طلب إذن الكاميرا
   */
  public async requestPermission(): Promise<ZXingPermissionStatus> {
    try {
      if (!await this.isSupported()) {
        return { granted: false, error: 'الجهاز لا يدعم الماسح الضوئي' };
      }
      
      // محاولة الوصول إلى الكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // إغلاق المسار فوراً لأننا نحتاج فقط التحقق من الإذن
      stream.getTracks().forEach(track => track.stop());
      
      this.hasPermission = true;
      console.log('[ZXingService] تم الحصول على إذن الكاميرا بنجاح');
      
      return { granted: true };
    } catch (error: any) {
      console.error('[ZXingService] خطأ في طلب إذن الكاميرا:', error);
      
      this.hasPermission = false;
      
      // تحديد نوع الخطأ بشكل أفضل
      let errorMessage = 'حدث خطأ غير معروف';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'تم رفض إذن الكاميرا';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'لم يتم العثور على كاميرا في هذا الجهاز';
      } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
        errorMessage = 'الكاميرا قيد الاستخدام بالفعل من قبل تطبيق آخر';
      }
      
      return { granted: false, error: errorMessage };
    }
  }
  
  /**
   * بدء عملية المسح
   */
  public async startScan(options: ZXingScannerOptions = {}, onScan: (result: ZXingScanResult) => void): Promise<boolean> {
    try {
      if (this.isScanning) {
        console.log('[ZXingService] الماسح نشط بالفعل');
        return true;
      }
      
      // التحقق من وجود القارئ وإنشائه إذا لم يكن موجوداً
      if (!this.reader) {
        this.initReader();
        
        if (!this.reader) {
          throw new Error('فشل في تهيئة قارئ الباركود');
        }
      }
      
      // التحقق من الإذن أولاً
      if (!this.hasPermission) {
        const permissionStatus = await this.requestPermission();
        if (!permissionStatus.granted) {
          await Toast.show({
            text: permissionStatus.error || 'لم يتم الحصول على إذن الكاميرا',
            duration: 'long'
          });
          return false;
        }
      }
      
      // إنشاء عنصر الفيديو إذا لم يكن موجوداً
      const videoElement = this.createVideoElement();
      
      // تعيين العناصر المرئية
      document.body.classList.add('zxing-scanning');
      videoElement.style.opacity = '1';
      
      // بدء المسح المستمر
      this.isScanning = true;
      
      try {
        // بدء المسح من الكاميرا الخلفية
        await this.reader.decodeFromConstraints(
          { 
            video: { 
              facingMode: 'environment',
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              ...options.constraints
            }
          }, 
          videoElement, 
          (result, error) => {
            if (result) {
              console.log('[ZXingService] تم العثور على باركود:', result);
              
              // استدعاء رد الاتصال بالنتيجة
              onScan({
                text: result.getText(),
                format: result.getBarcodeFormat(),
                resultPoints: result.getResultPoints().map(point => ({ 
                  x: point.getX(), 
                  y: point.getY() 
                })),
                timestamp: Date.now(),
              });
              
              // إيقاف المسح بعد العثور على نتيجة
              this.stopScan();
            } else if (error) {
              // نسجل أخطاء فك التشفير فقط إذا لم تكن خطأ عدم العثور على باركود
              if (error.name !== 'NotFoundException') {
                console.error('[ZXingService] خطأ في فك تشفير الباركود:', error);
              }
            }
          }
        );
        
        console.log('[ZXingService] بدأ المسح بنجاح');
        return true;
      } catch (error) {
        console.error('[ZXingService] خطأ في بدء المسح:', error);
        this.stopScan();
        return false;
      }
    } catch (error) {
      console.error('[ZXingService] خطأ في بدء المسح:', error);
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
      
      console.log('[ZXingService] إيقاف المسح...');
      
      // إيقاف عملية المسح
      if (this.reader) {
        this.reader.reset();
      }
      
      // إزالة عنصر الفيديو من DOM
      if (this.videoElement) {
        this.videoElement.style.opacity = '0';
        
        // نتأكد من إيقاف جميع مسارات الفيديو
        if (this.videoElement.srcObject) {
          const stream = this.videoElement.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          this.videoElement.srcObject = null;
        }
      }
      
      // إزالة الفئات والأنماط
      document.body.classList.remove('zxing-scanning');
      
      // إعادة تعيين الحالة
      this.isScanning = false;
      
      console.log('[ZXingService] تم إيقاف المسح بنجاح');
    } catch (error) {
      console.error('[ZXingService] خطأ في إيقاف المسح:', error);
      
      // تأكيد على إعادة تعيين الحالة حتى في حالة الخطأ
      this.isScanning = false;
    }
  }
  
  /**
   * مسح الباركود من صورة
   */
  public async scanFromImage(imageSource: string | Blob | File): Promise<ZXingScanResult | null> {
    try {
      if (!this.reader) {
        this.initReader();
        
        if (!this.reader) {
          throw new Error('فشل في تهيئة قارئ الباركود');
        }
      }
      
      let imageUrl: string;
      
      // تحويل البيانات إلى URL إذا كانت ملفاً أو blob
      if (typeof imageSource !== 'string') {
        imageUrl = URL.createObjectURL(imageSource);
      } else {
        imageUrl = imageSource;
      }
      
      // محاولة فك تشفير الصورة
      const result = await this.reader.decodeFromImageUrl(imageUrl);
      
      // تنظيف URL محلي إذا تم إنشاؤه
      if (typeof imageSource !== 'string') {
        URL.revokeObjectURL(imageUrl);
      }
      
      if (result) {
        return {
          text: result.getText(),
          format: result.getBarcodeFormat(),
          resultPoints: result.getResultPoints().map(point => ({ 
            x: point.getX(), 
            y: point.getY() 
          })),
          timestamp: Date.now(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('[ZXingService] خطأ في مسح الصورة:', error);
      return null;
    }
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
      console.error('[ZXingService] خطأ في تحويل Canvas إلى ImageData:', error);
      return null;
    }
  }
  
  /**
   * التنظيف عند إلغاء الخدمة
   */
  public dispose(): void {
    this.stopScan().catch(console.error);
    
    if (this.reader) {
      this.reader.reset();
    }
    
    if (this.videoElement && document.body.contains(this.videoElement)) {
      document.body.removeChild(this.videoElement);
    }
    
    this.reader = null;
    this.videoElement = null;
  }
}

// تصدير مثيل واحد من الخدمة للاستخدام في جميع أنحاء التطبيق
export const zxingService = ZXingService.getInstance();
