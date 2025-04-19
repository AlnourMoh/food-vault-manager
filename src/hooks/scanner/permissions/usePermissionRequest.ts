
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
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

      // طريقة 1: استخدام BarcodeScanner الجديد
      if (window.Capacitor) {
        console.log(`[usePermissionRequest] محاولة #1: طلب إذن BarcodeScanner...`);
        
        // استخدام المكتبة الجديدة
        const result = await BarcodeScanner.requestPermissions();
        console.log('[usePermissionRequest] نتيجة طلب إذن ML Kit:', result);
        
        if (result.granted) {
          console.log('[usePermissionRequest] تم منح الإذن!');
          return true;
        }
        
        // طريقة بديلة: استخدام واجهة الإعدادات
        console.log('[usePermissionRequest] المحاولة #2: تجربة الطرق البديلة حسب المنصة...');
        // محاولة التوجيه إلى إعدادات التطبيق
        if (platform === 'ios') {
          toast({
            title: "الإذن مطلوب",
            description: "يرجى تفعيل إذن الكاميرا من إعدادات جهازك لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
          return await handleIosPermissions();
        } else if (platform === 'android') {
          toast({
            title: "الإذن مطلوب",
            description: "يرجى تفعيل إذن الكاميرا من إعدادات جهازك لاستخدام الماسح الضوئي",
            variant: "destructive"
          });
          return await handleAndroidPermissions();
        }
        
        console.log('[usePermissionRequest] فشلت جميع محاولات طلب إذن BarcodeScanner');
        return false;
      } 
      
      // طريقة 2: استخدام ملحق Camera الأساسي
      if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log('[usePermissionRequest] محاولة #3: استخدام ملحق الكاميرا...');
        
        const cameraResult = await Camera.requestPermissions({
          permissions: ['camera']
        });
        console.log('[usePermissionRequest] نتيجة طلب إذن الكاميرا:', cameraResult);
        
        if (cameraResult.camera === 'granted') {
          console.log('[usePermissionRequest] تم منح إذن الكاميرا!');
          return true;
        }
        
        if (platform === 'ios') {
          return await handleIosPermissions();
        } else if (platform === 'android') {
          return await handleAndroidPermissions();
        }
        
        return false;
      } 
      
      // طريقة 3: بيئة الويب
      console.log('[usePermissionRequest] محاولة #4: استخدام API الويب للكاميرا');
      return await handleWebPermissions();
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
