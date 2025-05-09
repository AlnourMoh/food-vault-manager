
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface PermissionRequestViewProps {
  onRequestPermission: () => Promise<void>;
  onClose: () => void;
}

export const PermissionRequestView: React.FC<PermissionRequestViewProps> = ({ onRequestPermission, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-md text-center">
        <div className="mx-auto bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Camera className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">يلزم إذن الكاميرا</h2>
        <p className="text-muted-foreground mb-6">
          يرجى السماح باستخدام الكاميرا لمسح الرموز الشريطية
        </p>
        <div className="space-y-2">
          <Button onClick={onRequestPermission} className="w-full">
            <Camera className="h-4 w-4 ml-2" />
            السماح باستخدام الكاميرا
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};
