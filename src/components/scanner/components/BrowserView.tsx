
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, AlertCircle } from 'lucide-react';

interface BrowserViewProps {
  onClose: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold">قارئ الباركود غير متوفر</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        قارئ الباركود غير متوفر في المتصفح. يرجى استخدام تطبيق الجوال للوصول لهذه الميزة.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="outline" onClick={onClose} className="w-full">
          إغلاق
        </Button>
      </div>
    </div>
  );
};

export default BrowserView;
