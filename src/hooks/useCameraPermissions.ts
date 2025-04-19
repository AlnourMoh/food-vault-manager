
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
          console.log('Camera plugin is available, checking permissions...');
          
          // First check current permissions
          const { camera } = await Camera.checkPermissions();
          console.log('Current camera permission status:', camera);
          
          if (camera === 'granted') {
            console.log('Camera permission already granted');
            setHasPermission(true);
          } else {
            console.log('Camera permission not granted yet');
            setHasPermission(false);
          }
        } else {
          console.log('Running in web environment or plugin not available');
          // For web testing, assume permission granted
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setHasPermission(false);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء التحقق من إذن الكاميرا",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [toast]);
  
  const requestPermission = async () => {
    try {
      console.log('Explicitly requesting camera permission...');
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('Camera')) {
        console.log('Using Capacitor Camera plugin to request permission');
        
        // Before requesting, check if permission has already been denied in the system settings
        const { camera } = await Camera.checkPermissions();
        console.log('Current permission status before request:', camera);
        
        // Even if denied, still try to request permission
        const permission = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('Permission request result:', permission);
        
        const granted = permission.camera === 'granted';
        console.log('Permission granted:', granted);
        setHasPermission(granted);
        
        if (!granted) {
          toast({
            title: "لم يتم منح الإذن",
            description: "يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
        }
        
        return granted;
      } else {
        console.log('No Capacitor Camera plugin available, assuming web environment');
        // For web testing
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return { 
    isLoading, 
    hasPermission,
    requestPermission
  };
};
