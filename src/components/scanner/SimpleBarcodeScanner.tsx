
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface SimpleBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  autoStart?: boolean;
}

const SimpleBarcodeScanner: React.FC<SimpleBarcodeScannerProps> = ({ onScan, onClose, autoStart = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(autoStart);
  const { toast } = useToast();

  // بدء المسح عند تحميل المكون
  useEffect(() => {
    if (autoStart) {
      startScan();
    } else {
      setIsLoading(false);
    }
    
    // تنظيف عند إلغاء التحميل
    return () => {
      stopScan();
    };
  }, []);

  const startScan = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // التحقق من وجود Capacitor والملحقات المطلوبة
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        setHasError(true);
        setIsLoading(false);
        
        if (Capacitor.isNativePlatform()) {
          toast({
            title: "خطأ في المسح",
            description: "هذا الجهاز لا يدعم قراءة الباركود",
            variant: "destructive"
          });
        } else {
          toast({
            title: "المسح غير متاح",
            description: "ميزة المسح غير متاحة في المتصفح، يرجى استخدام تطبيق الهاتف",
            variant: "destructive"
          });
        }
        return;
      }
      
      // استيراد مكتبة BarcodeScanner
      const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
      
      // طلب الأذونات
      const { camera } = await BarcodeScanner.requestPermissions();
      
      if (camera !== 'granted') {
        setHasError(true);
        setIsLoading(false);
        
        toast({
          title: "تم رفض الإذن",
          description: "يجب السماح باستخدام الكاميرا للمسح",
          variant: "destructive"
        });
        return;
      }
      
      setIsScanning(true);
      setIsLoading(false);
      
      // بدء المسح
      const result = await BarcodeScanner.scan();
      
      if (result.barcodes && result.barcodes.length > 0) {
        const code = result.barcodes[0].rawValue;
        if (code) {
          onScan(code);
          
          toast({
            title: "تم المسح بنجاح",
            description: `تم مسح الرمز: ${code}`,
          });
        }
      }
      
      stopScan();
      
    } catch (error) {
      console.error('خطأ في المسح:', error);
      setHasError(true);
      setIsLoading(false);
      setIsScanning(false);
      
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء عملية المسح",
        variant: "destructive"
      });
    }
  };

  const stopScan = async () => {
    setIsScanning(false);
    
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      try {
        const { BarcodeScanner } = await import('@capacitor-mlkit/barcode-scanning');
        await BarcodeScanner.enableTorch(false);
        await BarcodeScanner.stopScan();
      } catch (error) {
        console.error('خطأ في إيقاف المسح:', error);
      }
    }
  };

  // في بيئة المتصفح، نعرض رسالة بدلاً من الماسح
  if (!Capacitor.isNativePlatform()) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-4 bg-white rounded-lg border">
        <Camera className="w-16 h-16 text-blue-500" />
        <h3 className="text-xl font-bold">المسح غير متاح في المتصفح</h3>
        <p className="text-center text-gray-600">
          ميزة مسح الباركود متاحة فقط في تطبيق الهاتف. يرجى استخدام التطبيق لمسح الرموز.
        </p>
        <Button onClick={onClose}>إغلاق</Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* شريط العنوان */}
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-white text-lg font-bold">مسح الباركود</h2>
        <Button variant="ghost" className="text-white" onClick={onClose}>
          <X />
        </Button>
      </div>
      
      {/* منطقة المسح */}
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <Spinner className="w-12 h-12 text-white mx-auto mb-4" />
            <p className="text-white">جاري تهيئة الماسح...</p>
          </div>
        ) : hasError ? (
          <div className="p-6 bg-white rounded-lg max-w-sm mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">حدث خطأ</h3>
            <p className="mb-4">تعذر تشغيل الماسح الضوئي. تأكد من منح الأذونات اللازمة.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={startScan}>إعادة المحاولة</Button>
              <Button variant="outline" onClick={onClose}>إغلاق</Button>
            </div>
          </div>
        ) : !isScanning ? (
          <div className="text-center">
            <Button size="lg" onClick={startScan}>
              <Camera className="mr-2" />
              بدء المسح
            </Button>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* إشارات توجيه المسح */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white/50 rounded-lg flex items-center justify-center">
                <div className="w-full h-px bg-red-500 animate-pulse" />
              </div>
            </div>
            <p className="absolute bottom-20 left-0 right-0 text-center text-white">
              قم بتوجيه الكاميرا نحو الباركود
            </p>
          </div>
        )}
      </div>
      
      {/* شريط الأدوات السفلي */}
      <div className="p-4 flex justify-center">
        {isScanning && (
          <Button variant="destructive" onClick={stopScan}>
            إيقاف المسح
          </Button>
        )}
      </div>
    </div>
  );
};

export default SimpleBarcodeScanner;
