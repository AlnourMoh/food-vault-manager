
import React from 'react';
import { Card } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  return (
    <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
      <Smartphone className="h-16 w-16 text-blue-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">المسح غير متاح في المتصفح</h2>
      <p className="text-gray-500 mb-6">
        عملية مسح الباركود متاحة فقط في تطبيق الهاتف المحمول.
        يرجى تنزيل وفتح تطبيق الجوال للقيام بعمليات المسح.
      </p>
      <Button 
        onClick={onClose} 
        className="w-full"
        variant="default"
      >
        إغلاق
      </Button>
    </Card>
  );
};
