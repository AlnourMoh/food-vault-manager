
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Smartphone, Scan, AlertCircle, Camera, X } from 'lucide-react';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner = ({ onScan, onClose, autoStart = true }: ZXingBarcodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const { toast } = useToast();
  
  // التحقق ما إذا كنا في بيئة المتصفح أو بيئة التطبيق
  const isNativePlatform = Capacitor.isNativePlatform();
  
  console.log('ZXingBarcodeScanner: بيئة التشغيل:', Capacitor.getPlatform());
  console.log('ZXingBarcodeScanner: هل نحن في بيئة الجوال؟', isNativePlatform);
  
  // وظيفة للتحقق من الأذونات وطلبها إذا لزم الأمر
  const checkAndRequestPermissions = async () => {
    if (!isNativePlatform) {
      console.log('ZXingBarcodeScanner: ليست بيئة جوال. الكاميرا غير متاحة.');
      setHasPermission(false);
      return false;
    }
    
    try {
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ZXingBarcodeScanner: ملحق MLKitBarcodeScanner غير متاح');
        toast({
          title: "ملحق الماسح الضوئي غير متاح",
          description: "الجهاز لا يدعم MLKitBarcodeScanner"
        });
        return false;
      }
      
      // التحقق من إذن الكاميرا
      console.log('ZXingBarcodeScanner: التحقق من إذن الكاميرا...');
      const { camera } = await BarcodeScanner.checkPermissions();
      
      if (camera !== 'granted') {
        console.log('ZXingBarcodeScanner: طلب إذن الكاميرا...');
        // إظهار رسالة
        await Toast.show({
          text: 'يحتاج التطبيق إلى إذن الكاميرا للمسح الضوئي',
          duration: 'short'
        });
        
        // طلب الإذن
        const request = await BarcodeScanner.requestPermissions();
        const granted = request.camera === 'granted';
        
        console.log('ZXingBarcodeScanner: نتيجة طلب الإذن:', granted ? 'تم منح الإذن' : 'تم رفض الإذن');
        setHasPermission(granted);
        return granted;
      } else {
        console.log('ZXingBarcodeScanner: إذن الكاميرا ممنوح بالفعل');
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في التحقق من الأذونات:', error);
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
      console.log('ZXingBarcodeScanner: ليست بيئة جوال، لا يمكن بدء المسح');
      toast({
        title: "المسح غير متاح في المتصفح",
        description: "يرجى استخدام تطبيق الجوال للقيام بعمليات المسح",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // التحقق من الإذن
      console.log('ZXingBarcodeScanner: التحقق من الإذن قبل بدء المسح');
      const hasPermission = await checkAndRequestPermissions();
      
      if (!hasPermission) {
        console.log('ZXingBarcodeScanner: لا يوجد إذن، تعذر بدء المسح');
        toast({
          title: "تم رفض الإذن",
          description: "لا يمكن استخدام الماسح الضوئي بدون إذن الكاميرا.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('ZXingBarcodeScanner: بدء عملية المسح...');
      setScanActive(true);
      
      // نستخدم هذا لتفادي مشكلة تصميم الواجهة
      try {
        await Toast.show({
          text: "جاري تشغيل المسح... وجّه الكاميرا نحو الباركود",
          duration: "short"
        });
      } catch (e) {
        console.log('ZXingBarcodeScanner: تعذر عرض رسالة Toast');
      }
      
      // تحديث: استخدام قيم تعداد BarcodeFormat بدلاً من السلاسل النصية
      const result = await BarcodeScanner.scan({
        formats: [
          1, // QR_CODE
          32, // EAN_13 
          64, // CODE_128
          16, // CODE_39
          512, // UPC_A
          1024 // UPC_E
        ]
      });
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        console.log('ZXingBarcodeScanner: تم مسح الكود:', code);
        
        try {
          await Toast.show({
            text: `تم مسح الباركود: ${code}`,
            duration: "short"
          });
        } catch (e) {
          console.log('ZXingBarcodeScanner: تعذر عرض رسالة Toast');
        }
        
        // استدعاء دالة رد النداء مع الكود الممسوح
        onScan(code);
      } else {
        console.log('ZXingBarcodeScanner: لم يتم العثور على باركود');
        toast({
          title: "لم يتم العثور على باركود",
          description: "حاول مجدداً وتأكد من توجيه الكاميرا بشكل صحيح"
        });
      }
      
      setScanActive(false);
    } catch (error) {
      console.error('ZXingBarcodeScanner: خطأ في المسح:', error);
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
      console.log('ZXingBarcodeScanner: تفعيل بدء المسح التلقائي');
      // تأخير قصير للتأكد من تحميل الواجهة أولاً
      const timer = setTimeout(() => {
        checkAndRequestPermissions().then((granted) => {
          if (granted) {
            console.log('ZXingBarcodeScanner: بدء المسح التلقائي');
            startScan();
          } else {
            console.log('ZXingBarcodeScanner: تعذر بدء المسح التلقائي - لا يوجد إذن');
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
        console.log('ZXingBarcodeScanner: إيقاف المسح عند التنظيف');
        BarcodeScanner.stopScan().catch(error => 
          console.error('ZXingBarcodeScanner: خطأ في إيقاف المسح:', error)
        );
      }
    };
  }, [scanActive, isNativePlatform]);
  
  // إذا كنا في بيئة المتصفح، نظهر رسالة بدلاً من الماسح
  if (!isNativePlatform) {
    return (
      <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
        <Smartphone className="h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">المسح غير متاح في المتصفح</h2>
        <p className="text-gray-500 mb-6">
          عملية مسح الباركود متاحة فقط في تطبيق الهاتف المحمول.
          يرجى تنزيل وفتح تطبيق الجوال للقيام بعمليات المسح.
        </p>
        <Button 
          onClick={onClose} 
          className="w-full"
          variant="default"
        >
          إغلاق
        </Button>
      </Card>
    );
  }
  
  // إذا لم يكن لدينا إذن الكاميرا
  if (hasPermission === false) {
    return (
      <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">لا يمكن الوصول للكاميرا</h2>
        <p className="text-gray-500 mb-6">
          يجب منح التطبيق إذن استخدام الكاميرا للقيام بعملية المسح.
          يرجى منح الإذن في إعدادات التطبيق.
        </p>
        <div className="flex gap-2 w-full">
          <Button 
            onClick={checkAndRequestPermissions} 
            className="flex-1"
          >
            طلب الإذن
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="flex-1"
          >
            إغلاق
          </Button>
        </div>
      </Card>
    );
  }
  
  // أثناء التحقق من الإذن أو عملية المسح النشطة
  if (hasPermission === null || scanActive) {
    return (
      <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="flex justify-center items-center mb-4">
          <Scan className="h-16 w-16 text-blue-500 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {hasPermission === null ? "جاري التحقق من الأذونات..." : "جاري المسح..."}
        </h2>
        <p className="text-gray-500 mb-6">
          {scanActive ? "وجه الكاميرا نحو الباركود" : "يرجى الانتظار..."}
        </p>
        <Button 
          onClick={onClose} 
          variant="outline"
          className="w-full"
        >
          إلغاء
        </Button>
      </Card>
    );
  }
  
  // واجهة المستخدم الرئيسية للماسح
  return (
    <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
      <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
        <Camera className="h-8 w-8" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">مسح الباركود</h2>
      <p className="text-gray-500 mb-6">
        اضغط على الزر أدناه لبدء عملية المسح
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          onClick={startScan}
          className="w-full"
        >
          بدء المسح
        </Button>
        <Button 
          onClick={onClose} 
          variant="outline"
          className="w-full"
        >
          إغلاق
        </Button>
      </div>
    </Card>
  );
};

export default ZXingBarcodeScanner;
