
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import MobileApp from './components/mobile/MobileApp.tsx';
import './styles/index.ts';

// دالة للتحقق ما إذا كان الجهاز محمولاً أو لا
const isMobileApp = () => {
  // التحقق من وجود Capacitor (للأجهزة المحمولة)
  if (window.Capacitor) {
    return true;
  }
  
  // إذا كان Capacitor غير موجود، استخدم user agent للتحقق
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // تحسين التعرف على الأجهزة المحمولة
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  
  // التحقق من عرض الشاشة (أقل من 768 بيكسل يعتبر هاتف محمول)
  const isMobileScreenSize = window.innerWidth < 768;
  
  // التحقق مما إذا كان المستخدم يريد عرض واجهة الجهاز المحمول (مفيد للاختبار)
  const urlParams = new URLSearchParams(window.location.search);
  const forceMobile = urlParams.get('mobile') === 'true';
  const forceDesktop = urlParams.get('desktop') === 'true';
  
  // إذا كان المستخدم يريد إجبار واجهة سطح المكتب، لا تستخدم واجهة الجوال
  if (forceDesktop) {
    return false;
  }
  
  // إذا كان المستخدم يريد إجبار واجهة الجوال، استخدم واجهة الجوال
  if (forceMobile) {
    return true;
  }
  
  // في Capacitor، دائماً استخدم واجهة الجوال
  if (window.Capacitor) {
    return true;
  }
  
  // في حالة استخدام متصفح عادي، استخدم حجم الشاشة ونوع المتصفح للتحديد
  return isMobileUserAgent && isMobileScreenSize;
};

// اختيار التطبيق المناسب بناءً على نوع الجهاز
const AppComponent = isMobileApp() ? MobileApp : App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
);
