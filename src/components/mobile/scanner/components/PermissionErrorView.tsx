
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, X } from 'lucide-react';

interface PermissionErrorViewProps {
  onRequestPermission: () => void;
  onManualEntry?: () => void;
  onStop: () => void;
}

export const PermissionErrorView = ({ 
  onRequestPermission, 
  onManualEntry, 
  onStop 
}: PermissionErrorViewProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
      <div className="text-center p-6 max-w-md space-y-4">
        <div className="mx-auto bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
          <Camera className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold">لا يوجد إذن للكاميرا</h2>
        <p className="text-muted-foreground mb-4">
          يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي
        </p>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={onRequestPermission}
            className="w-full"
            variant="default"
          >
            <Camera className="h-4 w-4 ml-2" />
            طلب الإذن مجددًا
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
            onClick={onStop}
            className="w-full"
            variant="outline"
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};
