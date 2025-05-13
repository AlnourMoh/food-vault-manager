
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, X, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { platformService } from '@/services/scanner/PlatformService';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    // تحقق مما إذا كنا في بيئة تطبيق أصلية
    const isNativePlatform = platformService.isNativePlatform();
    const currentPlatform = platformService.getPlatform();
    
    console.log('BrowserView: هل نحن في بيئة أصلية؟', isNativePlatform);
    console.log('BrowserView: المنصة الحالية:', currentPlatform);
    
    // جمع معلومات التشخيص
    const info = [
      `منصة التشغيل: ${currentPlatform}`,
      `بيئة أصلية: ${isNativePlatform ? 'نعم' : 'لا'}`,
      `وجود Capacitor: ${platformService.hasCapacitor() ? 'نعم' : 'لا'}`,
      `ملحق MLKitBarcodeScanner: ${platformService.isPluginAvailable('MLKitBarcodeScanner') ? 'متاح' : 'غير متاح'}`,
      `ملحق Camera: ${platformService.isPluginAvailable('Camera') ? 'متاح' : 'غير متاح'}`,
      `userAgent: ${navigator.userAgent}`
    ];
    
    setIsNative(isNativePlatform);
    setPlatform(currentPlatform);
    setDebugInfo(info);
  }, []);
  
  // إذا كنا في بيئة أصلية، نغلق هذه الواجهة تلقائياً
  useEffect(() => {
    if (isNative) {
      console.log('BrowserView: تم اكتشاف بيئة أصلية، إغلاق شاشة BrowserView...');
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isNative, onClose]);

  if (isNative) {
    return null;
  }

  return (
    <div className="browser-view-container p-4">
      <div className="browser-view-icon-container mb-4 flex justify-center">
        <Smartphone className="h-12 w-12 text-red-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-2 text-center">الماسح الضوئي غير متاح</h2>
      <p className="text-gray-600 mb-4 text-center">
        ميزة المسح الضوئي متاحة فقط في تطبيق الجوال.
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
            {debugInfo.join('\n')}
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
