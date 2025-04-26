
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        if (window.Capacitor) {
          try {
            const available = await BarcodeScanner.isSupported();
            console.log('[Scanner] هل ماسح MLKit متاح:', available);
            
            if (available) {
              const permissions = await BarcodeScanner.checkPermissions();
              console.log('[Scanner] حالة أذونات الكاميرا:', permissions);
            } else {
              console.log('[Scanner] ماسح MLKit غير متاح على هذا الجهاز');
              toast({
                title: "ماسح الباركود غير متوفر",
                description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
                variant: "default"
              });
            }
          } catch (error) {
            console.error('[Scanner] خطأ في فحص توفر ماسح الباركود:', error);
          }
        }
      } catch (error) {
        console.error('[Scanner] خطأ أثناء تهيئة الماسح:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeScanner();
  }, [toast]);

  return { isInitializing };
};
