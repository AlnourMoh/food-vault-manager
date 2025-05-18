
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from '@capacitor/toast';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, Check } from 'lucide-react';
import { cameraService } from '@/services/camera/CameraService';

interface ActiveCameraViewProps {
  forceActivate?: boolean;
  showControls?: boolean;
  showStatus?: boolean;
}

/**
 * مكون لعرض الكاميرا بشكل مباشر مع تأكيد عرض الفيديو بشكل صحيح
 */
export const ActiveCameraView: React.FC<ActiveCameraViewProps> = ({ 
  forceActivate = false,
  showControls = false,
  showStatus = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // وظيفة لإضافة سجل
  const addLog = (message: string) => {
    console.log(`ActiveCameraView: ${message}`);
    setLogs(prev => [message, ...prev].slice(0, 5));
  };

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      console.log('ActiveCameraView: تنظيف موارد الكاميرا عند إزالة المكون');
      cameraService.stopCamera().catch(console.error);
    };
  }, []);

  // تنشيط الكاميرا عند تحميل المكون
  useEffect(() => {
    const activateCamera = async () => {
      try {
        if (containerRef.current) {
          addLog('بدء تهيئة الكاميرا...');

          // استخدام خدمة الكاميرا لتشغيل الكاميرا
          const video = await cameraService.startCamera();
          
          // إضافة الفيديو إلى حاوية العرض
          if (containerRef.current) {
            // تنظيف الحاوية أولاً
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(video);
            addLog('تم إضافة عنصر الفيديو إلى DOM');
          }

          setIsActive(true);
          setError(null);
          
          // إظهار رسالة نجاح للمستخدم
          await Toast.show({
            text: 'تم تنشيط الكاميرا بنجاح',
            duration: 'short'
          }).catch(() => {});
        }
      } catch (error) {
        setIsActive(false);
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        setError(`فشل في تنشيط الكاميرا: ${errorMessage}`);
        addLog(`خطأ: ${errorMessage}`);
        
        // إظهار رسالة خطأ للمستخدم
        await Toast.show({
          text: `تعذر الوصول إلى الكاميرا: ${errorMessage}`,
          duration: 'long'
        }).catch(() => {});
        
        // محاولة تنشيط الكاميرا مرة أخرى بعد فترة
        if (forceActivate) {
          setTimeout(() => {
            addLog('محاولة إعادة تنشيط الكاميرا بعد الفشل...');
            activateCamera();
          }, 3000);
        }
      }
    };

    // تنشيط الكاميرا فقط إذا كان forceActivate = true
    if (forceActivate) {
      activateCamera();
    }
  }, [forceActivate]);

  // وظيفة لإعادة تنشيط الكاميرا
  const handleReactivate = async () => {
    setError(null);
    setIsActive(false);
    
    try {
      // إيقاف الكاميرا أولاً
      await cameraService.stopCamera();
      
      // إعادة تشغيل الكاميرا بعد تأخير قصير
      setTimeout(async () => {
        try {
          const video = await cameraService.startCamera();
          
          // إضافة الفيديو إلى حاوية العرض
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(video);
            addLog('تم إعادة تنشيط الكاميرا وإضافة عنصر الفيديو');
            setIsActive(true);
          }
        } catch (error) {
          setError(`فشل في إعادة تنشيط الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
        }
      }, 500);
    } catch (error) {
      setError(`خطأ في إعادة تنشيط الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  return (
    <>
      {/* حاوية الكاميرا */}
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-black overflow-hidden z-10 camera-active"
        style={{
          opacity: 1,
          visibility: 'visible'
        }}
      />
      
      {/* عرض رسائل الخطأ */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg max-w-xs text-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="mb-2">{error}</p>
            <Button 
              variant="destructive"
              onClick={handleReactivate}
              className="w-full mt-2"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      )}
      
      {/* مؤشر الحالة */}
      {showStatus && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center z-20">
          <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
            isActive ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
          }`}>
            {isActive ? (
              <>
                <Check className="h-3 w-3" />
                <span>الكاميرا نشطة</span>
              </>
            ) : (
              <>
                <Camera className="h-3 w-3 animate-pulse" />
                <span>جاري تنشيط الكاميرا...</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* عناصر التحكم */}
      {showControls && (
        <div className="absolute top-2 right-2 z-30">
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/40"
            onClick={handleReactivate}
          >
            إعادة تشغيل الكاميرا
          </Button>
        </div>
      )}
      
      {/* تسجيل التشخيص */}
      {logs.length > 0 && (
        <div className="absolute top-2 left-0 right-0 z-30 flex justify-center">
          <div className="bg-black/50 backdrop-blur-sm text-white text-xs p-1 rounded max-w-xs truncate">
            {logs[0]}
          </div>
        </div>
      )}
    </>
  );
};
