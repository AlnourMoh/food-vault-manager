
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  const environment = useScannerEnvironment();

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <Smartphone className="h-20 w-20 text-gray-400 mb-6" />
      
      <h2 className="text-2xl font-bold text-center mb-2">
        المسح الضوئي غير متاح في المتصفح
      </h2>
      
      <p className="text-center text-gray-500 mb-6">
        لاستخدام الماسح الضوئي، يرجى تثبيت التطبيق على جهازك الجوال أو استخدام التطبيق من متجر التطبيقات.
      </p>
      
      <Button 
        variant="outline" 
        className="w-full mb-2"
        onClick={onClose}
      >
        إغلاق
      </Button>
      
      <div className="w-full mt-8 text-xs text-gray-500 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">معلومات عن نظام التشغيل:</h3>
        <ul className="space-y-1">
          <li>منصة: {environment.platform}</li>
          <li>بيئة أصلية: {environment.isNativePlatform ? 'نعم' : 'لا'}</li>
          <li>جهاز جوال: {environment.isMobileDevice ? 'نعم' : 'لا'}</li>
          {environment.isAndroid && <li>نظام: أندرويد</li>}
          {environment.isIOS && <li>نظام: iOS</li>}
          <li>تطبيق ويب: {environment.isWebView ? 'نعم' : 'لا'}</li>
          <li>Capacitor: {environment.hasCapacitor ? 'متاح' : 'غير متاح'}</li>
          <li>MLKitScanner: {environment.availablePlugins.mlkitScanner ? 'متاح' : 'غير متاح'}</li>
          <li>Camera: {environment.availablePlugins.camera ? 'متاح' : 'غير متاح'}</li>
          <li>App: {environment.availablePlugins.app ? 'متاح' : 'غير متاح'}</li>
        </ul>
      </div>
    </div>
  );
};
