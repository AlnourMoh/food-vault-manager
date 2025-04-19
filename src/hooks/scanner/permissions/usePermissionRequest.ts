
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

      // طريقة 1: استخدام BarcodeScanner - الطريقة الرئيسية
      if (window.Capacitor?.isPluginAvailable('BarcodeScanner')) {
        console.log(`[usePermissionRequest] محاولة #1: طلب إذن BarcodeScanner مباشرة (force = ${force})...`);
        
        // محاولة أولى دائماً بـ force=true لضمان ظهور شاشة طلب الإذن
        const initialCheck = await BarcodeScanner.checkPermission({ force: true });
        console.log('[usePermissionRequest] نتيجة الفحص الأولي للأذونات:', initialCheck);
        
        if (initialCheck.granted) {
          console.log('[usePermissionRequest] تم منح الإذن من المحاولة الأولى!');
          return true;
        }
        
        // محاولة ثانية إذا لم تنجح الأولى
        if (initialCheck.denied || initialCheck.asked) {
          console.log('[usePermissionRequest] المحاولة #2: إعادة طلب الإذن مرة أخرى...');
          const secondCheck = await BarcodeScanner.checkPermission({ force: true });
          console.log('[usePermissionRequest] نتيجة المحاولة الثانية:', secondCheck);
          
          if (secondCheck.granted) {
            console.log('[usePermissionRequest] تم منح الإذن من المحاولة الثانية!');
            return true;
          }
        }
        
        // طريقة بديلة: استخدام واجهة الإعدادات
        console.log('[usePermissionRequest] المحاولة #3: تجربة الطرق البديلة حسب المنصة...');
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
        console.log('[usePermissionRequest] محاولة #4: استخدام ملحق الكاميرا...');
        
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
      console.log('[usePermissionRequest] محاولة #5: استخدام API الويب للكاميرا');
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
