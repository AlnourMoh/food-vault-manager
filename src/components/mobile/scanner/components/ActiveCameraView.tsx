
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from '@capacitor/toast';

interface ActiveCameraViewProps {
  forceActivate?: boolean;
}

/**
 * مكون لعرض الكاميرا بشكل مباشر مع تأكيد عرض الفيديو بشكل صحيح
 */
export const ActiveCameraView: React.FC<ActiveCameraViewProps> = ({ forceActivate = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // وظيفة لإضافة سجل
  const addLog = (message: string) => {
    console.log(`ActiveCameraView: ${message}`);
    setLogs(prev => [message, ...prev].slice(0, 5));
    
    // لا نعرض toast للمستخدم ما لم يكن هناك خطأ
    if (message.includes('خطأ') || message.includes('فشل')) {
      try {
        Toast.show({
          text: message,
          duration: 'short'
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // تنشيط الكاميرا عند تحميل المكون
  useEffect(() => {
    const activateCamera = async () => {
      try {
        // التحقق من وجود واجهة mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('واجهة برمجة الكاميرا غير متاحة في هذا المتصفح');
        }
        
        addLog('بدء تهيئة الكاميرا...');

        // طلب دفق الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        addLog('تم الوصول للكاميرا بنجاح');

        // إنشاء عنصر فيديو جديد إذا لم يكن موجودًا
        if (!videoRef.current) {
          const video = document.createElement('video');
          video.id = 'camera-view-video';
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;

          // تطبيق الأنماط
          Object.assign(video.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: '10',
            backgroundColor: '#000000'
          });

          videoRef.current = video;
        }

        // تعيين مصدر الدفق وإضافة الفيديو للحاوية
        videoRef.current.srcObject = stream;
        
        // محاولة تشغيل الفيديو
        try {
          await videoRef.current.play();
          addLog('تم تشغيل عنصر الفيديو');
        } catch (playError) {
          addLog(`فشل تشغيل الفيديو: ${playError instanceof Error ? playError.message : 'خطأ غير معروف'}`);
          
          // محاولة تشغيل بعد تأخير قصير
          setTimeout(() => {
            videoRef.current?.play().catch(() => {});
          }, 500);
        }
        
        // إضافة الفيديو للحاوية
        if (containerRef.current && videoRef.current) {
          // إزالة أي فيديو سابق
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(videoRef.current);
          addLog('تم إضافة عنصر الفيديو إلى DOM');
        }

        setIsActive(true);
        setError(null);

        // إعادة تنشيط الفيديو بشكل دوري
        const keepAliveInterval = setInterval(() => {
          if (videoRef.current?.paused && videoRef.current?.srcObject) {
            addLog('إعادة تشغيل الفيديو المتوقف');
            videoRef.current.play().catch(() => {});
          }
        }, 2000);

        // تنظيف عند إلغاء التحميل
        return () => {
          clearInterval(keepAliveInterval);
          
          // إيقاف المسارات
          stream.getTracks().forEach(track => track.stop());
          addLog('تم إيقاف مسارات الكاميرا');
          
          // إزالة عنصر الفيديو
          if (videoRef.current && videoRef.current.parentNode) {
            videoRef.current.parentNode.removeChild(videoRef.current);
          }
          
          setIsActive(false);
        };
      } catch (error) {
        setIsActive(false);
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        setError(`فشل في تنشيط الكاميرا: ${errorMessage}`);
        addLog(`خطأ: ${errorMessage}`);
        
        // إظهار رسالة خطأ للمستخدم
        try {
          Toast.show({
            text: `تعذر الوصول إلى الكاميرا: ${errorMessage}`,
            duration: 'long'
          }).catch(() => {});
        } catch (e) {}
        
        // محاولة تنشيط الكاميرا مرة أخرى بعد فترة
        if (forceActivate) {
          setTimeout(() => {
            addLog('محاولة إعادة تنشيط الكاميرا...');
            activateCamera();
          }, 3000);
        }
      }
    };

    // تنشيط الكاميرا
    activateCamera();
    
  }, [forceActivate]);

  return (
    <>
      {/* حاوية الكاميرا */}
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-black overflow-hidden z-10"
        style={{
          opacity: 1,
          visibility: 'visible'
        }}
      />
      
      {/* عرض رسائل الخطأ */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg max-w-xs text-center">
            <p>{error}</p>
            <button 
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                setError(null);
                setTimeout(() => activateCamera(), 500);
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
      
      {/* مؤشر الحالة */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center z-20">
        <div className={`text-xs px-2 py-1 rounded-full ${isActive ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
          {isActive ? 'الكاميرا نشطة' : 'جاري تنشيط الكاميرا...'}
        </div>
      </div>
      
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
  
  // وظيفة مساعدة لتنشيط الكاميرا
  function activateCamera() {
    // محاولة إعادة تنشيط الكاميرا
    setError(null);
    setIsActive(false);
    
    // فحص الكاميرات المتاحة
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(device => device.kind === 'videoinput');
        addLog(`تم العثور على ${cameras.length} كاميرا`);
        
        // إعادة تهيئة الكاميرا
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play()
              .then(() => {
                setIsActive(true);
                addLog('تم إعادة تنشيط الكاميرا بنجاح');
              })
              .catch(err => {
                addLog(`فشل تشغيل الفيديو: ${err.message}`);
              });
          }
        })
        .catch(err => {
          setError(`فشل في إعادة تنشيط الكاميرا: ${err.message}`);
        });
      })
      .catch(err => {
        setError(`فشل في تعداد أجهزة الكاميرا: ${err.message}`);
      });
  }
};
