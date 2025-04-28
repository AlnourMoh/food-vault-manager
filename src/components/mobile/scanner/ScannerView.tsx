
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { PermissionErrorView } from './components/PermissionErrorView';

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

  useEffect(() => {
    console.log("ScannerView mounted, hasPermissionError:", hasPermissionError);
    
    const setupScannerUI = async () => {
      if (!hasPermissionError) {
        try {
          console.log("Setting up scanner UI");
          scannerActive.current = true;
          
          // تحسين طريقة تطبيق الأنماط لتجنب مشكلة الشاشة السوداء
          setTimeout(() => {
            document.body.style.visibility = 'visible';
            document.body.classList.add('barcode-scanner-active');
            document.body.classList.add('scanner-transparent-background');
            document.body.style.background = 'transparent';
          }, 100);
        } catch (e) {
          console.error('Error setting up scanner UI:', e);
        }
      }
    };
    
    setupScannerUI();
    
    // تنظيف عند إزالة المكون - تحسين آلية التنظيف
    return () => {
      console.log("ScannerView unmounting - cleaning up UI");
      try {
        scannerActive.current = false;
        
        // إعادة الخصائص إلى قيمها الافتراضية
        setTimeout(() => {
          document.body.style.visibility = '';
          document.body.classList.remove('barcode-scanner-active');
          document.body.classList.remove('scanner-transparent-background');
          document.body.style.background = '';
        }, 10);
      } catch (e) {
        console.error('Error restoring UI on unmount:', e);
      }
    };
  }, [hasPermissionError]);

  const toggleFlashlight = async () => {
    try {
      console.log(`Toggling flashlight`);
      
      // محاولة استخدام MLKit أولاً
      if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
          await BarcodeScanner.toggleTorch();
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
    <div className="absolute inset-0 flex flex-col items-center bg-black bg-opacity-50 z-[1000]">
      <ScannerStatusIndicator />
      
      <div className="flex-1 w-full relative flex items-center justify-center">
        <ScannerFrame />
        
        <ScannerControls
          onToggleFlash={toggleFlashlight}
          onManualEntry={onManualEntry || (() => {})}
        />
        
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
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

