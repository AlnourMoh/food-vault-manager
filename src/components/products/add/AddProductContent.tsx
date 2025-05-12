
import React, { useState } from 'react';
import { PermissionErrorCard } from './PermissionErrorCard';
import { ScanButton } from './ScanButton';
import { useProductScannerPermissions } from './useProductScannerPermissions';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
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

  // وظيفة مبسطة لفتح كاميرا الهاتف فقط بدون باركود
  const handleScanButtonClick = async (): Promise<void> => {
    try {
      console.log('فتح الكاميرا مباشرة...');
      setIsCameraInitializing(true);
      
      // عرض رسالة للمستخدم
      toast({
        title: "جاري فتح الكاميرا",
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
      
      // فتح كاميرا الجهاز مباشرة بدون مسح الباركود
      if (Capacitor.isPluginAvailable('Camera')) {
        try {
          await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            direction: CameraDirection.Rear
          });
          
          toast({
            title: "تم فتح الكاميرا بنجاح",
          });
        } catch (error) {
          console.error("خطأ في فتح الكاميرا:", error);
          toast({
            title: "تعذر فتح الكاميرا",
            description: "يرجى التحقق من أذونات الكاميرا والمحاولة مرة أخرى",
            variant: "destructive"
          });
        }
      } else {
        // في بيئة الويب أو إذا لم يكن الملحق متاحًا
        toast({
          title: "محاكاة فتح الكاميرا",
          description: "هذه الميزة تعمل بشكل أفضل على الهاتف المحمول",
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
          onClick={handleScanButtonClick}
          isLoading={isRequestingPermission || isCameraInitializing}
          loadingText={isCameraInitializing ? "جاري فتح الكاميرا..." : "جاري التحقق من الأذونات..."}
        />
      )}
    </div>
  );
};
