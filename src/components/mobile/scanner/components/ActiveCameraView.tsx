
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from '@capacitor/toast';

/**
 * مكون بسيط لعرض عنصر الكاميرا بشكل واضح مع معلومات تشخيصية
 */
export const ActiveCameraView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [lastLog, setLastLog] = useState<string>('');

  // وظيفة لإضافة سجل تشخيصي
  const addDiagnostic = (message: string) => {
    console.log(`ActiveCameraView: ${message}`);
    setDiagnostics(prev => [...prev, message]);
    setLastLog(message);
    
    // عرض آخر رسالة تشخيصية للمستخدم
    try {
      Toast.show({
        text: message,
        duration: 'short'
      });
    } catch(e) {
      console.error('فشل عرض Toast:', e);
    }
  };

  useEffect(() => {
    // تأكد من أن جميع عناصر الفيديو مرئية
    const checkAndFixVideoVisibility = () => {
      if (!containerRef.current) {
        addDiagnostic('حاوية العرض غير موجودة');
        return;
      }
      
      // البحث عن عناصر الفيديو في الصفحة
      const videoElements = document.querySelectorAll('video');
      
      if (videoElements.length === 0) {
        addDiagnostic('لا توجد عناصر فيديو للعرض');
        // إنشاء عنصر فيديو إذا لم يكن موجوداً
        tryCreateVideoElement();
        return;
      }
      
      addDiagnostic(`تم العثور على ${videoElements.length} عنصر فيديو`);
      
      // تطبيق أنماط للتأكد من عرض الفيديو بشكل صحيح
      videoElements.forEach((video, index) => {
        // تحقق من خصائص الفيديو
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const hasStream = video.srcObject !== null;
        
        addDiagnostic(`فيديو ${index+1}: الأبعاد=${videoWidth}x${videoHeight}, المصدر=${hasStream ? 'نعم' : 'لا'}`);
        
        // نقل الفيديو إلى حاوية العرض
        if (containerRef.current && !containerRef.current.contains(video)) {
          try {
            // إضافة نسخة من عنصر الفيديو إلى الحاوية
            const clonedVideo = video.cloneNode(true) as HTMLVideoElement;
            containerRef.current.appendChild(clonedVideo);
            
            // تطبيق أنماط الرؤية
            applyVisibilityStyles(clonedVideo);
            
            // تشغيل الفيديو إذا كان متوقفًا
            if (clonedVideo.paused && clonedVideo.srcObject) {
              clonedVideo.play().catch(err => {
                addDiagnostic(`فشل في تشغيل الفيديو: ${err.message}`);
              });
            }
            
            addDiagnostic('تم نقل عنصر الفيديو إلى حاوية العرض');
          } catch (err) {
            addDiagnostic(`خطأ في نقل الفيديو: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
          }
        }
        
        // أيضًا تطبيق أنماط على الفيديو الأصلي
        applyVisibilityStyles(video);
      });
    };

    // تطبيق أنماط الرؤية على عنصر الفيديو
    const applyVisibilityStyles = (video: HTMLVideoElement) => {
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      video.style.display = 'block';
      video.style.zIndex = '1';
      video.style.position = 'absolute';
      video.style.inset = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
    };

    // محاولة إنشاء عنصر فيديو باستخدام mediaDevices إذا كان متاحًا
    const tryCreateVideoElement = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addDiagnostic('mediaDevices غير مدعوم في هذا المتصفح');
        return;
      }

      try {
        addDiagnostic('محاولة إنشاء عنصر فيديو...');
        
        // طلب الوصول إلى الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // إنشاء عنصر فيديو جديد
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.id = 'manual-video-stream';
        
        // تطبيق الأنماط
        applyVisibilityStyles(video);
        
        // إضافة عنصر الفيديو إلى الحاوية
        if (containerRef.current) {
          containerRef.current.appendChild(video);
          addDiagnostic('تم إنشاء وإضافة عنصر فيديو');
          
          // بدء تشغيل الفيديو
          video.play().catch(err => {
            addDiagnostic(`فشل في تشغيل الفيديو المنشأ: ${err.message}`);
          });
        }
      } catch (err) {
        addDiagnostic(`فشل في الوصول إلى الكاميرا: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
      }
    };
    
    // التحقق المباشر
    addDiagnostic('تهيئة عرض الكاميرا');
    checkAndFixVideoVisibility();
    
    // التحقق الدوري كل 2000 مللي ثانية
    const interval = setInterval(checkAndFixVideoVisibility, 2000);
    
    return () => {
      clearInterval(interval);
      addDiagnostic('إيقاف عرض الكاميرا');
    };
  }, []);

  // تحقق من وجود الكاميرا عند تحميل المكون
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        // تحقق من وجود mediaDevices API
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          addDiagnostic('واجهة mediaDevices غير مدعومة في هذا المتصفح');
          return;
        }
        
        // الحصول على قائمة الأجهزة المتاحة
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          addDiagnostic('لم يتم العثور على كاميرات متاحة');
        } else {
          addDiagnostic(`تم العثور على ${videoDevices.length} كاميرا`);
          
          // طباعة معلومات الكاميرات المتاحة
          videoDevices.forEach((device, index) => {
            console.log(`كاميرا ${index+1}: ${device.label || 'بدون تسمية'}`);
          });
        }
      } catch (err) {
        addDiagnostic(`فشل فحص الكاميرات: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
      }
    };
    
    checkCameraAvailability();
  }, []);
  
  return (
    <>
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-black overflow-hidden"
        style={{
          zIndex: 5,
          opacity: 1,
          visibility: 'visible'
        }}
      />
      
      {/* عرض آخر رسالة تشخيصية في أسفل الشاشة */}
      <div className="absolute bottom-2 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center">
        {lastLog}
      </div>
    </>
  );
};
