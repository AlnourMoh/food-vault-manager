
import React, { useState } from 'react';
import { PermissionErrorCard } from './PermissionErrorCard';
import { ScanButton } from './ScanButton';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { useProductScannerPermissions } from './useProductScannerPermissions';
import { useProductScanHandler } from './useProductScanHandler';
import { useToast } from '@/hooks/use-toast';

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

  // تحسين عملية تشغيل الماسح: تفعيل الكاميرا أولا ثم بدء المسح
  const openScanner = async (): Promise<void> => {
    try {
      console.log('تجهيز الكاميرا والماسح...');
      setIsCameraInitializing(true);
      
      // عرض رسالة للمستخدم
      toast({
        title: "جاري تهيئة الكاميرا",
        description: "يرجى الانتظار لحظة...",
      });
      
      // تأخير قصير للسماح بتحميل واجهة المستخدم
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // تفعيل الماسح بعد تجهيز الكاميرا
      setScannerOpen(true);
      setIsCameraInitializing(false);
      
      console.log('تم تفعيل الماسح بنجاح');
    } catch (error) {
      console.error("خطأ في تفعيل الكاميرا:", error);
      setIsCameraInitializing(false);
      
      toast({
        title: "خطأ في تفعيل الكاميرا",
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
          onClick={openScanner}
          isLoading={isRequestingPermission || isCameraInitializing}
          loadingText={isCameraInitializing ? "جاري تفعيل الكاميرا..." : "جاري التحقق من الأذونات..."}
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
