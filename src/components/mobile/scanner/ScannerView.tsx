
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
  const { setupScannerBackground, cleanupScannerBackground } = useScannerUI();

  useEffect(() => {
    console.log("ScannerView mounted, hasPermissionError:", hasPermissionError);
    
    const setupScanner = async () => {
      if (!hasPermissionError) {
        try {
          console.log("Setting up scanner UI");
          scannerActive.current = true;
          
          // تهيئة الكاميرا والشفافية بشكل كامل
          await setupScannerBackground();
          
          // تحسين الشفافية وعرض الكاميرا
          document.documentElement.classList.add('transparent-bg');
          document.body.classList.add('transparent-bg', 'scanner-active');
          
          // إنشاء عنصر مخصص لعرض الكاميرا
          const cameraElement = document.createElement('div');
          cameraElement.id = 'camera-fullscreen-element';
          cameraElement.className = styles.cameraViewport;
          cameraElement.style.position = 'fixed';
          cameraElement.style.inset = '0';
          cameraElement.style.zIndex = '1';
          cameraElement.style.background = 'transparent';
          cameraElement.style.width = '100vw';
          cameraElement.style.height = '100vh';
          document.body.appendChild(cameraElement);
          
          // تحسين خصائص meta للويب فيو
          const viewportMeta = document.querySelector('meta[name="viewport"]');
          if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no');
          }
          
          // إزالة أي عناصر قد تمنع ظهور الكاميرا
          const dialogs = document.querySelectorAll('[role="dialog"], [class*="DialogOverlay"], [class*="DialogContent"]');
          dialogs.forEach(dialog => {
            if (dialog instanceof HTMLElement) {
              dialog.style.background = 'transparent';
              dialog.style.backgroundColor = 'transparent';
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
