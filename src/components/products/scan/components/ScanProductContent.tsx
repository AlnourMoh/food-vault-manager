
import React, { useEffect, useState } from 'react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ScannerErrorView } from './ScannerErrorView';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { Button } from '@/components/ui/button';
import { Camera, Settings } from 'lucide-react';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { App } from '@capacitor/app';

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
  const { hasPermission, requestPermission } = useCameraPermissions();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

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
        }
      };
      
      checkPermission();
    } else {
      setShowPermissionPrompt(false);
    }
  }, [showScanner, hasPermission]);
  
  const handleRequestPermission = async () => {
    console.log('ScanProductContent: محاولة طلب إذن الكاميرا...');
    try {
      const granted = await requestPermission();
      if (granted) {
        console.log('ScanProductContent: تم منح الإذن بنجاح');
        setShowPermissionPrompt(false);
      } else {
        console.log('ScanProductContent: لم يتم منح الإذن');
        await Toast.show({
          text: 'لم يتم منح إذن الكاميرا. يرجى تمكينه للاستمرار.',
          duration: 'long'
        });
      }
    } catch (error) {
      console.error('ScanProductContent: خطأ في طلب إذن الكاميرا:', error);
    }
  };
  
  const handleOpenSettings = async () => {
    try {
      console.log('ScanProductContent: محاولة فتح إعدادات التطبيق...');
      await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error('ScanProductContent: خطأ في فتح الإعدادات:', error);
      
      // إذا فشل فتح الإعدادات، نقدم تعليمات للمستخدم
      const platformText = window.Capacitor?.getPlatform() === 'ios' 
        ? 'فتح الإعدادات > الخصوصية > الكاميرا > تطبيق مخزن الطعام' 
        : 'فتح الإعدادات > التطبيقات > مخزن الطعام > الأذونات';
      
      await Toast.show({
        text: `يرجى ${platformText} لتمكين إذن الكاميرا`,
        duration: 'long'
      });
    }
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
        <div className="p-4 bg-white rounded-lg shadow-lg max-w-md text-center space-y-4">
          <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <Camera className="h-8 w-8" />
          </div>
          
          <h3 className="text-xl font-bold">لا يوجد إذن للكاميرا</h3>
          <p className="text-muted-foreground">
            المطلوب إذن الكاميرا لتمكين مسح الباركود. يستخدم التطبيق الكاميرا فقط لقراءة الباركود.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={handleRequestPermission}
              className="w-full"
              variant="default"
            >
              <Camera className="h-4 w-4 ml-2" />
              طلب إذن الكاميرا
            </Button>
            
            <Button 
              onClick={handleOpenSettings}
              className="w-full"
              variant="outline"
            >
              <Settings className="h-4 w-4 ml-2" />
              فتح إعدادات التطبيق
            </Button>
          </div>
        </div>
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
