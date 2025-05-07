
import React, { useEffect, useState } from 'react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ScannerErrorView } from './ScannerErrorView';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { Button } from '@/components/ui/button';
import { Camera, Settings, Keyboard } from 'lucide-react';
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
  const { hasPermission, requestPermission, openAppSettings } = useCameraPermissions();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

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
            setPermissionError("لم يتم منح إذن الكاميرا، يرجى السماح بالوصول للمتابعة");
          } else {
            setShowPermissionPrompt(false);
            setPermissionError(null);
          }
        } catch (error) {
          console.error('ScanProductContent: خطأ في التحقق من إذن الكاميرا:', error);
          setPermissionError("حدث خطأ في التحقق من إذن الكاميرا");
          setShowPermissionPrompt(true);
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
      // عرض رسالة توضيحية
      await Toast.show({
        text: 'جاري طلب إذن الكاميرا...',
        duration: 'short'
      });
      
      const granted = await requestPermission();
      
      if (granted) {
        console.log('ScanProductContent: تم منح الإذن بنجاح');
        setShowPermissionPrompt(false);
        setPermissionError(null);
        
        // إعلام المستخدم
        await Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح!',
          duration: 'short'
        });
      } else {
        console.log('ScanProductContent: لم يتم منح الإذن');
        setPermissionError("تم رفض إذن الكاميرا، يرجى السماح بالوصول من إعدادات جهازك");
        
        // تجربة فتح الإعدادات بعد فشل الطلب
        await Toast.show({
          text: 'لم يتم منح إذن الكاميرا. سيتم توجيهك إلى الإعدادات.',
          duration: 'short'
        });
        
        // تأخير قصير قبل فتح الإعدادات
        setTimeout(() => handleOpenSettings(), 1000);
      }
    } catch (error) {
      console.error('ScanProductContent: خطأ في طلب إذن الكاميرا:', error);
      setPermissionError("حدث خطأ أثناء طلب إذن الكاميرا");
      
      // محاولة أخيرة للتعامل مع الخطأ
      try {
        const platform = window.Capacitor?.getPlatform();
        const message = platform === 'ios' 
          ? 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا لتمكين الإذن' 
          : 'يرجى فتح إعدادات التطبيق > الأذونات لتمكين الكاميرا';
          
        await Toast.show({
          text: message,
          duration: 'long'
        });
      } catch (e) {
        console.error('ScanProductContent: خطأ في عرض الرسالة:', e);
        alert('يرجى تمكين إذن الكاميرا يدويًا من إعدادات جهازك');
      }
    }
  };
  
  const handleOpenSettings = async () => {
    try {
      console.log('ScanProductContent: محاولة فتح إعدادات التطبيق...');
      
      // محاولة فتح الإعدادات
      const opened = await openAppSettings();
      
      if (!opened) {
        // إرشاد المستخدم لفتح الإعدادات يدويًا
        const platform = window.Capacitor?.getPlatform();
        const message = platform === 'ios' 
          ? 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا لتمكين الإذن' 
          : 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات';
          
        await Toast.show({
          text: message,
          duration: 'long'
        });
      }
    } catch (error) {
      console.error('ScanProductContent: خطأ في فتح الإعدادات:', error);
      
      // إرشاد المستخدم لفتح الإعدادات يدويًا مع معلومات تفصيلية
      const platformText = window.Capacitor?.getPlatform() === 'ios' 
        ? 'فتح الإعدادات > الخصوصية > الكاميرا > تطبيق مخزن الطعام' 
        : 'فتح الإعدادات > التطبيقات > مخزن الطعام > الأذونات';
      
      await Toast.show({
        text: `يرجى ${platformText} لتمكين إذن الكاميرا`,
        duration: 'long'
      });
    }
  };
  
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
        <div className="scanner-permission-overlay">
          <div className="permission-error-view">
            <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Camera className="h-8 w-8" />
            </div>
            
            <h3 className="text-xl font-bold mt-4">لا يوجد إذن للكاميرا</h3>
            
            {permissionError && (
              <p className="text-sm text-red-600 mt-2 mb-4">
                {permissionError}
              </p>
            )}
            
            <p className="text-muted-foreground mb-4">
              المطلوب إذن الكاميرا لتمكين مسح الباركود. يستخدم التطبيق الكاميرا فقط لقراءة الباركود.
            </p>
            
            <div className="space-y-2 mt-4">
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
                variant="secondary"
              >
                <Settings className="h-4 w-4 ml-2" />
                فتح إعدادات التطبيق
              </Button>
              
              <Button 
                onClick={handleManualEntry}
                className="w-full"
                variant="secondary"
              >
                <Keyboard className="h-4 w-4 ml-2" />
                إدخال الكود يدويًا
              </Button>
              
              <Button 
                onClick={onClose}
                className="w-full"
                variant="outline"
              >
                إغلاق
              </Button>
            </div>
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
