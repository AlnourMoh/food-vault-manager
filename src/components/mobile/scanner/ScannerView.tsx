
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, AlertCircle } from 'lucide-react';

interface ScannerViewProps {
  onStop: () => void;
  hasPermissionError?: boolean;
  onRequestPermission?: () => void;
}

export const ScannerView = ({ 
  onStop, 
  hasPermissionError = false,
  onRequestPermission
}: ScannerViewProps) => {
  if (hasPermissionError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md space-y-4">
          <div className="mx-auto bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">لا يوجد إذن للكاميرا</h2>
          <p className="text-muted-foreground mb-4">
            يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي
          </p>
          <div className="flex flex-col space-y-2">
            {onRequestPermission && (
              <Button 
                onClick={onRequestPermission}
                className="w-full"
                variant="default"
              >
                طلب الإذن مجددًا
              </Button>
            )}
            <Button 
              onClick={onStop}
              className="w-full"
              variant="outline"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-black bg-opacity-50">
      <div className="flex-1 w-full relative flex items-center justify-center">
        <div className="w-72 h-72 border-4 border-primary rounded-lg scanner-target-frame flex items-center justify-center">
          <div className="text-white text-center px-4">
            <p className="mb-2 font-bold">قم بتوجيه الكاميرا نحو الباركود</p>
            <p className="text-sm opacity-80">يتم المسح تلقائيًا عند اكتشاف رمز</p>
          </div>
        </div>
        
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full h-16 w-16 flex items-center justify-center"
            onClick={onStop}
          >
            <X className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};
