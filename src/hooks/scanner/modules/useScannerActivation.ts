
import { useState, useEffect } from 'react';
import { checkCameraPermission, requestCameraPermission } from '@/utils/cameraPermissions';
import { useToast } from '@/hooks/use-toast';

interface UseScannerActivationProps {
  onStart: () => void;
  onStop: () => void;
  onError: (error: string) => void;
}

export const useScannerActivation = ({ onStart, onStop, onError }: UseScannerActivationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScannerSupported, setIsScannerSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSupportAndPermission = async () => {
      setIsLoading(true);
      try {
        // Check if the browser supports the MediaDevices API
        if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
          console.warn("كاميرا: المتصفح لا يدعم MediaDevices API");
          setIsScannerSupported(false);
          setHasPermission(false);
          onError("المتصفح لا يدعم MediaDevices API");
          return;
        }
        setIsScannerSupported(true);

        // Check camera permission
        const permissionStatus = await checkCameraPermission();
        setHasPermission(permissionStatus);
        console.log("كاميرا: حالة إذن الكاميرا:", permissionStatus);

        if (permissionStatus) {
          onStart();
        }
      } catch (error) {
        console.error("كاميرا: خطأ أثناء التحقق من الدعم والإذن:", error);
        onError("خطأ أثناء التحقق من دعم الكاميرا والإذن");
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupportAndPermission();
  }, [onStart, onError]);

  const requestCamera = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Request camera permission
      const permission = await requestCameraPermission();
      setHasPermission(permission);
      console.log("كاميرا: تم طلب إذن الكاميرا والنتيجة:", permission);

      if (permission) {
        toast({
          title: "تم تفعيل الكاميرا",
          description: "يمكنك الآن استخدام الكاميرا لمسح المنتجات",
        });
        onStart();
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "فشل تفعيل الكاميرا",
          description: "لم يتم منح إذن الوصول للكاميرا",
          variant: "destructive",
        });
        onError("لم يتم منح إذن الوصول للكاميرا");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("كاميرا: خطأ أثناء طلب إذن الكاميرا:", error);
      toast({
        title: "خطأ في الكاميرا",
        description: "حدث خطأ أثناء محاولة تفعيل الكاميرا",
        variant: "destructive",
      });
      onError("حدث خطأ أثناء محاولة تفعيل الكاميرا");
      setIsLoading(false);
      return false;
    }
  };

  const stopCamera = () => {
    console.log("كاميرا: إيقاف تشغيل الكاميرا");
    onStop();
  };

  return {
    isLoading,
    hasPermission,
    isScannerSupported,
    requestCamera,
    stopCamera,
  };
};
