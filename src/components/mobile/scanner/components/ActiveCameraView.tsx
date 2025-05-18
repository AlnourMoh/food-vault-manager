
import React, { useEffect, useRef } from 'react';

/**
 * مكون بسيط لعرض عنصر الكاميرا بشكل واضح
 */
export const ActiveCameraView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // تأكد من أن جميع عناصر الفيديو مرئية
    const checkAndFixVideoVisibility = () => {
      if (!containerRef.current) return;
      
      // البحث عن عناصر الفيديو في الصفحة
      const videoElements = document.querySelectorAll('video');
      
      if (videoElements.length === 0) {
        console.log('ActiveCameraView: لا توجد عناصر فيديو للعرض');
        return;
      }
      
      console.log(`ActiveCameraView: تم العثور على ${videoElements.length} عنصر فيديو`);
      
      // تطبيق أنماط للتأكد من عرض الفيديو بشكل صحيح
      videoElements.forEach(video => {
        // نقل الفيديو إلى حاوية العرض
        if (containerRef.current && !containerRef.current.contains(video)) {
          try {
            // إضافة نسخة من عنصر الفيديو إلى الحاوية
            const clonedVideo = video.cloneNode(true) as HTMLVideoElement;
            containerRef.current.appendChild(clonedVideo);
            
            // تطبيق أنماط الرؤية
            clonedVideo.style.position = 'absolute';
            clonedVideo.style.inset = '0px';
            clonedVideo.style.width = '100%';
            clonedVideo.style.height = '100%';
            clonedVideo.style.objectFit = 'cover';
            clonedVideo.style.zIndex = '1';
            clonedVideo.style.opacity = '1';
            clonedVideo.style.visibility = 'visible';
            clonedVideo.style.display = 'block';
            
            // تشغيل الفيديو إذا كان متوقفًا
            if (clonedVideo.paused && clonedVideo.srcObject) {
              clonedVideo.play().catch(err => 
                console.warn('فشل في تشغيل الفيديو:', err)
              );
            }
            
            console.log('ActiveCameraView: تم نقل عنصر الفيديو إلى حاوية العرض');
          } catch (err) {
            console.error('خطأ في نقل الفيديو:', err);
          }
        }
        
        // أيضًا تطبيق أنماط على الفيديو الأصلي
        video.style.opacity = '1';
        video.style.visibility = 'visible';
        video.style.display = 'block';
        video.style.zIndex = '1';
      });
    };
    
    // التحقق المباشر
    checkAndFixVideoVisibility();
    
    // التحقق الدوري كل 500 مللي ثانية
    const interval = setInterval(checkAndFixVideoVisibility, 500);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 bg-black overflow-hidden"
      style={{
        zIndex: 5,
        opacity: 1,
        visibility: 'visible'
      }}
    />
  );
};
