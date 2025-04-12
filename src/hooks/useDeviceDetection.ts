
/**
 * دالة للكشف عن نوع الجهاز المستخدم
 * تتحقق مما إذا كان الجهاز الحالي هو هاتف محمول أو لا
 */
export const useDeviceDetection = () => {
  // التحقق من العميل (المتصفح) بناءً على وكيل المستخدم
  const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // التحقق من حجم الشاشة (طريقة بديلة للكشف عن الأجهزة المحمولة)
  const isMobileView = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  };

  return {
    isMobile: isMobileDevice() || isMobileView(),
    isMobileDevice,
    isMobileView
  };
};

export default useDeviceDetection;
