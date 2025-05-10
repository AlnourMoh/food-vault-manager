
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { scannerCameraService } from '@/services/scanner/ScannerCameraService';
import { X, RefreshCw, Settings, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppSettingsOpener } from '@/services/scanner/permission/AppSettingsOpener';

interface ScannerErrorHandlingProps {
  onRetry: () => void;
  onClose: () => void;
}

export const ScannerErrorHandling: React.FC<ScannerErrorHandlingProps> = ({
  onRetry,
  onClose
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  
  const handleHardReset = async () => {
    try {
      setIsResetting(true);
      toast({
        title: "إعادة تعيين الكاميرا",
        description: "جاري إعادة تعيين جميع موارد الكاميرا...",
      });
      
      // إعادة تعيين كاملة للكاميرا
      const result = await scannerCameraService.resetCamera();
      
      if (result) {
        toast({
          title: "تم بنجاح",
          description: "تمت إعادة تعيين الكاميرا، يمكنك المحاولة مرة أخرى",
        });
        onRetry(); // محاولة المسح مرة أخرى
      } else {
        toast({
          title: "فشل إعادة التعيين",
          description: "تعذر إعادة تعيين الكاميرا، يرجى التحقق من الأذونات",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطأ أثناء إعادة تعيين الكاميرا:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة إعادة تعيين الكاميرا",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  const handleOpenSettings = async () => {
    await AppSettingsOpener.openAppSettings();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">مشكلة في الكاميرا</h2>
        
        <div className="text-center mb-6">
          <div className="bg-red-100 text-red-800 rounded-full p-4 inline-block mb-4">
            <Camera className="h-12 w-12" />
          </div>
          <p className="text-gray-600 mb-4">
            لم يتم تفعيل الكاميرا بشكل صحيح. يمكن أن يكون ذلك بسبب:
          </p>
          <ul className="text-gray-600 text-sm list-disc text-right pr-6 mb-4">
            <li>لم يتم منح إذن الوصول للكاميرا</li>
            <li>الكاميرا قيد الاستخدام من قبل تطبيق آخر</li>
            <li>مشكلة تقنية في التطبيق</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleHardReset} 
            className="w-full" 
            disabled={isResetting}
          >
            {isResetting ? (
              <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 ml-2" />
            )}
            إعادة تعيين الكاميرا
          </Button>
          
          <Button 
            onClick={handleOpenSettings} 
            variant="outline" 
            className="w-full"
          >
            <Settings className="h-4 w-4 ml-2" />
            فتح إعدادات الكاميرا
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="w-full"
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق الماسح
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          معلومات تشخيصية: 
          <br />
          المنصة: {window.Capacitor?.getPlatform() || 'web'}, 
          الكاميرا: {window.Capacitor?.isPluginAvailable('MLKitBarcodeScanner') ? 'متاحة' : 'غير متاحة'}
        </div>
      </div>
    </div>
  );
};
