
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
          const { camera } = await import('@capacitor/camera');
          const permission = await camera.requestPermissions();
          
          if (permission.camera === 'granted') {
            setHasPermission(true);
          } else {
            setHasPermission(false);
            toast({
              title: "لا يوجد إذن للكاميرا",
              description: "يرجى السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي",
              variant: "destructive"
            });
          }
        } else {
          console.log('Running in web environment or plugin not available');
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء طلب إذن الكاميرا",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [toast]);
  
  return { isLoading, hasPermission };
};
