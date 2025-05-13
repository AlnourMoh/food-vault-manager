
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionViewProps {
  onRequestPermission: () => Promise<boolean>;
  onClose: () => void;
}

export const PermissionView: React.FC<PermissionViewProps> = ({ onRequestPermission, onClose }) => {
  return (
    <Card className="p-6 flex flex-col items-center text-center max-w-md mx-auto">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">لا يمكن الوصول للكاميرا</h2>
      <p className="text-gray-500 mb-6">
        يجب منح التطبيق إذن استخدام الكاميرا للقيام بعملية المسح.
        يرجى منح الإذن في إعدادات التطبيق.
      </p>
      <div className="flex gap-2 w-full">
        <Button 
          onClick={onRequestPermission} 
          className="flex-1"
        >
          طلب الإذن
        </Button>
        <Button 
          onClick={onClose} 
          variant="outline"
          className="flex-1"
        >
          إغلاق
        </Button>
      </div>
    </Card>
  );
};
