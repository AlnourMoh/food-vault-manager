
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface BrowserViewProps {
  onClose: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-4 bg-white rounded-lg border">
      <Camera className="w-16 h-16 text-blue-500" />
      <h3 className="text-xl font-bold">المسح غير متاح في المتصفح</h3>
      <p className="text-center text-gray-600">
        ميزة مسح الباركود متاحة فقط في تطبيق الهاتف. يرجى استخدام التطبيق لمسح الرموز.
      </p>
      <Button onClick={onClose}>إغلاق</Button>
    </div>
  );
};

export default BrowserView;
