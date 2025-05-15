
import { useState } from 'react';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

// تأكد من استيراد تعريفات الأنواع الإضافية
import '@/types/barcode-scanner-augmentation.d.ts';

export const useMLKitScanner = () => {
  const [isScanActive, setIsScanActive] = useState(false);
  const { toast } = useToast();

  const startMLKitScan = async (onSuccess: (code: string) => void): Promise<boolean> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('MLKitScanner: ليست منصة أصلية، لن يتم بدء المسح');
        return false;
      }

      const hasPermission = await BarcodeScanner.checkPermissions();
      if (hasPermission.camera !== 'granted') {
        const requestResult = await BarcodeScanner.requestPermissions();
        if (requestResult.camera !== 'granted') {
          toast({
            title: "فشل في بدء المسح",
            description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // تهيئة الماسح
      try {
        await BarcodeScanner.prepare();
      } catch (error) {
        console.error('[useMLKitScanner] خطأ في تهيئة الماسح:', error);
      }
      
      setIsScanActive(true);

      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Ean13,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE
        ]
      });

      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          onSuccess(code);
          toast({
            title: "تم المسح بنجاح",
            description: `تم مسح الرمز: ${code}`,
          });
        }
      }

      return true;
    } catch (error) {
      console.error('MLKitScanner: خطأ في بدء المسح:', error);
      setIsScanActive(false);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء عملية المسح",
        variant: "destructive"
      });
      return false;
    }
  };

  const stopMLKitScan = async (): Promise<boolean> => {
    try {
      if (isScanActive) {
        try {
          // إيقاف الفلاش إذا كان مفعلاً
          await BarcodeScanner.enableTorch(false).catch(() => {});
          
          // استدعاء stopScan بدون معاملات
          await BarcodeScanner.stopScan();
          
          setIsScanActive(false);
        } catch (error) {
          console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[useMLKitScanner] خطأ في إيقاف المسح:', error);
      return false;
    } finally {
      setIsScanActive(false);
    }
  };

  return {
    startMLKitScan,
    stopMLKitScan,
    isMLKitScanActive: isScanActive
  };
};
