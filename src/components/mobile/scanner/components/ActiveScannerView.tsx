
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Toast } from '@capacitor/toast';

interface ActiveScannerViewProps {
  cameraActive: boolean;
  isScanningActive: boolean;
  onClose: () => void;
}

export const ActiveScannerView: React.FC<ActiveScannerViewProps> = ({ 
  cameraActive,
  isScanningActive,
  onClose 
}) => {
  const [lastVideoCheckTime, setLastVideoCheckTime] = useState(Date.now());
  
  // تسجيل لحالة الكاميرا النشطة
  useEffect(() => {
    console.log("ActiveScannerView: حالة الكاميرا:", { cameraActive, isScanningActive });
    
    // تعزيز إظهار الكاميرا بشكل صحيح
    const checkCamera = () => {
      if (cameraActive) {
        const videoElements = document.querySelectorAll('video');
        console.log("ActiveScannerView: عدد عناصر الفيديو الموجودة:", videoElements.length);
        
        if (videoElements.length === 0) {
          console.warn("ActiveScannerView: لا توجد عناصر فيديو للكاميرا!");
          // محاولة إظهار رسالة للمستخدم
          Toast.show({
            text: 'تعذر العثور على بث الكاميرا. يرجى المحاولة مرة أخرى',
            duration: 'short'
          });
        }
        
        videoElements.forEach(video => {
          console.log("ActiveScannerView: تهيئة عنصر فيديو الكاميرا", video.id);
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          video.style.position = 'absolute';
          video.style.top = '0';
          video.style.left = '0';
          video.style.zIndex = '1'; // زيادة z-index لضمان الظهور
          
          // التحقق من حالة الفيديو
          console.log("ActiveScannerView: حالة الفيديو:", {
            readyState: video.readyState,
            paused: video.paused,
            srcObject: video.srcObject ? 'موجود' : 'غير موجود',
            width: video.width,
            height: video.height
          });
          
          // محاولة تشغيل الفيديو إذا كان متوقفًا
          if (video.paused && video.srcObject) {
            video.play().catch(err => {
              console.error("ActiveScannerView: خطأ في تشغيل الفيديو:", err);
            });
          }
        });
        
        // تسجيل وقت آخر فحص
        setLastVideoCheckTime(Date.now());
      }
    };
    
    // الفحص الفوري
    checkCamera();
    
    // فحص دوري كل ثانية للتأكد من عمل الكاميرا
    const interval = setInterval(checkCamera, 1000);
    
    return () => {
      // تنظيف عند إزالة المكون
      console.log("ActiveScannerView: تنظيف موارد الكاميرا");
      clearInterval(interval);
      
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach(video => {
        if (video.srcObject) {
          console.log("ActiveScannerView: إيقاف بث الكاميرا");
          try {
            const tracks = (video.srcObject as MediaStream).getTracks();
            tracks.forEach(track => {
              track.stop();
              console.log("ActiveScannerView: تم إيقاف مسار الكاميرا:", track.kind);
            });
            video.srcObject = null;
          } catch (error) {
            console.error("ActiveScannerView: خطأ في إيقاف الكاميرا:", error);
          }
        }
      });
    };
  }, [cameraActive, isScanningActive]);

  const [scanAnimationActive, setScanAnimationActive] = useState(true);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  // تنشيط خط المسح المتحرك عندما تكون الكاميرا نشطة
  useEffect(() => {
    if (cameraActive) {
      setScanAnimationActive(true);
    }
  }, [cameraActive]);
  
  // محاولة إعادة تنشيط الكاميرا إذا لم تظهر
  const handleRefreshCamera = async () => {
    console.log("ActiveScannerView: محاولة إعادة تنشيط الكاميرا");
    setRefreshAttempts(prev => prev + 1);
    
    // إشعار المستخدم
    await Toast.show({
      text: 'جاري محاولة إعادة تفعيل الكاميرا...',
      duration: 'short'
    });
    
    // محاولة تعديل الـ DOM مباشرة
    const scannerContainer = document.getElementById('barcode-scanner-view');
    if (scannerContainer) {
      // محاولة إنشاء عنصر فيديو جديد إذا لم يكن موجودًا
      const videoElements = scannerContainer.querySelectorAll('video');
      
      if (videoElements.length === 0 && 'mediaDevices' in navigator) {
        try {
          console.log('محاولة إنشاء عنصر فيديو جديد وتنشيط الكاميرا');
          
          // التحقق من وجود كاميرا
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          
          if (!hasCamera) {
            console.warn('لا توجد كاميرا متاحة في هذا الجهاز');
            await Toast.show({
              text: 'لم يتم العثور على كاميرا في جهازك',
              duration: 'long'
            });
            return;
          }
          
          // إنشاء عنصر فيديو وتنشيط الكاميرا
          const video = document.createElement('video');
          video.id = 'scanner-video-manual';
          video.autoplay = true;
          video.playsInline = true;
          
          scannerContainer.appendChild(video);
          
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          video.srcObject = stream;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          video.style.position = 'absolute';
          video.style.top = '0';
          video.style.left = '0';
          video.style.zIndex = '1';
          
          await video.play();
          
          await Toast.show({
            text: 'تم تنشيط الكاميرا بنجاح',
            duration: 'short'
          });
        } catch (error) {
          console.error('فشل في إنشاء عنصر فيديو جديد:', error);
          await Toast.show({
            text: 'فشل في تنشيط الكاميرا. تحقق من أذونات الكاميرا',
            duration: 'short'
          });
        }
      } else {
        // محاولة إعادة تشغيل الفيديو الموجود
        videoElements.forEach(video => {
          if (video.paused && video.srcObject) {
            video.play().catch(err => {
              console.error("ActiveScannerView: خطأ في تشغيل الفيديو:", err);
            });
          }
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center">
      {/* رسالة تحميل أو انتظار تفعيل الكاميرا */}
      {!cameraActive && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center flex-col z-20">
          <RefreshCw className="animate-spin h-16 w-16 text-white mb-4" />
          <p className="text-white text-lg font-bold">جاري تفعيل الكاميرا...</p>
          <p className="text-gray-300 mt-2 text-sm text-center px-6">
            إذا استمر هذا لفترة طويلة، تأكد من منح الإذن للكاميرا في إعدادات جهازك
          </p>
          <Button onClick={handleRefreshCamera} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
      )}
      
      {/* منطقة الكاميرا والرسالة التوجيهية */}
      <div className="relative flex-1 w-full bg-transparent overflow-hidden">
        {/* منطقة العرض الفعلية للكاميرا - سيتم إدراج عنصر فيديو الكاميرا هنا تلقائياً */}
        <div id="barcode-scanner-view" className="absolute inset-0 z-0">
          {/* زر للتبديل إلى وضع التصحيح - يمكن إخفاؤه في الإنتاج */}
          {!cameraActive && (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <p className="text-white text-center">جاري تحضير الكاميرا...</p>
            </div>
          )}
        </div>
        
        {/* رسالة توجيه للمستخدم */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full z-10">
          <h3 className="font-bold text-lg mb-1">قم بتوجيه الكاميرا نحو الباركود</h3>
          <p className="text-sm opacity-75">سيتم التعرف عليه تلقائياً</p>
        </div>

        {/* إطار المسح */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 aspect-video border-2 border-white rounded-lg overflow-hidden z-10">
          {/* خط المسح المتحرك */}
          <div className={`absolute left-0 w-full h-0.5 bg-red-500 ${scanAnimationActive ? 'animate-scanner-line' : ''}`} />
          
          {/* زوايا الإطار */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
        </div>
        
        {/* رسالة الحالة */}
        {isScanningActive ? (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm z-10">
            جاري المسح...
          </div>
        ) : cameraActive && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-500/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm z-10 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            الكاميرا نشطة لكن المسح غير نشط
          </div>
        )}
      </div>
      
      {/* شريط أدوات الماسح */}
      <div className="bg-black w-full p-4 flex justify-between items-center z-10">
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-white hover:text-gray-300"
        >
          <X className="h-6 w-6" /> إغلاق
        </Button>
        
        <div className="flex-1 flex justify-center">
          <Button
            variant="ghost"
            size="lg"
            className={`${cameraActive ? 'bg-white' : 'bg-gray-400'} text-black rounded-full w-16 h-16 flex items-center justify-center`}
            disabled={!cameraActive}
            onClick={handleRefreshCamera}
          >
            {refreshAttempts > 0 ? (
              <RefreshCw className={`h-6 w-6 ${refreshAttempts > 0 ? 'animate-spin' : ''}`} />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        <div className="w-16"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};
