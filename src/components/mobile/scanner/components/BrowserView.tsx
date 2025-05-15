
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, QrCode } from 'lucide-react';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';
import CapacitorTester from '@/components/mobile/CapacitorTester';

interface BrowserViewProps {
  onClose: () => void;
}

/**
 * عرض بديل عندما نكون في بيئة المتصفح وليس في تطبيق الجوال
 */
export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  const environment = useScannerEnvironment();
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-gray-800">المسح غير متاح</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
        <div className="bg-amber-100 p-4 rounded-full">
          <AlertTriangle className="w-10 h-10 text-amber-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800">ميزة المسح غير متاحة في المتصفح</h3>
          <p className="text-gray-600">
            لاستخدام ماسح الباركود، يجب تشغيل التطبيق على جهاز جوال كتطبيق أصلي وليس من خلال متصفح الويب.
          </p>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <h4 className="font-bold mb-2 text-gray-700">تشخيص البيئة الحالية:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-gray-600">بيئة أصلية:</span>
            <span className={environment.isNativePlatform ? "text-green-600" : "text-red-600"}>
              {environment.isNativePlatform ? "نعم" : "لا"}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">WebView:</span>
            <span className={environment.isWebView ? "text-green-600" : "text-red-600"}>
              {environment.isWebView ? "نعم" : "لا"}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Capacitor:</span>
            <span className={environment.hasCapacitor ? "text-green-600" : "text-red-600"}>
              {environment.hasCapacitor ? "متاح" : "غير متاح"}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">ملحق MLKit:</span>
            <span className={environment.availablePlugins.mlkitScanner ? "text-green-600" : "text-red-600"}>
              {environment.availablePlugins.mlkitScanner ? "متاح" : "غير متاح"}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">ملحق الكاميرا:</span>
            <span className={environment.availablePlugins.camera ? "text-green-600" : "text-red-600"}>
              {environment.availablePlugins.camera ? "متاح" : "غير متاح"}
            </span>
          </li>
        </ul>
      </div>
      
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-center"
          onClick={onClose}
        >
          إغلاق
        </Button>
        <p className="text-xs text-gray-500 text-center">
          يرجى تثبيت وفتح التطبيق على جهازك المحمول لاستخدام ميزة المسح الضوئي.
        </p>
      </div>
      
      <div className="mt-6">
        <CapacitorTester />
      </div>
    </div>
  );
};
