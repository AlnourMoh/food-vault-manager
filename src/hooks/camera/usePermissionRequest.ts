
import { useCallback } from 'react';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { useToast } from '@/hooks/use-toast';
import { PermissionStatus } from './types';

export const usePermissionRequest = (permissionStatus: {
  setIsLoading: (isLoading: boolean) => void;
  setHasPermission: (hasPermission: boolean | null) => void;
  setPermissionDeniedCount: (count: number) => void;
  permissionDeniedCount: number;
}) => {
  const { setIsLoading, setHasPermission, setPermissionDeniedCount, permissionDeniedCount } = permissionStatus;
  const { toast } = useToast();

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log("طلب إذن الكاميرا...");
      setIsLoading(true);
      
      // عرض رسالة للمستخدم
      await Toast.show({
        text: 'يتطلب التطبيق إذن الوصول إلى الكاميرا للمسح الضوئي',
        duration: 'long'
      });
      
      // في حالة تشغيل التطبيق بشكل أصلي (native)
      if (Capacitor.isNativePlatform()) {
        console.log("تشغيل على جهاز أصلي، جاري طلب إذن الكاميرا...");
        
        // محاولة استخدام MLKitBarcodeScanner إذا كان متاحاً
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log("استخدام BarcodeScanner لطلب الإذن...");
          
          // طلب الإذن من خلال BarcodeScanner
          const result = await BarcodeScanner.requestPermissions();
          console.log("نتيجة طلب إذن BarcodeScanner:", result);
          
          if (result.camera === 'granted') {
            console.log("تم منح إذن BarcodeScanner!");
            setHasPermission(true);
            setIsLoading(false);
            return true;
          } else {
            console.log("تم رفض إذن BarcodeScanner أو لم يتم السؤال عنه بعد");
          }
        }
        
        // محاولة استخدام واجهة الكاميرا العادية إذا كان MLKit غير متاح أو فشل
        if (Capacitor.isPluginAvailable('Camera')) {
          console.log("استخدام Camera API لطلب الإذن...");
          
          // طلب الإذن من خلال Camera API
          const result = await Camera.requestPermissions({
            permissions: ['camera']
          });
          console.log("نتيجة طلب إذن Camera:", result);
          
          if (result.camera === 'granted') {
            console.log("تم منح إذن Camera!");
            setHasPermission(true);
            setIsLoading(false);
            return true;
          }
        }
        
        // تحديث عداد رفض الإذن
        setPermissionDeniedCount(permissionDeniedCount + 1);
        console.log("تم زيادة عداد رفض الإذن إلى", permissionDeniedCount + 1);
        
        // عرض رسالة مخصصة للمستخدم بعد رفض الإذن
        toast({
          title: "تم رفض إذن الكاميرا",
          description: "يرجى تمكين إذن الكاميرا من إعدادات التطبيق للاستمرار",
          variant: "destructive",
        });
        
        setHasPermission(false);
        setIsLoading(false);
        return false;
      }
      
      // في حالة تشغيل التطبيق في متصفح الويب
      else {
        console.log("تشغيل في بيئة الويب، محاولة استخدام واجهة getUserMedia...");
        try {
          // محاولة طلب الإذن من خلال getUserMedia
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // إغلاق المسارات بعد التحقق
          stream.getTracks().forEach(track => track.stop());
          
          console.log("تم منح إذن الكاميرا في المتصفح!");
          setHasPermission(true);
          setIsLoading(false);
          return true;
        } catch (error) {
          console.log("تم رفض إذن الكاميرا في المتصفح:", error);
          
          toast({
            title: "تم رفض إذن الكاميرا",
            description: "يرجى تمكين إذن الكاميرا من إعدادات المتصفح للاستمرار",
            variant: "destructive",
          });
          
          setPermissionDeniedCount(permissionDeniedCount + 1);
          setHasPermission(false);
          setIsLoading(false);
          return false;
        }
      }
    } catch (error) {
      console.error("خطأ في طلب إذن الكاميرا:", error);
      
      toast({
        title: "حدث خطأ",
        description: "تعذر طلب إذن الكاميرا، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      
      setHasPermission(false);
      setIsLoading(false);
      return false;
    }
  }, [permissionDeniedCount, setHasPermission, setIsLoading, setPermissionDeniedCount, toast]);

  return { requestCameraPermission };
};
