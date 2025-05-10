
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { Toast } from '@capacitor/toast';
import { Camera as CapacitorCamera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface CameraButtonProps {
  onSuccess?: (imagePath: string) => void;
  onError?: (error: any) => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({ 
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleOpenCamera = async () => {
    try {
      setIsLoading(true);
      console.log('CameraButton: محاولة فتح الكاميرا...');
      
      if (!Capacitor.isPluginAvailable('Camera')) {
        console.log('CameraButton: ملحق الكاميرا غير متوفر');
        await Toast.show({
          text: 'ملحق الكاميرا غير متوفر على هذا الجهاز',
          duration: 'short'
        });
        setIsLoading(false);
        return;
      }
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        saveToGallery: false,
        correctOrientation: true
      });
      
      console.log('CameraButton: تم التقاط صورة بنجاح', image);
      
      if (onSuccess && image.webPath) {
        onSuccess(image.webPath);
      }
      
      await Toast.show({
        text: 'تم فتح الكاميرا بنجاح',
        duration: 'short'
      });
      
    } catch (error) {
      console.error('CameraButton: خطأ في فتح الكاميرا:', error);
      
      if (onError) {
        onError(error);
      }
      
      await Toast.show({
        text: 'حدث خطأ أثناء محاولة فتح الكاميرا',
        duration: 'short'
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleOpenCamera}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
      ) : (
        <Camera className="h-5 w-5" />
      )}
      {isLoading ? 'جاري فتح الكاميرا...' : 'فتح الكاميرا'}
    </Button>
  );
};

export default CameraButton;
