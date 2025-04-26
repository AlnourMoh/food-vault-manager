
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // تعريف الحالة أولاً مع قيمة افتراضية
  const [isMobile, setIsMobile] = useState(
    // تجنب استخدام window في التهيئة المبدئية خارج useEffect
    false
  );

  useEffect(() => {
    // التأكد من أن الكود يعمل فقط في بيئة المتصفح (وليس في بيئة SSR)
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // تعيين القيمة الأولية
    checkIfMobile();
    
    // إضافة مستمع لتغيرات حجم النافذة
    window.addEventListener('resize', checkIfMobile);
    
    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
}
