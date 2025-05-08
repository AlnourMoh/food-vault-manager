
import { useState, useCallback } from 'react';
import { barcodeScannerService } from '@/services/scanner/BarcodeScannerService';
import { Toast } from '@capacitor/toast';

export const useScanOperations = () => {
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = useCallback(async (onScanResult: (code: string) => void) => {
    try {
      setIsScanning(true);
      
      // بدء المسح باستخدام خدمة الماسح الضوئي
      const result = await barcodeScannerService.startScan();
      
      if (!result) {
        setIsScanning(false);
        await Toast.show({
          text: 'تعذر بدء الماسح الضوئي',
          duration: 'short'
        });
      }

      // هنا يمكننا إعداد الاستماع للنتائج باستخدام BarcodeScanner.addListener
      
      return result;
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      setIsScanning(false);
      return false;
    }
  }, []);

  const stopScanning = useCallback(async () => {
    try {
      await barcodeScannerService.stopScan();
      setIsScanning(false);
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
    }
  }, []);

  return {
    isScanning,
    startScanning,
    stopScanning
  };
};
