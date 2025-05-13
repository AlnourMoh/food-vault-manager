
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useToast } from '@/hooks/use-toast';

export const useZXingBarcodeScanner = (autoStart: boolean, onScan: (code: string) => void, onClose: () => void) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const { toast } = useToast();
  
  // التحقق ما إذا كنا في بيئة المتصفح أو بيئة التطبيق
  const isNativePlatform = Capacitor.isNativePlatform();
  
  console.log('useZXingBarcodeScanner: بيئة التشغيل:', Capacitor.getPlatform());
  console.log('useZXingBarcodeScanner: هل نحن في بيئة الجوال؟', isNativePlatform);
  
  // وظيفة للتحقق من الأذونات وطلبها إذا لزم الأمر
  const checkAndRequestPermissions = async () => {
    if (!isNativePlatform) {
      console.log('useZXingBarcodeScanner: ليست بيئة جوال. الكاميرا غير متاحة.');
      setHasPermission(false);
      return false;
    }
    
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('useZXingBarcodeScanner: ملحق MLKitBarcodeScanner غير متاح');
        toast({
          title: "ملحق الماسح الضوئي غير متاح",
          description: "الجهاز لا يدعم MLKitBarcodeScanner"
        });
        return false;
      }
      
      // التحقق من إذن الكاميرا
      console.log('useZXingBarcodeScanner: التحقق من إذن الكاميرا...');
      const { camera } = await BarcodeScanner.checkPermissions();
      
      if (camera !== 'granted') {
        console.log('useZXingBarcodeScanner: طلب إذن الكاميرا...');
        // إظهار رسالة
        await Toast.show({
          text: 'يحتاج التطبيق إلى إذن الكاميرا للمسح الضوئي',
          duration: 'short'
        });
        
        // طلب الإذن
        const request = await BarcodeScanner.requestPermissions();
        const granted = request.camera === 'granted';
        
        console.log('useZXingBarcodeScanner: نتيجة طلب الإذن:', granted ? 'تم منح الإذن' : 'تم رفض الإذن');
        setHasPermission(granted);
        return granted;
      } else {
        console.log('useZXingBarcodeScanner: إذن الكاميرا ممنوح بالفعل');
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في التحقق من الأذونات:', error);
      setHasPermission(false);
      
      toast({
        title: "خطأ في الأذونات",
        description: "تعذر التحقق من إذن الكاميرا",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // بدء المسح
  const startScan = async () => {
    if (!isNativePlatform) {
      console.log('useZXingBarcodeScanner: ليست بيئة جوال، لا يمكن بدء المسح');
      toast({
        title: "المسح غير متاح في المتصفح",
        description: "يرجى استخدام تطبيق الجوال للقيام بعمليات المسح",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // التحقق من الإذن
      console.log('useZXingBarcodeScanner: التحقق من الإذن قبل بدء المسح');
      const hasPermission = await checkAndRequestPermissions();
      
      if (!hasPermission) {
        console.log('useZXingBarcodeScanner: لا يوجد إذن، تعذر بدء المسح');
        toast({
          title: "تم رفض الإذن",
          description: "لا يمكن استخدام الماسح الضوئي بدون إذن الكاميرا.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('useZXingBarcodeScanner: بدء عملية المسح...');
      setScanActive(true);
      
      // نستخدم هذا لتفادي مشكلة تصميم الواجهة
      try {
        await Toast.show({
          text: "جاري تشغيل المسح... وجّه الكاميرا نحو الباركود",
          duration: "short"
        });
      } catch (e) {
        console.log('useZXingBarcodeScanner: تعذر عرض رسالة Toast');
      }
      
      // استخدام قيم تعداد BarcodeFormat بدلاً من السلاسل النصية
      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode, // QR_CODE
          BarcodeFormat.Ean13, // EAN_13 
          BarcodeFormat.Code128, // CODE_128
          BarcodeFormat.Code39, // CODE_39
          BarcodeFormat.UpcA, // UPC_A
          BarcodeFormat.UpcE // UPC_E
        ]
      });
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        console.log('useZXingBarcodeScanner: تم مسح الكود:', code);
        
        try {
          await Toast.show({
            text: `تم مسح الباركود: ${code}`,
            duration: "short"
          });
        } catch (e) {
          console.log('useZXingBarcodeScanner: تعذر عرض رسالة Toast');
        }
        
        // استدعاء دالة رد النداء مع الكود الممسوح
        onScan(code);
      } else {
        console.log('useZXingBarcodeScanner: لم يتم العثور على باركود');
        toast({
          title: "لم يتم العثور على باركود",
          description: "حاول مجدداً وتأكد من توجيه الكاميرا بشكل صحيح"
        });
      }
      
      setScanActive(false);
    } catch (error) {
      console.error('useZXingBarcodeScanner: خطأ في المسح:', error);
      setScanActive(false);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة مسح الباركود.",
        variant: "destructive"
      });
    }
  };
  
  // وظيفة تلقائية لبدء المسح عند تحميل المكون إذا كان autoStart = true
  useEffect(() => {
    if (autoStart && isNativePlatform) {
      console.log('useZXingBarcodeScanner: تفعيل بدء المسح التلقائي');
      // تأخير قصير للتأكد من تحميل الواجهة أولاً
      const timer = setTimeout(() => {
        checkAndRequestPermissions().then((granted) => {
          if (granted) {
            console.log('useZXingBarcodeScanner: بدء المسح التلقائي');
            startScan();
          } else {
            console.log('useZXingBarcodeScanner: تعذر بدء المسح التلقائي - لا يوجد إذن');
          }
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, isNativePlatform]);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (scanActive && isNativePlatform) {
        console.log('useZXingBarcodeScanner: إيقاف المسح عند التنظيف');
        BarcodeScanner.stopScan().catch(error => 
          console.error('useZXingBarcodeScanner: خطأ في إيقاف المسح:', error)
        );
      }
    };
  }, [scanActive, isNativePlatform]);

  return {
    isNativePlatform,
    hasPermission,
    scanActive,
    startScan,
    checkAndRequestPermissions
  };
};
