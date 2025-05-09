
import React, { useState } from 'react';
import { PermissionErrorCard } from './PermissionErrorCard';
import { ScanButton } from './ScanButton';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { useProductScannerPermissions } from './useProductScannerPermissions';
import { useProductScanHandler } from './useProductScanHandler';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@capacitor/camera';
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
  } = useProductScannerPermissions();

  const {
    scannerOpen,
    setScannerOpen,
    handleScanResult
  } = useProductScanHandler({ isRestaurantRoute });

  // تعديل الوظيفة لفتح الماسح بشكل مباشر
  const handleScanButtonClick = async (): Promise<void> => {
    try {
      console.log('فتح الماسح الضوئي مباشرة...');
      setIsCameraInitializing(true);
      
      // عرض رسالة للمستخدم
      toast({
        title: "جاري فتح الماسح الضوئي",
        description: "يرجى الانتظار لحظة...",
      });
      
      // إذا كان هناك مشكلة في الأذونات، نحاول حلها أولاً
      if (hasPermissionError) {
        await handleRequestPermission();
        if (hasPermissionError) {
          setIsCameraInitializing(false);
          return;
        }
      }
      
      // فتح الماسح مباشرة
      setScannerOpen(true);
      
      setIsCameraInitializing(false);
    } catch (error) {
      console.error("خطأ في فتح الماسح:", error);
      setIsCameraInitializing(false);
      
      toast({
        title: "خطأ في فتح الماسح",
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
          onClick={handleScanButtonClick}
          isLoading={isRequestingPermission || isCameraInitializing}
          loadingText={isCameraInitializing ? "جاري فتح الماسح الضوئي..." : "جاري التحقق من الأذونات..."}
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
