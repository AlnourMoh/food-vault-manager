
/**
 * نواة ماسح ZXing
 * يتعامل مع العمليات الأساسية للمسح مثل تهيئة القارئ ومسح الباركود
 */

import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, Result } from '@zxing/library';
import { ZXingScanOptions, ZXingScanResult, ZXingBarcodeFormat } from '@/types/zxing-scanner';

export class ZXingScannerCore {
  private reader: BrowserMultiFormatReader | null = null;
  
  constructor() {
    this.initReader();
  }
  
  /**
   * تهيئة قارئ ZXing
   */
  public initReader(): void {
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
        console.log('[ZXingScannerCore] تمت تهيئة قارئ الباركود بنجاح');
      }
    } catch (error) {
      console.error('[ZXingScannerCore] خطأ في تهيئة قارئ الباركود:', error);
      this.reader = null;
    }
  }
  
  /**
   * تحويل نتيجة ZXing إلى تنسيق ZXingScanResult
   */
  private convertResultToScanResult(result: Result): ZXingScanResult {
    return {
      text: result.getText(),
      format: result.getBarcodeFormat() as unknown as ZXingBarcodeFormat,
      resultPoints: result.getResultPoints().map(point => ({ 
        x: point.getX(), 
        y: point.getY() 
      })),
      timestamp: Date.now(),
    };
  }
  
  /**
   * بدء عملية المسح من عنصر الفيديو
   */
  public async startScanFromVideo(
    videoElement: HTMLVideoElement, 
    options: ZXingScanOptions,
    onScan: (result: ZXingScanResult) => void
  ): Promise<boolean> {
    try {
      if (!this.reader) {
        this.initReader();
        if (!this.reader) {
          throw new Error('فشل في تهيئة قارئ الباركود');
        }
      }
      
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
            console.log('[ZXingScannerCore] تم العثور على باركود:', result);
            const scanResult = this.convertResultToScanResult(result);
            onScan(scanResult);
          } else if (error && error.name !== 'NotFoundException') {
            console.error('[ZXingScannerCore] خطأ في فك تشفير الباركود:', error);
          }
        }
      );
      
      return true;
    } catch (error) {
      console.error('[ZXingScannerCore] خطأ في بدء المسح:', error);
      return false;
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
        return this.convertResultToScanResult(result);
      }
      
      return null;
    } catch (error) {
      console.error('[ZXingScannerCore] خطأ في مسح الصورة:', error);
      return null;
    }
  }
  
  /**
   * إيقاف عمليات المسح
   */
  public reset(): void {
    if (this.reader) {
      this.reader.reset();
    }
  }
  
  /**
   * تنظيف الموارد
   */
  public dispose(): void {
    this.reset();
    this.reader = null;
  }
}
