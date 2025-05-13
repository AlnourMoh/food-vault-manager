
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Toast } from '@capacitor/toast';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Smartphone, Scan, AlertCircle } from 'lucide-react';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const ZXingBarcodeScanner = ({ onScan, onClose, autoStart = true }: ZXingBarcodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const { toast } = useToast();
  
  // التحقق ما إذا كنا في بيئة المتصفح أو بيئة التطبيق - تحسين التحقق
  const isNativePlatform = Capacitor.isNativePlatform();
  
  // وظيفة للتحقق من الأذونات وطلبها إذا لزم الأمر
  const checkAndRequestPermissions = async () => {
    if (!isNativePlatform) {
      // في بيئة الويب نرجع دائمًا false
      setHasPermission(false);
      return false;
    }
    
    try {
      // التحقق من إذن الكاميرا
      const { camera } = await BarcodeScanner.checkPermissions();
      
      if (camera !== 'granted') {
        console.log('طلب إذن الكاميرا...');
        // طلب الإذن
        const request = await BarcodeScanner.requestPermissions();
        setHasPermission(request.camera === 'granted');
        return request.camera === 'granted';
      } else {
        setHasPermission(true);
        return true;
      }
    } catch (error) {
      console.error('خطأ في التحقق من الأذونات:', error);
      setHasPermission(false);
      return false;
    }
  };
  
  // بدء المسح
  const startScan = async () => {
    if (!isNativePlatform) {
      toast({
        title: "المسح غير متاح في المتصفح",
        description: "يرجى استخدام تطبيق الجوال للقيام بعمليات المسح",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // التحقق من الإذن
      const hasPermission = await checkAndRequestPermissions();
      
      if (!hasPermission) {
        toast({
          title: "تم رفض الإذن",
          description: "لا يمكن استخدام الماسح الضوئي بدون إذن الكاميرا.",
          variant: "destructive"
        });
        return;
      }
      
      setScanActive(true);
      const result = await BarcodeScanner.scan();
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        console.log('تم مسح الكود:', code);
        
        toast({
          title: "تم المسح بنجاح",
          description: `تم مسح الباركود: ${code}`,
        });
        
        // استدعاء دالة رد النداء مع الكود الممسوح
        onScan(code);
      }
      
      setScanActive(false);
    } catch (error) {
      console.error('خطأ في المسح:', error);
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
    if (autoStart) {
      // تأخير قصير للتأكد من تحميل الواجهة أولاً
      const timer = setTimeout(() => {
        checkAndRequestPermissions().then((granted) => {
          if (granted) {
            startScan();
          }
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart]);
  
  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (scanActive && isNativePlatform) {
        BarcodeScanner.stopScan().catch(console.error);
      }
    };
  }, [scanActive]);
  
  // إذا كنا في بيئة المتصفح، نظهر رسالة بدلاً من الماسح
  if (!isNativePlatform) {
    return (
      <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
        <Smartphone className="h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">المسح غير متاح في المتصفح</h2>
        <p className="text-gray-500 mb-6">
          عملية مسح الباركود متاحة فقط في تطبيق الهاتف المحمول.
          يرجى استخدام تطبيق الجوال للقيام بعمليات المسح.
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
  
  // واجهة الماسح الافتراضية
  return (
    <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
      <Scan className="h-16 w-16 text-blue-500 mb-4" />
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
