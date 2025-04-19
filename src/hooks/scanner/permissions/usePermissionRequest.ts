
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

      // البدء دائمًا بطلب الإذن مباشرة من ملحق BarcodeScanner لضمان أن اسم التطبيق مسجل بشكل صحيح
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        console.log(`[usePermissionRequest] طلب إذن BarcodeScanner مع force=${force}...`);
        
        // طلب الإذن دائمًا بـ force=true للتأكد من تسجيل التطبيق
        const result = await BarcodeScanner.checkPermission({ force: true });
        console.log('[usePermissionRequest] نتيجة طلب إذن BarcodeScanner:', result);
        
        // محاولة ثانية لطلب الإذن إذا لم يتم منحه
        if (!result.granted) {
          console.log('[usePermissionRequest] لم يتم منح الإذن، محاولة طلب الإذن مرة أخرى');
          const retryResult = await BarcodeScanner.checkPermission({ force: true });
          console.log('[usePermissionRequest] نتيجة طلب الإذن الثاني:', retryResult);
          const granted = retryResult.granted;

          if (!granted) {
            console.log('[usePermissionRequest] لم يتم منح الإذن، التعامل بناءً على المنصة');
            if (platform === 'ios') {
              return handleIosPermissions();
            } else if (platform === 'android') {
              return handleAndroidPermissions();
            }
          }

          console.log('[usePermissionRequest] نتيجة طلب الإذن:', granted);
          return granted;
        }

        console.log('[usePermissionRequest] تم منح الإذن:', result.granted);
        return result.granted;
        
      } else if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log('[usePermissionRequest] BarcodeScanner غير متوفر، محاولة استخدام ملحق الكاميرا...');
        // استخدام ملحق الكاميرا إذا لم يتوفر BarcodeScanner
        const result = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('[usePermissionRequest] نتيجة طلب إذن الكاميرا:', result);
        return result.camera === 'granted';
      } else {
        console.log('[usePermissionRequest] كل من BarcodeScanner والكاميرا غير متوفرين، استخدام الحل البديل للويب');
        // حالة الويب
        return handleWebPermissions();
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
