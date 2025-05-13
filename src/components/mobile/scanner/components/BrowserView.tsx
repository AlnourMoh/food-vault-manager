
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, X, Info } from 'lucide-react';
import CapacitorTester from '../../CapacitorTester';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';
import { Capacitor } from '@capacitor/core';
import { platformService } from '@/services/scanner/PlatformService';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  const [showDebug, setShowDebug] = useState(false);
  const environment = useScannerEnvironment();
  
  // للتشخيص الإضافي، نستخدم فحصًا مباشرًا
  const [isDirectlyNative, setIsDirectlyNative] = useState(() => Capacitor.isNativePlatform());
  const [isDirectlyWebView, setIsDirectlyWebView] = useState(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || userAgent.includes('capacitor');
  });
  const [debugInfo, setDebugInfo] = useState({
    userAgent: navigator.userAgent,
    capacitorAvailable: typeof window !== 'undefined' && !!(window as any).Capacitor,
    pluginsAvailable: {
      app: Capacitor.isPluginAvailable('App'),
      camera: Capacitor.isPluginAvailable('Camera')
    }
  });
  
  // تسجيل معلومات البيئة للتشخيص
  useEffect(() => {
    console.log('BrowserView: معلومات البيئة:', {
      fromEnvironmentHook: environment,
      directChecks: {
        isNativePlatform: isDirectlyNative,
        isWebView: isDirectlyWebView,
        debugInfo
      }
    });
  }, [environment, isDirectlyNative, isDirectlyWebView, debugInfo]);
  
  // إذا كنا في بيئة أصلية، نغلق هذه الواجهة تلقائياً
  React.useEffect(() => {
    // استخدام الفحص المباشر لتجنب الاعتماد على الهوك فقط
    const isEffectivelyNative = environment.isNativePlatform || 
                               isDirectlyNative || 
                               isDirectlyWebView || 
                               platformService.isNativePlatform();
    
    if (isEffectivelyNative) {
      console.log('BrowserView: تم اكتشاف بيئة أصلية، إغلاق شاشة BrowserView...');
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [environment.isNativePlatform, onClose, isDirectlyNative, isDirectlyWebView]);

  // إذا كنا في بيئة أصلية، لا نعرض هذا المكون على الإطلاق
  if (environment.isNativePlatform || isDirectlyNative || isDirectlyWebView || platformService.isNativePlatform()) {
    return null;
  }

  // إذا كنا في WebView لكن لسنا في البيئة الأصلية، نعرض رسالة مختلفة
  const isInWebView = environment.isWebView && !environment.isNativePlatform;

  return (
    <div className="browser-view-container p-4">
      <div className="w-full rounded-md bg-red-500 text-white p-4 mb-4 text-center">
        <h2 className="text-xl font-bold mb-2">المسح غير متاح في المتصفح</h2>
        <p className="text-white">
          يرجى استخدام تطبيق الجوال للقيام بعمليات المسح
        </p>
      </div>
      
      <div className="browser-view-icon-container mb-4 flex justify-center">
        <Smartphone className="h-12 w-12 text-red-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-2 text-center">تعذر تشغيل الماسح</h2>
      <p className="text-gray-600 mb-4 text-center">
        {isInWebView 
          ? "يبدو أنك تستخدم التطبيق داخل متصفح. للحصول على وظائف كاملة، يرجى تثبيت التطبيق من المتجر."
          : "ميزة المسح الضوئي متاحة فقط في تطبيق الجوال."}
      </p>
      
      <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start">
        <Info className="text-blue-500 h-5 w-5 mt-0.5 ml-2 flex-shrink-0" />
        <div className="text-blue-800 text-sm text-right">
          <p className="font-medium mb-1">كيفية استخدام الماسح الضوئي:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>قم بتثبيت تطبيق مخزن الطعام على جهازك الجوال</li>
            <li>قم بتسجيل الدخول إلى حسابك</li>
            <li>انتقل إلى قسم المنتجات واستخدم زر "مسح باركود"</li>
          </ol>
        </div>
      </div>
      
      {showDebug && (
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-xs text-gray-800 dir-ltr">
          <h4 className="font-bold mb-1">معلومات تشخيصية:</h4>
          <pre className="whitespace-pre-wrap">
            {`منصة التشغيل: ${environment.platform}
بيئة أصلية: ${environment.isNativePlatform ? 'نعم' : 'لا'}
WebView: ${environment.isWebView ? 'نعم' : 'لا'}
وجود Capacitor: ${environment.hasCapacitor ? 'نعم' : 'لا'}
ملحق MLKitBarcodeScanner: ${environment.availablePlugins.mlkitScanner ? 'متاح' : 'غير متاح'}
ملحق Camera: ${environment.availablePlugins.camera ? 'متاح' : 'غير متاح'}
ملحق BarcodeScanner: ${environment.availablePlugins.barcodeScanner ? 'متاح' : 'غير متاح'}
فحص مباشر - بيئة أصلية: ${isDirectlyNative ? 'نعم' : 'لا'}
فحص مباشر - WebView: ${isDirectlyWebView ? 'نعم' : 'لا'}
userAgent: ${navigator.userAgent}`}
          </pre>
        </div>
      )}
      
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={onClose} className="w-full">إغلاق</Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDebug(!showDebug)} 
          className="text-xs"
        >
          {showDebug ? 'إخفاء معلومات التشخيص' : 'عرض معلومات التشخيص'}
        </Button>
      </div>
    </div>
  );
};
