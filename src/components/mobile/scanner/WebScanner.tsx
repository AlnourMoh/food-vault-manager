
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scannerCameraService } from '@/services/scanner/ScannerCameraService';

interface WebScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const WebScanner: React.FC<WebScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  
  // زر المحاكاة للاختبار في بيئات بدون كاميرا
  const handleMockBarcodeScan = () => {
    const mockBarcodes = [
      '123456789012',
      '789012345678',
      '978020137962',
      '4006381333931'
    ];
    
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    
    toast({
      title: "تم مسح باركود وهمي",
      description: `الرمز: ${randomBarcode}`,
    });
    
    onScan(randomBarcode);
  };
  
  // تفعيل الكاميرا
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        setHasError(false);
        
        // التحقق من وضع المحاكاة
        if (scannerCameraService.isMockMode()) {
          console.log('[WebScanner] وضع المحاكاة نشط، لا حاجة لتفعيل الكاميرا');
          return;
        }
        
        console.log('[WebScanner] بدء تهيئة كاميرا الويب...');
        
        // محاولة الوصول للكاميرا
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        // تطبيق تدفق الفيديو على العنصر
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('[WebScanner] تم تفعيل كاميرا الويب بنجاح');
          setIsScanning(true);
        }
      } catch (error) {
        console.error('[WebScanner] خطأ في تفعيل الكاميرا:', error);
        setHasError(true);
        
        // تفعيل وضع المحاكاة تلقائياً عند فشل الكاميرا
        console.log('[WebScanner] تفعيل وضع المحاكاة لعدم توفر الكاميرا');
        scannerCameraService.enableMockMode(true);
        
        toast({
          title: "الكاميرا غير متاحة",
          description: "تم تفعيل وضع المحاكاة لتجربة المسح بشكل افتراضي",
          variant: "destructive"
        });
      }
    };
    
    initCamera();
    
    // تنظيف الموارد عند إلغاء تحميل المكون
    return () => {
      console.log('[WebScanner] تنظيف موارد الكاميرا...');
      if (stream) {
        console.log('[WebScanner] إيقاف مسارات الفيديو');
        stream.getTracks().forEach(track => track.stop());
      }
      setIsScanning(false);
    };
  }, [toast]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {hasError || scannerCameraService.isMockMode() ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-full mb-6">
            <Camera className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {scannerCameraService.isMockMode() ? 'وضع المحاكاة نشط' : 'الكاميرا غير متاحة'}
          </h2>
          <p className="text-white/70 mb-8">
            {scannerCameraService.isMockMode() 
              ? 'يمكنك تجربة المسح باستخدام باركود افتراضي'
              : 'تعذر الوصول إلى كاميرا الجهاز. يرجى التحقق من الأذونات وإعادة المحاولة.'}
          </p>
          <div className="space-y-3 w-full max-w-md">
            <Button 
              onClick={handleMockBarcodeScan}
              className="w-full"
              variant="default"
            >
              مسح باركود وهمي للاختبار
            </Button>
            {hasError && (
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة تحميل الصفحة
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="w-full">
              <X className="h-4 w-4 ml-2" />
              إغلاق
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex-1">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            
            {/* إطار المسح */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-64 border-2 border-white/80 rounded-lg relative">
                <div className="absolute top-0 left-0 h-12 w-12 border-t-2 border-l-2 border-blue-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 h-12 w-12 border-t-2 border-r-2 border-blue-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-blue-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-blue-500 rounded-br-lg" />
                
                {/* خط المسح المتحرك */}
                <div className="absolute left-0 w-full h-0.5 bg-red-500 animate-scanner-line" 
                    style={{
                      animation: "scannerLine 2s infinite ease-in-out",
                    }} 
                />
              </div>
            </div>
          </div>
          
          {/* شريط المعلومات */}
          <div className="bg-black/80 p-4 flex justify-between items-center">
            <div className="text-white">
              <p>جاهز للمسح</p>
            </div>
            <Button variant="ghost" onClick={onClose} size="icon" className="text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          {/* أزرار التحكم */}
          <div className="bg-black p-4 space-y-3">
            <Button 
              onClick={handleMockBarcodeScan}
              className="w-full"
            >
              محاكاة المسح (للاختبار)
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="w-full text-white border-white/30 hover:bg-white/10"
            >
              <X className="h-4 w-4 ml-2" />
              إغلاق
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
