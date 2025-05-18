
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { usePlatformPermissions } from './usePlatformPermissions';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { useAppSettings } from './useAppSettings';

export const usePermissionRequest = () => {
  const { toast } = useToast();
  const { handleIosPermissions, handleAndroidPermissions, handleWebPermissions } = usePlatformPermissions();
  const { openAppSettings } = useAppSettings();

  const requestPermission = async (force = true) => {
    try {
      console.log(`[usePermissionRequest] طلب الإذن مع force=${force}، جاري التحقق من المنصة...`);
      const platform = Capacitor.getPlatform();
      console.log('[usePermissionRequest] المنصة الحالية:', platform);

      // في بيئة الويب، نعتبر الإذن ممنوح دائمًا (سيتم طلبه عند بدء المسح)
      if (!Capacitor.isNativePlatform()) {
        console.log('[usePermissionRequest] نحن في بيئة الويب، سنعتبر الإذن ممنوح');
        // سيقوم المتصفح بطلب الإذن تلقائيًا عند محاولة الوصول إلى الكاميرا
        return await handleWebPermissions();
      }

      // طريقة 1: استخدام BarcodeScanner
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log(`[usePermissionRequest] محاولة طلب إذن MLKitBarcodeScanner...`);
        
        try {
          // فحص الأذونات الحالية أولاً
          const currentStatus = await BarcodeScanner.checkPermissions();
          console.log('[usePermissionRequest] حالة أذونات MLKit الحالية:', currentStatus);
          
          if (currentStatus.camera === 'granted') {
            console.log('[usePermissionRequest] إذن MLKit ممنوح بالفعل');
            return true;
          }
          
          // عرض رسالة توضيحية للمستخدم قبل طلب الإذن
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا للقيام بعمليات المسح الضوئي',
            duration: 'short'
          }).catch(() => {});
          
          // طلب الإذن من المستخدم
          const permissionStatus = await BarcodeScanner.requestPermissions();
          console.log('[usePermissionRequest] نتيجة طلب إذن MLKit:', permissionStatus);
          
          if (permissionStatus.camera === 'granted') {
            console.log('[usePermissionRequest] تم منح إذن MLKit!');
            
            // عرض رسالة نجاح
            await Toast.show({
              text: 'تم منح إذن الكاميرا بنجاح!',
              duration: 'short'
            }).catch(() => {});
            
            return true;
          }
          
          // محاولة أخيرة لعرض حوار طلب الإذن مرة أخرى
          if (permissionStatus.camera === 'prompt') {
            console.log('[usePermissionRequest] إعادة محاولة طلب الإذن مع force=true...');
            
            // محاولة طلب الإذن مع إجبار ظهور الحوار
            const retryStatus = await BarcodeScanner.requestPermissions();
            
            if (retryStatus.camera === 'granted') {
              console.log('[usePermissionRequest] تم منح إذن MLKit في المحاولة الثانية!');
              
              await Toast.show({
                text: 'تم منح إذن الكاميرا بنجاح!',
                duration: 'short'
              }).catch(() => {});
              
              return true;
            }
          }
        } catch (mlkitError) {
          console.error('[usePermissionRequest] خطأ في طلب أذونات MLKit:', mlkitError);
          // استمرار للطريقة التالية
        }
      }
      
      // طريقة 2: استخدام ملحق Camera الأساسي
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('[usePermissionRequest] استخدام ملحق الكاميرا...');
        
        try {
          // فحص الأذونات الحالية أولاً
          const currentStatus = await Camera.checkPermissions();
          console.log('[usePermissionRequest] حالة أذونات Camera الحالية:', currentStatus);
          
          if (currentStatus.camera === 'granted') {
            console.log('[usePermissionRequest] إذن Camera ممنوح بالفعل');
            return true;
          }
          
          // عرض رسالة توضيحية للمستخدم
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا للقيام بعمليات المسح الضوئي',
            duration: 'short'
          }).catch(() => {});
          
          // طلب الإذن
          const cameraResult = await Camera.requestPermissions({
            permissions: ['camera']
          });
          console.log('[usePermissionRequest] نتيجة طلب إذن الكاميرا:', cameraResult);
          
          if (cameraResult.camera === 'granted') {
            console.log('[usePermissionRequest] تم منح إذن الكاميرا!');
            
            // عرض رسالة نجاح
            await Toast.show({
              text: 'تم منح إذن الكاميرا بنجاح!',
              duration: 'short'
            }).catch(() => {});
            
            return true;
          } else if (cameraResult.camera === 'denied') {
            console.log('[usePermissionRequest] تم رفض إذن الكاميرا، توجيه المستخدم لفتح الإعدادات');
            
            // إظهار رسالة توجيهية للمستخدم
            await Toast.show({
              text: 'يرجى تمكين إذن الكاميرا من إعدادات جهازك للاستمرار',
              duration: 'long'
            }).catch(() => {});
            
            // استدعاء دالة فتح الإعدادات بعد تأخير قصير
            setTimeout(async () => {
              await openAppSettings();
            }, 2000);
            
            return false;
          }
        } catch (cameraError) {
          console.error('[usePermissionRequest] خطأ في طلب أذونات الكاميرا:', cameraError);
        }
      }
      
      // طريقة خاصة بكل منصة
      if (platform === 'ios') {
        return await handleIosPermissions();
      } else if (platform === 'android') {
        return await handleAndroidPermissions();
      }
      
      // طريقة 3: بيئة الويب - تمكين الوصول إلى الكاميرا في بيئة الويب
      console.log('[usePermissionRequest] استخدام API الويب للكاميرا');
      return await handleWebPermissions();
    } catch (error) {
      console.error('[usePermissionRequest] خطأ في طلب الإذن:', error);
      
      // عرض رسالة خطأ للمستخدم
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { 
    requestPermission,
    openAppSettings 
  };
};
