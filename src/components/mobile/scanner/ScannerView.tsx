
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { PermissionErrorView } from './components/PermissionErrorView';
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
  const isActive = useRef(false);
  
  // تحسين آلية إعداد الماسح والتعامل مع الشفافية
  useEffect(() => {
    console.log("ScannerView mounted");
    
    if (isActive.current) {
      console.log("ScannerView: المكون نشط بالفعل");
      return;
    }
    
    isActive.current = true;
    
    // تطبيق فئة "scanner-viewport" على الجسم للإشارة إلى أن الماسح نشط
    document.body.classList.add('scanner-viewport');
    
    // تعيين الخلفية إلى شفافة للجسم
    document.body.style.background = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    
    return () => {
      console.log("ScannerView unmounting");
      isActive.current = false;
      
      // إزالة فئة الماسح النشط من الجسم
      document.body.classList.remove('scanner-viewport');
      
      // تطبيق تأخير صغير لضمان عودة العناصر إلى حالتها الطبيعية
      setTimeout(() => {
        // إعادة تعيين خلفية الجسم
        document.body.style.background = '';
        document.body.style.backgroundColor = '';
        
        // التأكد من إظهار الهيدر والفوتر
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
  }, []);

  if (hasPermissionError) {
    return <PermissionErrorView
      onRequestPermission={onRequestPermission || (() => {})}
      onManualEntry={onManualEntry}
      onStop={onStop}
    />;
  }

  return (
    <div className={styles.scannerLayout}>
      {/* عرض الكاميرا سيظهر هنا، الخلفية تكون شفافة لإظهار عرض الكاميرا الحي */}
      <div className={styles.cameraViewport} />
      
      <div className={styles.scannerInfoText}>
        وجّه كاميرا هاتفك نحو الباركود
      </div>
      
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
