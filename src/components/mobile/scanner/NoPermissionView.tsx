
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, AlertCircle } from 'lucide-react';

interface NoPermissionViewProps {
  onClose: () => void;
  onRequestPermission?: () => void;
}

export const NoPermissionView = ({ onClose, onRequestPermission }: NoPermissionViewProps) => {
  const handleRequestPermission = () => {
    console.log('Request permission button clicked');
    if (onRequestPermission) {
      onRequestPermission();
    }
  };

  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-bold">لا يوجد إذن للكاميرا</h3>
        
        <p className="text-center text-muted-foreground">
          يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي
        </p>
        
        <div className="flex flex-col w-full space-y-2 mt-4">
          {onRequestPermission && (
            <Button 
              onClick={handleRequestPermission}
              className="w-full"
              variant="default"
            >
              طلب الإذن مجددًا
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </Card>
  );
};
