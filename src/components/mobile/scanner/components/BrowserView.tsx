
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, X, Info } from 'lucide-react';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  return (
    <div className="browser-view-container">
      <div className="browser-view-icon-container">
        <Smartphone className="h-10 w-10 text-red-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">الماسح الضوئي غير متاح</h2>
      <p className="text-gray-600 mb-4">
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
      
      <div className="mt-6">
        <Button onClick={onClose} className="w-full">إغلاق</Button>
      </div>
    </div>
  );
};
