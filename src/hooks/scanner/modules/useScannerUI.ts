
import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export const useScannerUI = () => {
  // Setup UI for scanning (hide web elements, prepare background)
  const setupScannerBackground = useCallback(async (): Promise<void> => {
    try {
      if (!Capacitor.isNativePlatform()) return;
      
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        // Hide app UI elements that might interfere with the scanner
        document.documentElement.style.setProperty('--scanner-active', '1');
        document.body.classList.add('scanner-active');
        
        // Hide any header or navigation elements
        const elementsToHide = document.querySelectorAll('header, nav, footer');
        elementsToHide.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'none';
          }
        });

        // Show the camera background if supported
        try {
          await BarcodeScanner.showBackground();
        } catch (error) {
          console.error('خطأ في إظهار خلفية الكاميرا:', error);
        }
      }
    } catch (error) {
      console.error('خطأ في إعداد واجهة المسح:', error);
    }
  }, []);

  // Restore UI after scanning
  const restoreUIAfterScanning = useCallback(async (): Promise<void> => {
    try {
      if (!Capacitor.isNativePlatform()) return;
      
      // Reset CSS variables and classes
      document.documentElement.style.setProperty('--scanner-active', '0');
      document.body.classList.remove('scanner-active');
      
      // Show previously hidden elements
      const elementsToShow = document.querySelectorAll('header, nav, footer');
      elementsToShow.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
        }
      });

      // Hide the camera background if needed
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          await BarcodeScanner.hideBackground();
        } catch (error) {
          console.error('خطأ في إخفاء خلفية الكاميرا:', error);
        }
      }
    } catch (error) {
      console.error('خطأ في استعادة واجهة المسح:', error);
    }
  }, []);

  return {
    setupScannerBackground,
    restoreUIAfterScanning
  };
};
