
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // تعريف الحالة أولاً مع قيمة افتراضية
  const [isMobile, setIsMobile] = useState(
    // نستخدم window فقط إذا كانت متاحة، وإلا نضع قيمة افتراضية false
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    // التأكد من أن الكود يعمل فقط في بيئة المتصفح (وليس في بيئة SSR)
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // إضافة مستمع لتغيرات حجم النافذة
    window.addEventListener('resize', checkIfMobile);
    
    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
}
