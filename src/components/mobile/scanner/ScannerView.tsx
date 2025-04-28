
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { PermissionErrorView } from './components/PermissionErrorView';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import styles from './scanner.module.css';

interface ScannerViewProps {
  onStop: () => void;
  hasPermissionError?: boolean;
  onRequestPermission?: () => void;
  onManualEntry?: () => void;
}

export const ScannerView = ({
  onStop,
  hasPermissionError = false,
  onRequestPermission,
  onManualEntry
}: ScannerViewProps) => {
  const scannerActive = useRef(false);
  const flashOn = useRef(false);
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  useEffect(() => {
    console.log("ScannerView mounted, hasPermissionError:", hasPermissionError);
    
    const setupScannerUI = async () => {
      if (!hasPermissionError) {
        try {
          console.log("Setting up scanner UI");
          scannerActive.current = true;
          
          // تهيئة الخلفية للكاميرا - مهم للعرض الصحيح
          await setupScannerBackground();
          
          // تأكد من تطبيق الشفافية على كل العناصر
          document.documentElement.style.background = 'transparent';
          document.body.style.background = 'transparent';
          
          // إضافة فئة خاصة لواجهة المستخدم أثناء المسح
          document.body.classList.add('scanner-active');
        } catch (e) {
          console.error('Error setting up scanner UI:', e);
        }
      }
    };
    
    setupScannerUI();
    
    // تنظيف عند إزالة المكون
    return () => {
      console.log("ScannerView unmounting - cleaning up UI");
      try {
        scannerActive.current = false;
        cleanupScannerBackground();
        
        // إزالة الفئات والأنماط
        document.body.classList.remove('scanner-active');
        document.documentElement.style.background = '';
        document.body.style.background = '';
      } catch (e) {
        console.error('Error restoring UI on unmount:', e);
      }
    };
  }, [hasPermissionError, setupScannerBackground, cleanupScannerBackground]);

  const toggleFlashlight = async () => {
    try {
      console.log(`Toggling flashlight`);
      
      // محاولة استخدام MLKit أولاً
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
          if (flashOn.current) {
            await BarcodeScanner.disableTorch();
          } else {
            await BarcodeScanner.enableTorch();
          }
          flashOn.current = !flashOn.current;
          return;
        } catch (error) {
          console.error('Error toggling MLKit flashlight:', error);
        }
      }
      
      // محاولة استخدام BarcodeScanner التقليدي كخيار احتياطي
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.toggleTorch();
        flashOn.current = !flashOn.current;
      }
    } catch (error) {
      console.error('Error toggling flashlight:', error);
    }
  };

  if (hasPermissionError) {
    return (
      <PermissionErrorView
        onRequestPermission={onRequestPermission || (() => {})}
        onManualEntry={onManualEntry}
        onStop={onStop}
      />
    );
  }

  return (
    <div className={styles.scannerLayout}>
      {/* إضافة عنصر لمنطقة الكاميرا للمساعدة في تصحيح الخلفية */}
      <div className={styles.cameraViewport} id="camera-viewport" />
      
      <ScannerStatusIndicator />
      
      <div className={styles.scannerContainer}>
        <ScannerFrame>
          {/* يمكننا إضافة مؤشر بصري هنا للتأكيد على وضعية المسح */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-white/70 animate-pulse" />
            <div className="h-full w-px bg-white/70 animate-pulse" />
          </div>
        </ScannerFrame>
        
        <ScannerControls
          onToggleFlash={toggleFlashlight}
          onManualEntry={onManualEntry || (() => {})}
        />
        
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-[1000]">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full h-16 w-16 flex items-center justify-center"
            onClick={onStop}
          >
            <X className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};
