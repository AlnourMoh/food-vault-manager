
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
          await setupScannerBackground();
          
          // تطبيق الأنماط المطلوبة للكاميرا
          document.documentElement.style.background = 'transparent';
          document.body.style.background = 'transparent';
          document.body.classList.add('scanner-active');
        } catch (e) {
          console.error('Error setting up scanner:', e);
        }
      }
    };
    
    setupScanner();
    
    return () => {
      console.log("ScannerView unmounting");
      scannerActive.current = false;
      cleanupScannerBackground();
      document.body.classList.remove('scanner-active');
      document.documentElement.style.background = '';
      document.body.style.background = '';
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
