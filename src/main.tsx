
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import MobileApp from './components/mobile/MobileApp.tsx';
import './styles/index.ts';

// دالة محسنة للتحقق ما إذا كان الجهاز محمولاً أو لا
const isMobileApp = () => {
  // التحقق مما إذا كان المستخدم يريد إجبار واجهة معينة (مفيد للاختبار)
  const urlParams = new URLSearchParams(window.location.search);
  const forceMobile = urlParams.get('mobile') === 'true';
  const forceDesktop = urlParams.get('desktop') === 'true';
  
  // إذا كان هناك إجبار لواجهة معينة، استخدمها بغض النظر عن نوع الجهاز
  if (forceDesktop) {
    return false;
  }
  if (forceMobile) {
    return true;
  }
  
  // التحقق من وجود Capacitor (للأجهزة المحمولة)
  if (window.Capacitor) {
    return true;
  }
  
  // استخدام user agent للتحقق
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent.toLowerCase());
  
  // التحقق من عرض الشاشة (أقل من 768 بيكسل يعتبر هاتف محمول)
  const isMobileScreenSize = window.innerWidth < 768;
  
  // الجمع بين جميع التحققات للحصول على قرار أكثر دقة
  return isMobileUserAgent || isMobileScreenSize;
};

// تحديد نوع التطبيق الذي سيتم عرضه بناءً على الجهاز
const isMobile = isMobileApp();
const AppComponent = isMobile ? MobileApp : App;

console.log('Device detected as:', isMobile ? 'Mobile' : 'Desktop');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
);
