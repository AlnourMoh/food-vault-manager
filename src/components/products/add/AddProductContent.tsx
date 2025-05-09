
import React, { useState } from 'react';
import { PermissionErrorCard } from './PermissionErrorCard';
import { ScanButton } from './ScanButton';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { useProductScannerPermissions } from './useProductScannerPermissions';
import { useProductScanHandler } from './useProductScanHandler';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface AddProductContentProps {
  isRestaurantRoute: boolean;
}

export const AddProductContent: React.FC<AddProductContentProps> = ({
  isRestaurantRoute
}) => {
  const { toast } = useToast();
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  
  const {
    hasPermissionError,
    isRequestingPermission,
    handleRequestPermission,
    handleOpenSettings,
    handleScanButtonClick
  } = useProductScannerPermissions();

  const {
    scannerOpen,
    setScannerOpen,
    handleScanResult
  } = useProductScanHandler({ isRestaurantRoute });

  // تعديل الوظيفة لفتح الكاميرا مباشرة بدون تفعيل الماسح
  const openCamera = async (): Promise<void> => {
    try {
      console.log('فتح الكاميرا مباشرة...');
      setIsCameraInitializing(true);
      
      // عرض رسالة للمستخدم
      toast({
        title: "جاري فتح الكاميرا",
        description: "يرجى الانتظار لحظة...",
      });
      
      // تأخير قصير للسماح بتحميل واجهة المستخدم
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Camera')) {
        try {
          // استخدام واجهة برمجة تطبيقات الكاميرا المباشرة
          const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
          });
          
          // معالجة الصورة الملتقطة (يمكن إضافة المزيد من المنطق هنا)
          console.log('تم التقاط صورة بنجاح:', image.webPath);
          
          toast({
            title: "تم التقاط الصورة بنجاح",
            description: "يمكنك الآن إضافة تفاصيل المنتج",
          });
        } catch (e) {
          console.error('خطأ في فتح الكاميرا:', e);
          toast({
            title: "تعذر فتح الكاميرا",
            description: "يرجى التحقق من إذن الكاميرا وإعادة المحاولة",
            variant: "destructive"
          });
        }
      } else {
        console.log('الكاميرا غير متاحة في هذه البيئة أو جاري المحاكاة');
        // في حالة التطوير على الويب أو عدم توفر واجهة برمجة تطبيقات الكاميرا، نعرض رسالة
        toast({
          title: "الكاميرا غير متاحة",
          description: "لا يمكن استخدام الكاميرا في هذه البيئة، استخدم جهازًا متوافقًا",
        });
      }
      
      setIsCameraInitializing(false);
    } catch (error) {
      console.error("خطأ في فتح الكاميرا:", error);
      setIsCameraInitializing(false);
      
      toast({
        title: "خطأ في فتح الكاميرا",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      {hasPermissionError ? (
        <PermissionErrorCard 
          onRequestPermission={handleRequestPermission}
          onOpenSettings={handleOpenSettings}
          isRequestingPermission={isRequestingPermission}
        />
      ) : (
        <ScanButton 
          onClick={openCamera}
          isLoading={isRequestingPermission || isCameraInitializing}
          loadingText={isCameraInitializing ? "جاري فتح الكاميرا..." : "جاري التحقق من الأذونات..."}
        />
      )}

      {scannerOpen && (
        <ZXingBarcodeScanner
          onScan={handleScanResult}
          onClose={() => setScannerOpen(false)}
          autoStart={true}
        />
      )}
    </div>
  );
};
