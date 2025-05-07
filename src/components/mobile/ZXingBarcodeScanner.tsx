
import React, { useEffect, useRef } from 'react';
import { useZXingScanner } from '@/hooks/scanner/useZXingScanner';
import { ScannerContainer } from './scanner/ScannerContainer';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import '@/styles/zxing-scanner.css';
import { App } from '@capacitor/app';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
  // استخدام hook الماسح الضوئي مع طلب الأذونات المباشر
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry
  } = useZXingScanner({ onScan, onClose });
  
  // تهيئة المكون مع طلب الأذونات إن لم تكن موجودة
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تهيئة المكون');
    
    // التحقق من الإذن وطلبه إذا لم يكن موجوداً
    const setupScanner = async () => {
      try {
        // طلب الإذن مباشرة عند تحميل المكون
        console.log('[ZXingBarcodeScanner] محاولة طلب إذن الكاميرا...');
        
        // اختبار إذا كان الإذن موجود مسبقًا
        const permissionStatus = await scannerPermissionService.checkPermission();
        
        if (permissionStatus) {
          console.log('[ZXingBarcodeScanner] إذن الكاميرا موجود مسبقًا، بدء المسح...');
          startScan();
          return;
        }
        
        // عرض رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'المطلوب إذن الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        // محاولة طلب الإذن بأكثر من طريقة
        const granted = await requestPermission();
        
        if (!granted) {
          console.log('[ZXingBarcodeScanner] لم يتم منح الإذن، محاولة مع تفعيل وضع القوة...');
          
          // محاولة ثانية مع إظهار رسالة توضيحية إضافية
          await Toast.show({
            text: 'يرجى السماح بالوصول للكاميرا لاستخدام الماسح الضوئي',
            duration: 'long'
          });
          
          // يمكننا محاولة طلب الإذن مباشرةً من الخدمة
          const serviceGranted = await scannerPermissionService.requestPermission();
          
          if (!serviceGranted) {
            console.log('[ZXingBarcodeScanner] لم يتم منح الإذن حتى بعد المحاولة الثانية');
            
            // عرض رسالة توضيحية للمستخدم حول كيفية تمكين الإذن يدويًا
            const platform = window.Capacitor?.getPlatform();
            const settingsMessage = platform === 'ios' 
              ? 'افتح الإعدادات > الخصوصية > الكاميرا وقم بالسماح للتطبيق'
              : 'افتح الإعدادات > التطبيقات > مخزن الطعام > الأذونات وقم بتمكين الكاميرا';
              
            await Toast.show({
              text: `لم يتم منح إذن الكاميرا. ${settingsMessage}`,
              duration: 'long'
            });
            
            // محاولة فتح إعدادات التطبيق
            setTimeout(() => {
              try {
                scannerPermissionService.openAppSettings();
              } catch (e) {
                console.error('[ZXingBarcodeScanner] خطأ في فتح الإعدادات:', e);
              }
            }, 1500);
            
            return;
          }
        }
        
        // بدء المسح إذا كان لدينا إذن
        console.log('[ZXingBarcodeScanner] تم منح الإذن، محاولة بدء المسح...');
        startScan().catch(e => 
          console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', e)
        );
      } catch (error) {
        console.error('[ZXingBarcodeScanner] خطأ في إعداد الماسح:', error);
      }
    };
    
    setupScanner();
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      console.log('[ZXingBarcodeScanner] تنظيف المكون');
      
      stopScan().catch(e => 
        console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [hasPermission, startScan, stopScan, requestPermission]);

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] scanner-container" 
      style={{
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
      data-testid="zxing-barcode-scanner"
    >
      <ScannerContainer
        isManualEntry={isManualEntry}
        hasScannerError={hasScannerError}
        isLoading={isLoading}
        hasPermission={hasPermission}
        isScanningActive={isScanningActive}
        lastScannedCode={lastScannedCode}
        onScan={onScan}
        onClose={onClose}
        startScan={startScan}
        stopScan={stopScan}
        handleManualEntry={handleManualEntry}
        handleManualCancel={handleManualCancel}
        handleRequestPermission={requestPermission}
        handleRetry={handleRetry}
      />
    </div>
  );
};

export default ZXingBarcodeScanner;
