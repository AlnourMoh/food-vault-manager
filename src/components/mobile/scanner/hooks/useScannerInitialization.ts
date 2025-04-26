
import { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useScannerInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        console.log("[useScannerInitialization] تهيئة الماسح الضوئي...");
        
        // Check if running in Capacitor environment
        if (window.Capacitor) {
          try {
            // Check if the BarcodeScanner plugin is available
            const isPluginAvailable = window.Capacitor.isPluginAvailable('BarcodeScanner');
            console.log("[useScannerInitialization] هل ماسح الباركود متاح:", isPluginAvailable);
            
            if (isPluginAvailable) {
              // Check permission
              const permission = await BarcodeScanner.checkPermission({ force: false });
              console.log("[useScannerInitialization] حالة الإذن:", permission.granted);
              
              // Prepare the scanner in advance
              try {
                await BarcodeScanner.prepare();
                console.log("[useScannerInitialization] تم تجهيز الماسح");
              } catch (prepareError) {
                console.warn("[useScannerInitialization] خطأ في تجهيز الماسح:", prepareError);
              }
            }
          } catch (supportError) {
            console.warn("[useScannerInitialization] خطأ في فحص دعم الماسح:", supportError);
          }
        }
        
        console.log("[useScannerInitialization] اكتملت تهيئة الماسح");
      } catch (error) {
        console.error("[useScannerInitialization] خطأ في تهيئة الماسح:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeScanner();
    
    return () => {
      // Cleanup on component unmount
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("[useScannerInitialization] تنظيف موارد الماسح عند إلغاء التحميل");
        BarcodeScanner.hideBackground().catch(error => {
          console.warn("[useScannerInitialization] خطأ في إخفاء خلفية الماسح:", error);
        });
      }
    };
  }, []);
  
  return { isInitializing };
};
