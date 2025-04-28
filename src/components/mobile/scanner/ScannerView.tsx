
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { PermissionErrorView } from './components/PermissionErrorView';
import { useScannerUI } from '@/hooks/scanner/useScannerUI';
import styles from './scanner.module.css';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

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
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  useEffect(() => {
    console.log("ScannerView mounted, hasPermissionError:", hasPermissionError);
    
    const setupScanner = async () => {
      if (!hasPermissionError) {
        try {
          console.log("Setting up scanner UI");
          scannerActive.current = true;
          
          // تطبيق خصائص خاصة للشفافية والكاميرا
          document.documentElement.classList.add('transparent-bg');
          document.body.classList.add('transparent-bg', 'scanner-active');
          document.documentElement.style.background = 'transparent';
          document.documentElement.style.backgroundColor = 'transparent';
          document.documentElement.style.setProperty('--background', 'transparent', 'important');
          document.body.style.background = 'transparent';
          document.body.style.backgroundColor = 'transparent';
          document.body.style.setProperty('--background', 'transparent', 'important');
          
          // تهيئة الكاميرا والشفافية بشكل كامل
          await setupScannerBackground();
          
          // محاولة مباشرة لإيقاف وإعادة تشغيل الفلاش لتنشيط الكاميرا
          if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
            try {
              // التحقق من توفر الفلاش وتفعيله لتنشيط الكاميرا
              const torchResult = await BarcodeScanner.isTorchAvailable();
              console.log("[ScannerView] هل يتوفر الفلاش:", torchResult.available);
              
              if (torchResult.available) {
                await BarcodeScanner.enableTorch();
                setTimeout(async () => {
                  try {
                    await BarcodeScanner.disableTorch();
                  } catch (e) {}
                }, 300);
              }
            } catch (e) {}
          }
          
          // إنشاء عنصر مخصص لعرض الكاميرا بشكل أفضل
          const cameraElement = document.createElement('div');
          cameraElement.id = 'camera-fullscreen-element';
          cameraElement.className = styles.cameraViewport;
          document.body.appendChild(cameraElement);
          
          // تعديل الحوار ليكون شفافًا تمامًا
          const dialogs = document.querySelectorAll('[role="dialog"], [class*="DialogOverlay"], [class*="DialogContent"]');
          dialogs.forEach(dialog => {
            if (dialog instanceof HTMLElement) {
              dialog.style.background = 'transparent';
              dialog.style.backgroundColor = 'transparent';
              dialog.style.boxShadow = 'none';
              dialog.style.setProperty('--background', 'transparent', 'important');
            }
          });
        } catch (e) {
          console.error('Error setting up scanner:', e);
        }
      }
    };
    
    setupScanner();
    
    return () => {
      console.log("ScannerView unmounting");
      scannerActive.current = false;
      
      // تنظيف الموارد
      cleanupScannerBackground();
      
      // إزالة العناصر المضافة
      const cameraElement = document.getElementById('camera-fullscreen-element');
      if (cameraElement) {
        cameraElement.remove();
      }
      
      document.body.classList.remove('scanner-active');
      document.documentElement.classList.remove('transparent-bg');
      document.body.classList.remove('transparent-bg');
      
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.removeProperty('--background');
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
      document.body.style.removeProperty('--background');
    };
  }, [hasPermissionError]);

  if (hasPermissionError) {
    return <PermissionErrorView
      onRequestPermission={onRequestPermission || (() => {})}
      onManualEntry={onManualEntry}
      onStop={onStop}
    />;
  }

  return (
    <div className={styles.scannerLayout}>
      <div className={styles.cameraViewport} />
      
      <ScannerStatusIndicator />
      
      <div className={styles.scannerContainer}>
        <ScannerFrame>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-white/70 animate-pulse" />
            <div className="h-full w-px bg-white/70 animate-pulse" />
          </div>
        </ScannerFrame>
        
        <ScannerControls
          onToggleFlash={() => {}}
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
