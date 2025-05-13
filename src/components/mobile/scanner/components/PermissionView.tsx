
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Settings, Keyboard } from 'lucide-react';

export interface PermissionViewProps {
  handleRequestPermission: () => Promise<void>;
  onClose: () => void;
  onManualEntry?: () => void;
}

export const PermissionView: React.FC<PermissionViewProps> = ({
  handleRequestPermission,
  onClose,
  onManualEntry
}) => {
  return (
    <div className="scanner-permission-overlay">
      <div className="permission-error-view">
        <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <Camera className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-bold mt-4">لا يوجد إذن للكاميرا</h3>
        
        <p className="text-muted-foreground mb-4">
          المطلوب إذن الكاميرا لتمكين مسح الباركود. يستخدم التطبيق الكاميرا فقط لقراءة الباركود.
        </p>
        
        <div className="space-y-2 mt-4">
          <Button 
            onClick={handleRequestPermission}
            className="w-full"
            variant="default"
          >
            <Camera className="h-4 w-4 ml-2" />
            طلب إذن الكاميرا
          </Button>
          
          <Button 
            onClick={onClose}
            className="w-full"
            variant="secondary"
          >
            <Settings className="h-4 w-4 ml-2" />
            فتح إعدادات التطبيق
          </Button>
          
          {onManualEntry && (
            <Button 
              onClick={onManualEntry}
              className="w-full"
              variant="secondary"
            >
              <Keyboard className="h-4 w-4 ml-2" />
              إدخال الكود يدويًا
            </Button>
          )}
          
          <Button 
            onClick={onClose}
            className="w-full"
            variant="outline"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};
