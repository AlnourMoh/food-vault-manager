
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useToast } from '@/hooks/use-toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';

export const useProductScannerPermissions = () => {
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const { toast } = useToast();

  // تحقق من أذونات الكاميرا عند التحميل
  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        console.log("التحقق من أذونات الكاميرا عند تحميل الصفحة...");
        
        if (Capacitor.isNativePlatform()) {
          // التحقق من وجود الأذونات وإظهار حالتها
          let hasPermission = false;
          
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            const result = await BarcodeScanner.checkPermissions();
            hasPermission = result.camera === 'granted';
            console.log("حالة إذن الكاميرا:", result.camera);
          } else if (Capacitor.isPluginAvailable('Camera')) {
            // استخدم خدمة للتحقق من الأذونات
            const permissionResult = await scannerPermissionService.checkPermission();
            hasPermission = permissionResult;
            console.log("حالة إذن الكاميرا من خدمة المسح:", hasPermission);
          }
          
          // تسجيل حالة التحقق من الأذونات
          setPermissionChecked(true);
          
          // إذا لم يكن هناك إذن، نعرض زر طلبه بدلاً من التنفيذ التلقائي
          if (!hasPermission) {
            console.log("لم يتم العثور على إذن الكاميرا");
            setHasPermissionError(true);
          } else {
            console.log("تم العثور على إذن للكاميرا - جاهز للمسح");
            setHasPermissionError(false);
          }
        }
      } catch (error) {
        console.error("خطأ في التحقق من أذونات الكاميرا:", error);
        setHasPermissionError(true);
        setPermissionChecked(true);
      }
    };
    
    checkCameraPermissions();
  }, []);

  const handleRequestPermission = async () => {
    try {
      setIsRequestingPermission(true);
      console.log("محاولة طلب إذن الكاميرا مباشرة...");
      
      // استخدام الخدمة المخصصة للتأكد من وجود الأذونات بكل الطرق
      const granted = await scannerPermissionService.requestPermission();
      
      if (granted) {
        console.log("تم منح إذن الكاميرا بنجاح");
        setHasPermissionError(false);
        
        // فتح الماسح فور الحصول على الإذن
        setTimeout(() => {
          return true;
        }, 500);
      } else {
        console.log("تم رفض طلب إذن الكاميرا");
        setHasPermissionError(true);
        
        // محاولة فتح الإعدادات
        setTimeout(async () => {
          await scannerPermissionService.openAppSettings();
        }, 1000);
      }
    } catch (error) {
      console.error("خطأ في طلب إذن الكاميرا:", error);
      setHasPermissionError(true);
      return false;
    } finally {
      setIsRequestingPermission(false);
    }
  };
  
  const handleOpenSettings = async () => {
    try {
      console.log("محاولة فتح إعدادات التطبيق...");
      await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error("خطأ في فتح إعدادات التطبيق:", error);
      
      // إرشادات يدوية
      const platform = Capacitor.getPlatform();
      const message = platform === 'ios' 
        ? 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وابحث عن التطبيق' 
        : 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا';
      
      await Toast.show({
        text: message,
        duration: 'long'
      });
    }
  };

  const handleScanButtonClick = async (setScannerOpen: (isOpen: boolean) => void) => {
    try {
      console.log('فتح الماسح الضوئي');
      setIsRequestingPermission(true);
      
      // التحقق من وجود الأذونات قبل فتح الماسح
      if (Capacitor.isNativePlatform()) {
        console.log("التحقق من الإذن قبل فتح الماسح...");
        
        // استخدام الخدمة المخصصة للتأكد من وجود الأذونات بكل الطرق
        const hasPermission = await scannerPermissionService.ensureCameraPermissions();
        
        if (hasPermission) {
          console.log("توجد أذونات للكاميرا - جاري فتح الماسح");
          setHasPermissionError(false);
          setScannerOpen(true);
        } else {
          console.log("لم يتم الحصول على أذونات الكاميرا");
          setHasPermissionError(true);
          
          // عرض رسالة إرشاد للمستخدم
          toast({
            title: "مشكلة في أذونات الكاميرا",
            description: "لم نتمكن من الوصول إلى كاميرا هاتفك. يرجى التأكد من منح التطبيق إذن الوصول إلى الكاميرا من إعدادات جهازك.",
            variant: "destructive"
          });
          
          // محاولة فتح إعدادات التطبيق
          setTimeout(async () => {
            try {
              console.log("محاولة فتح إعدادات التطبيق...");
              await scannerPermissionService.openAppSettings();
            } catch (e) {
              console.error("خطأ في فتح الإعدادات:", e);
            }
          }, 1500);
        }
      } else {
        // في حالة عدم وجود منصة أصلية، نفترض أن الأذونات متوفرة
        console.log("تشغيل الماسح في وضع الويب");
        setScannerOpen(true);
      }
    } catch (error) {
      console.error("خطأ في فتح الماسح:", error);
      toast({
        title: "خطأ في تشغيل الماسح",
        description: "حدث خطأ أثناء محاولة تشغيل الماسح الضوئي",
        variant: "destructive"
      });
    } finally {
      setIsRequestingPermission(false);
    }
  };

  return {
    permissionChecked,
    isRequestingPermission,
    hasPermissionError,
    handleRequestPermission,
    handleOpenSettings,
    handleScanButtonClick
  };
};
