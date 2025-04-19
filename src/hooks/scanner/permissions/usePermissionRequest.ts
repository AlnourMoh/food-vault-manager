
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera } from '@capacitor/camera';
import { usePlatformPermissions } from './usePlatformPermissions';

export const usePermissionRequest = () => {
  const { toast } = useToast();
  const { handleIosPermissions, handleAndroidPermissions, handleWebPermissions } = usePlatformPermissions();

  const requestPermission = async (force = true) => {
    try {
      console.log(`[usePermissionRequest] طلب الإذن مع force=${force}، جاري التحقق من المنصة...`);
      const platform = window.Capacitor?.getPlatform();
      console.log('[usePermissionRequest] المنصة الحالية:', platform);

      // طلب الإذن من BarcodeScanner مباشرة إذا كان متاحًا
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        console.log(`[usePermissionRequest] طلب إذن BarcodeScanner مباشرة مع force=${force}...`);
        
        // استخدم force=true دائمًا لإظهار شاشة طلب الإذن
        const result = await BarcodeScanner.checkPermission({ force: true });
        console.log('[usePermissionRequest] نتيجة طلب إذن BarcodeScanner الأولي:', result);
        
        if (result.granted) {
          console.log('[usePermissionRequest] تم منح الإذن!');
          return true;
        }
        
        if (platform === 'android' && result.denied) {
          // على Android، إذا تم رفض الإذن ولكن يمكن طلبه مرة أخرى
          console.log('[usePermissionRequest] الإذن مرفوض على Android، محاولة طلبه مرة أخرى...');
          const retryResult = await BarcodeScanner.checkPermission({ force: true });
          console.log('[usePermissionRequest] نتيجة المحاولة الثانية:', retryResult);
          
          if (retryResult.granted) {
            return true;
          }
        }

        console.log('[usePermissionRequest] لم يتم منح الإذن بعد المحاولات المباشرة، التوجيه إلى إعدادات التطبيق');
        
        // توجيه المستخدم إلى إعدادات التطبيق بناءً على المنصة
        if (platform === 'ios') {
          return await handleIosPermissions();
        } else if (platform === 'android') {
          return await handleAndroidPermissions();
        }
        
        return false;
      } 
      else if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log('[usePermissionRequest] BarcodeScanner غير متوفر، استخدام ملحق الكاميرا...');
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('[usePermissionRequest] نتيجة طلب إذن الكاميرا:', result);
        return result.camera === 'granted';
      } 
      else {
        console.log('[usePermissionRequest] في بيئة الويب، استخدام API الويب');
        return await handleWebPermissions();
      }
    } catch (error) {
      console.error('[usePermissionRequest] خطأ في طلب الإذن:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
      return false;
    }
  };

  return { requestPermission };
};
