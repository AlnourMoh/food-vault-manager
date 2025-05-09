
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

      // في بيئة الويب، نعتبر الإذن ممنوح دائمًا (سيتم طلبه عند بدء المسح)
      if (!window.Capacitor?.isNativePlatform()) {
        console.log('[usePermissionRequest] نحن في بيئة الويب، سنعتبر الإذن ممنوح');
        // سيقوم المتصفح بطلب الإذن تلقائيًا عند محاولة الوصول إلى الكاميرا
        return await handleWebPermissions();
      }

      // طريقة 1: استخدام BarcodeScanner
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log(`[usePermissionRequest] محاولة طلب إذن BarcodeScanner...`);
        
        // طلب الإذن من المستخدم
        const permissionStatus = await BarcodeScanner.checkPermission({ force: true });
        console.log('[usePermissionRequest] نتيجة طلب إذن BarcodeScanner:', permissionStatus);
        
        if (permissionStatus.granted) {
          console.log('[usePermissionRequest] تم منح الإذن!');
          return true;
        }
        
        // طريقة بديلة: استخدام واجهة الإعدادات
        console.log('[usePermissionRequest] تجربة الطرق البديلة حسب المنصة...');
        
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
      } 
      
      // طريقة 2: استخدام ملحق Camera الأساسي
      if (window.Capacitor?.isPluginAvailable('Camera')) {
        console.log('[usePermissionRequest] استخدام ملحق الكاميرا...');
        
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
      } 
      
      // طريقة 3: بيئة الويب - تمكين الوصول إلى الكاميرا في بيئة الويب
      console.log('[usePermissionRequest] استخدام API الويب للكاميرا');
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
