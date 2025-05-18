import { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import '@/types/barcode-scanner-augmentation.d.ts';

export const useScannerState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  // إنهاء عملية المسح وتحرير الموارد
  const cleanupScanner = async () => {
    console.log('[useScannerState] تنظيف الماسح');
      
    // محاولة إيقاف المسح إذا كان الملحق متاحًا
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      try {
        await BarcodeScanner.enableTorch(false).catch(() => {});
        
        // Fixed: call stopScan without arguments
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('[useScannerState] خطأ في إغلاق الماسح:', error);
      }
    }
    
    console.log('[useScannerState] تم الانتهاء من تنظيف الماسح');
  };

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    isScanning,
    setIsScanning
  };
};
