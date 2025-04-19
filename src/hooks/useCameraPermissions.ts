
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@capacitor/camera';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('Checking camera permissions...');
        setIsLoading(true);
        
        if (window.Capacitor && window.Capacitor.isPluginAvailable('Camera')) {
          console.log('Camera plugin is available, requesting permissions...');
          
          // First check current permissions
          const { camera } = await Camera.checkPermissions();
          console.log('Current camera permission status:', camera);
          
          if (camera === 'granted') {
            console.log('Camera permission already granted');
            setHasPermission(true);
          } else {
            console.log('Requesting camera permission...');
            // Request permission explicitly
            const permission = await Camera.requestPermissions();
            console.log('Permission request result:', permission);
            
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
          }
        } else {
          console.log('Running in web environment or plugin not available');
          // For web testing, assume permission granted
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
  
  return { 
    isLoading, 
    hasPermission,
    requestPermission: async () => {
      try {
        if (window.Capacitor && window.Capacitor.isPluginAvailable('Camera')) {
          const permission = await Camera.requestPermissions();
          const granted = permission.camera === 'granted';
          setHasPermission(granted);
          return granted;
        }
        setHasPermission(true);
        return true;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
        return false;
      }
    }
  };
};
