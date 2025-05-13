
import React, { useEffect, useState } from 'react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ScannerErrorView } from './ScannerErrorView';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { PermissionPrompt } from './PermissionPrompt';
import { useScannerPermissionHandlers } from '../hooks/useScannerPermissionHandlers';
import { Spinner } from '@/components/ui/spinner';

interface ScanProductContentProps {
  hasScannerError: boolean;
  showScanner: boolean;
  isProcessing: boolean;
  onRetry: () => void;
  onScan: (code: string) => void;
  onClose: () => void;
}

export const ScanProductContent = ({
  hasScannerError,
  showScanner,
  isProcessing,
  onRetry,
  onScan,
  onClose
}: ScanProductContentProps) => {
  // استخدام hook للتحقق من أذونات الكاميرا
  const { hasPermission, requestPermission, openAppSettings } = useCameraPermissions();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [scannerMounted, setScannerMounted] = useState(false);
  
  const {
    permissionError,
    handleRequestPermission,
    handleOpenSettings
  } = useScannerPermissionHandlers(requestPermission, openAppSettings);

  // التأكد من وجود إذن الكاميرا قبل عرض الماسح
  useEffect(() => {
    if (showScanner) {
      console.log('ScanProductContent: التحقق من إذن الكاميرا...');
      
      const checkPermission = async () => {
        try {
          // إذا لم يكن لدينا حالة الإذن بعد، نتحقق منها
          if (hasPermission === null) {
            return; // سننتظر حتى يتم تحديث حالة الإذن بواسطة الهوك
          }
          
          // إذا لم يكن لدينا إذن، نعرض واجهة طلب الإذن
          if (hasPermission === false) {
            console.log('ScanProductContent: لا يوجد إذن للكاميرا، عرض واجهة طلب الإذن');
            setShowPermissionPrompt(true);
            setScannerMounted(false);
          } else {
            setShowPermissionPrompt(false);
            // تأخير قصير لتفادي مشاكل التحميل المتزامنة
            setTimeout(() => {
              setScannerMounted(true);
            }, 300);
          }
        } catch (error) {
          console.error('ScanProductContent: خطأ في التحقق من إذن الكاميرا:', error);
          setShowPermissionPrompt(true);
          setScannerMounted(false);
        }
      };
      
      checkPermission();
    } else {
      setShowPermissionPrompt(false);
      setScannerMounted(false);
    }
  }, [showScanner, hasPermission]);
  
  useEffect(() => {
    return () => {
      // تنظيف عند إزالة المكون
      console.log('ScanProductContent: تم إلغاء التحميل والتنظيف');
    };
  }, []);
  
  const handleManualEntry = () => {
    // يمكن إضافة وظيفة إدخال الرمز يدويًا هنا
    console.log('الانتقال إلى الإدخال اليدوي');
  };

  // إضافة شاشة تحميل للحظات عرض الماسح الأولى
  if (showScanner && !scannerMounted && !showPermissionPrompt && !hasScannerError) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center">
        <Spinner size="lg" className="mb-4" />
        <p className="text-center text-gray-600">جاري تهيئة الماسح...</p>
      </div>
    );
  }

  return (
    <div 
      className="h-[calc(100vh-120px)] relative flex items-center justify-center overflow-hidden"
      style={{
        position: 'relative'
      }}
    >
      {hasScannerError ? (
        <ScannerErrorView onRetry={onRetry} />
      ) : showPermissionPrompt ? (
        <PermissionPrompt
          permissionError={permissionError}
          handleRequestPermission={handleRequestPermission}
          handleOpenSettings={handleOpenSettings}
          handleManualEntry={handleManualEntry}
          onClose={onClose}
        />
      ) : (
        showScanner && scannerMounted && (
          <div className="scanner-container" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
          }}>
            <ZXingBarcodeScanner
              onScan={onScan}
              onClose={onClose}
              autoStart={true}
            />
          </div>
        )
      )}
    </div>
  );
};
