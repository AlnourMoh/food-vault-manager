
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
  const cameraViewportRef = useRef<HTMLDivElement | null>(null);
  const addedElements = useRef<HTMLElement[]>([]);

  // تحسين آلية الشفافية مع عزل آثارها عن بقية التطبيق
  useEffect(() => {
    console.log("ScannerView mounted, hasPermissionError:", hasPermissionError);
    
    // تأكد من عدم تداخل عمليات التهيئة
    if (scannerActive.current) {
      console.log("ScannerView: المكون نشط بالفعل، تخطي التهيئة المضاعفة");
      return;
    }
    
    scannerActive.current = true;
    
    const setupScanner = async () => {
      if (!hasPermissionError) {
        try {
          console.log("Setting up scanner UI");
          
          // 1. تطبيق الشفافية على منطقة الماسح فقط من خلال حاوية مخصصة
          await setupScannerBackground();
          
          // 2. إنشاء عنصر محدد للكاميرا
          if (!cameraViewportRef.current) {
            cameraViewportRef.current = document.createElement('div');
            cameraViewportRef.current.id = 'camera-viewport';
            cameraViewportRef.current.className = `${styles.cameraViewport} camera-active`;
            document.body.appendChild(cameraViewportRef.current);
            addedElements.current.push(cameraViewportRef.current);
          }
          
          // 3. تنشيط الكاميرا عن طريق MLKit
          if (window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner')) {
            try {
              const torchResult = await BarcodeScanner.isTorchAvailable();
              if (torchResult.available) {
                await BarcodeScanner.enableTorch();
                setTimeout(async () => {
                  try {
                    await BarcodeScanner.disableTorch();
                  } catch (e) {}
                }, 300);
              }
            } catch (e) {
              console.warn("Error checking torch availability:", e);
            }
          }
          
          // 4. تأكيد تخصيص فئات للهيدر والفوتر لحمايتهما
          document.querySelectorAll('header, footer, nav').forEach(element => {
            if (element instanceof HTMLElement) {
              element.classList.add('app-header');
              // تطبيق أنماط إضافية إذا كانت ضمن صفحة معينة مثل لوحة التحكم
              if (window.location.pathname.includes('/admin/')) {
                element.classList.add('admin-header');
              }
            }
          });
          
        } catch (e) {
          console.error('Error setting up scanner:', e);
        }
      }
    };
    
    setupScanner();
    
    return () => {
      console.log("ScannerView unmounting, cleaning up...");
      scannerActive.current = false;
      
      // 1. تنظيف موارد الماسح
      cleanupScannerBackground(true);
      
      // 2. إزالة عنصر الكاميرا
      if (cameraViewportRef.current) {
        cameraViewportRef.current.remove();
        cameraViewportRef.current = null;
      }
      
      // 3. إزالة العناصر المضافة
      for (const element of addedElements.current) {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
      addedElements.current = [];
      
      // 4. إعادة تعيين أنماط الهيدر والفوتر بشكل قسري
      setTimeout(() => {
        document.querySelectorAll('header, .app-header').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        });
        
        document.querySelectorAll('footer, nav, .app-footer').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.background = 'white';
            el.style.backgroundColor = 'white';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        });
      }, 300);
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
