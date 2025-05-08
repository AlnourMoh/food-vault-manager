
import React, { useEffect, useState } from 'react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ScannerErrorView } from './ScannerErrorView';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { PermissionPrompt } from './PermissionPrompt';
import { useScannerPermissionHandlers } from '../hooks/useScannerPermissionHandlers';

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
          } else {
            setShowPermissionPrompt(false);
          }
        } catch (error) {
          console.error('ScanProductContent: خطأ في التحقق من إذن الكاميرا:', error);
          setShowPermissionPrompt(true);
        }
      };
      
      checkPermission();
    } else {
      setShowPermissionPrompt(false);
    }
  }, [showScanner, hasPermission]);
  
  const handleManualEntry = () => {
    // يمكن إضافة وظيفة إدخال الرمز يدويًا هنا
    console.log('الانتقال إلى الإدخال اليدوي');
  };

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
        showScanner && (
          <div className="scanner-container" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
          }}>
            <ZXingBarcodeScanner
              onScan={onScan}
              onClose={onClose}
            />
          </div>
        )
      )}
    </div>
  );
};
