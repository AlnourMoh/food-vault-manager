
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  return (
    <div className="text-center p-4">
      <div className="bg-gray-100 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">
        <Smartphone className="h-12 w-12 text-gray-500" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">مسح الباركود غير متاح</h3>
      
      <p className="text-gray-600 mb-6">
        عذراً، مسح الباركود غير متاح في متصفح الويب. يرجى استخدام تطبيق الجوال للوصول إلى هذه الميزة.
      </p>
      
      <Button 
        onClick={onClose} 
        className="w-full"
        variant="default"
      >
        حسناً، فهمت
      </Button>
    </div>
  );
};
