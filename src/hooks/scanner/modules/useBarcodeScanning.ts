
import { useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';

interface UseBarcodeScanningProps {
  onScan: (code: string) => void;
  onScanError?: (error: string) => void;
  onScanComplete?: () => void;
}

export const useBarcodeScanning = ({
  onScan,
  onScanError = () => {},
  onScanComplete = () => {}
}: UseBarcodeScanningProps) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const listenerRef = useRef<any>(null);

  // بدء المسح الضوئي
  const startScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useBarcodeScanning] بدء المسح الضوئي');

      // التحقق من دعم المسح الضوئي
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useBarcodeScanning] ملحق MLKitBarcodeScanner غير متوفر، استخدام المحاكاة');
        setCameraActive(true);
        setIsScanningActive(true);
        
        // محاكاة نجاح المسح
        await Toast.show({
          text: 'تم تفعيل المسح الضوئي (وضع المحاكاة)',
          duration: 'short'
        });
        return true;
      }

      // التحقق من دعم الجهاز للمسح الضوئي
      const supported = await BarcodeScanner.isSupported();
      if (!supported.supported) {
        console.error('[useBarcodeScanning] الجهاز لا يدعم مسح الباركود');
        onScanError('الجهاز لا يدعم مسح الباركود');
        return false;
      }

      // طلب الإذن إذا لزم الأمر
      const permission = await BarcodeScanner.checkPermissions();
      if (permission.camera !== 'granted') {
        console.log('[useBarcodeScanning] طلب إذن الكاميرا');
        const requestResult = await BarcodeScanner.requestPermissions();
        if (requestResult.camera !== 'granted') {
          console.error('[useBarcodeScanning] تم رفض إذن الكاميرا');
          onScanError('تم رفض إذن الكاميرا');
          return false;
        }
      }

      // إزالة المستمع القديم إن وجد
      if (listenerRef.current) {
        console.log('[useBarcodeScanning] إزالة المستمع القديم');
        await listenerRef.current.remove();
        listenerRef.current = null;
      }

      // إضافة مستمع للأحداث
      console.log('[useBarcodeScanning] إضافة مستمع لأحداث المسح');
      listenerRef.current = await BarcodeScanner.addListener(
        'barcodesScanned',
        (result) => {
          console.log('[useBarcodeScanning] تم مسح الرمز:', result);
          if (result.barcodes && result.barcodes.length > 0) {
            const barcode = result.barcodes[0];
            if (barcode.rawValue) {
              onScan(barcode.rawValue);
              stopScan();
              onScanComplete();
            }
          }
        }
      );

      // بدء المسح
      console.log('[useBarcodeScanning] بدء عملية المسح');
      await BarcodeScanner.startScan();
      setCameraActive(true);
      setIsScanningActive(true);

      return true;
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في بدء المسح:', error);
      onScanError(error instanceof Error ? error.message : 'خطأ غير معروف في بدء المسح');
      return false;
    }
  }, [onScan, onScanError, onScanComplete]);

  // إيقاف المسح الضوئي
  const stopScan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[useBarcodeScanning] إيقاف المسح الضوئي');

      // تنظيف المستمع
      if (listenerRef.current) {
        console.log('[useBarcodeScanning] إزالة مستمع أحداث المسح');
        await listenerRef.current.remove();
        listenerRef.current = null;
      }

      // إيقاف المسح إذا كان MLKit متوفراً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('[useBarcodeScanning] إيقاف عملية المسح');
        await BarcodeScanner.stopScan();
      }

      setCameraActive(false);
      setIsScanningActive(false);

      return true;
    } catch (error) {
      console.error('[useBarcodeScanning] خطأ في إيقاف المسح:', error);
      // حتى لو فشل إيقاف المسح، نحاول تنظيف الحالة
      setCameraActive(false);
      setIsScanningActive(false);
      return false;
    }
  }, []);

  return {
    cameraActive,
    isScanningActive,
    startScan,
    stopScan,
    setCameraActive
  };
};
