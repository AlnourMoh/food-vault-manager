
/**
 * تنفيذ خدمة الماسح الضوئي باستخدام مكتبة ZXing
 */

import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { ZXingScannerOptions, ZXingScanResult } from '@/types/zxing-scanner';
import { BaseScannerService } from '../base/BaseScannerService';
import { ScannerPermissionService } from '../permission/ScannerPermissionService';
import { ScannerUIService } from '../ui/ScannerUIService';

export class ZXingImplementation extends BaseScannerService {
  private reader: BrowserMultiFormatReader | null = null;
  private permissionService: ScannerPermissionService;
  private uiService: ScannerUIService;
  private videoElement: HTMLVideoElement | null = null;
  
  constructor() {
    super();
    this.permissionService = new ScannerPermissionService();
    this.uiService = new ScannerUIService();
    this.initReader();
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
        console.log('[ZXingImplementation] تمت تهيئة قارئ الباركود بنجاح');
      }
    } catch (error) {
      console.error('[ZXingImplementation] خطأ في تهيئة قارئ الباركود:', error);
      this.reader = null;
    }
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
    const result = await this.permissionService.requestPermission();
    this.hasPermission = result.granted;
    return result;
  }
  
  /**
   * بدء عملية المسح
   */
  public async startScan(options: ZXingScannerOptions = {}, onScan: (result: ZXingScanResult) => void): Promise<boolean> {
    try {
      if (this.isScanning) {
        console.log('[ZXingImplementation] الماسح نشط بالفعل');
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
          return false;
        }
      }
      
      // إنشاء عنصر الفيديو إذا لم يكن موجوداً
      this.videoElement = this.uiService.createVideoElement();
      
      // تعيين العناصر المرئية
      this.uiService.activateScanningUI(this.videoElement);
      
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
          this.videoElement, 
          (result, error) => {
            if (result) {
              console.log('[ZXingImplementation] تم العثور على باركود:', result);
              
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
                console.error('[ZXingImplementation] خطأ في فك تشفير الباركود:', error);
              }
            }
          }
        );
        
        console.log('[ZXingImplementation] بدأ المسح بنجاح');
        return true;
      } catch (error) {
        console.error('[ZXingImplementation] خطأ في بدء المسح:', error);
        this.stopScan();
        return false;
      }
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
      
      this.uiService.deactivateScanningUI();
      
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
      console.error('[ZXingImplementation] خطأ في مسح الصورة:', error);
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
    
    this.uiService.dispose();
    this.reader = null;
    this.videoElement = null;
  }
}
