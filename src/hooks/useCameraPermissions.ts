
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useCameraPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('Checking camera permissions...');
        setIsLoading(true);
        
        if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
          console.log('BarcodeScanner plugin is available, checking permissions...');
          
          // First check current permissions
          const status = await BarcodeScanner.checkPermission({ force: false });
          console.log('BarcodeScanner permission status:', status);
          
          if (status.granted) {
            console.log('BarcodeScanner permission already granted');
            setHasPermission(true);
          } else {
            console.log('BarcodeScanner permission not granted yet');
            setHasPermission(false);
          }
        } else if (window.Capacitor && window.Capacitor.isPluginAvailable('Camera')) {
          console.log('Camera plugin is available, checking permissions...');
          
          // First check current permissions
          const { camera } = await Camera.checkPermissions();
          console.log('Camera permission status:', camera);
          
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
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log('Using BarcodeScanner plugin to request permission');
        
        // Request permission directly from BarcodeScanner
        const result = await BarcodeScanner.checkPermission({ force: true });
        console.log('BarcodeScanner permission request result:', result);
        
        const granted = result.granted;
        console.log('Camera permission granted through BarcodeScanner:', granted);
        setHasPermission(granted);
        
        if (granted) {
          toast({
            title: "تم منح الإذن",
            description: "تم منح إذن الكاميرا بنجاح",
          });
        } else {
          toast({
            title: "لم يتم منح الإذن",
            description: "يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
        }
        
        return granted;
      } else if (window.Capacitor && window.Capacitor.isPluginAvailable('Camera')) {
        console.log('Using Capacitor Camera plugin to request permission');
        
        // Request permission directly from Camera API
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('Camera permission request result:', result);
        
        const granted = result.camera === 'granted';
        console.log('Camera permission granted:', granted);
        setHasPermission(granted);
        
        if (granted) {
          toast({
            title: "تم منح الإذن",
            description: "تم منح إذن الكاميرا بنجاح",
          });
        } else {
          toast({
            title: "لم يتم منح الإذن",
            description: "يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
        }
        
        return granted;
      } else {
        console.log('No Capacitor Camera plugin available, assuming web environment');
        // For web testing, try to request permission using the browser API
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // If we reach this point, permission was granted
            if (stream) {
              // Stop all tracks to release the camera
              stream.getTracks().forEach(track => track.stop());
            }
            setHasPermission(true);
            toast({
              title: "تم منح الإذن",
              description: "تم منح إذن الكاميرا بنجاح",
            });
            return true;
          }
        } catch (error) {
          console.error('Browser camera permission error:', error);
          setHasPermission(false);
          toast({
            title: "لم يتم منح الإذن",
            description: "يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح",
            variant: "destructive"
          });
          return false;
        }
        
        // Fallback for testing
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
