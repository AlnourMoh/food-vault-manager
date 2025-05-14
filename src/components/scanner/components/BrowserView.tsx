
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, X } from 'lucide-react';

interface BrowserViewProps {
  onClose: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <div className="mx-auto bg-yellow-100 text-yellow-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <QrCode className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">المسح غير متاح في المتصفح</h2>
        <p className="text-gray-500 mb-6">خاصية مسح الباركود تعمل فقط في تطبيق الجوال. يرجى تنزيل التطبيق واستخدامه لمسح الباركود.</p>
        <Button onClick={onClose} className="w-full">
          <X className="h-4 w-4 ml-2" />
          إغلاق
        </Button>
      </div>
    </div>
  );
};

export default BrowserView;
