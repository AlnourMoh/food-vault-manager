
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import MobileApp from './components/mobile/MobileApp.tsx';
import './styles/index.ts';

// التحقق ما إذا كان الجهاز محمولاً أو لا
const isMobileApp = () => {
  // التحقق من وجود Capacitor (للأجهزة المحمولة)
  if (window.Capacitor) {
    return true;
  }
  
  // إذا كان Capacitor غير موجود، استخدم user agent للتحقق
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  
  // يمكنك أيضاً استخدام معلمات URL للتحكم في العرض (مفيد للاختبار)
  const urlParams = new URLSearchParams(window.location.search);
  const forceMobile = urlParams.get('mobile') === 'true';
  
  return isMobileUserAgent || forceMobile;
};

// اختيار التطبيق المناسب
const AppComponent = isMobileApp() ? MobileApp : App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
);
