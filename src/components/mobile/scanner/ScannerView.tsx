
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, AlertCircle, Keyboard } from 'lucide-react';

interface ScannerViewProps {
  onStop: () => void;
  hasPermissionError?: boolean;
  onRequestPermission?: () => void;
  onManualEntry?: () => void;
}

export const ScannerView = ({ 
  onStop, 
  hasPermissionError = false,
  onRequestPermission,
  onManualEntry
}: ScannerViewProps) => {
  const handleRequestPermission = () => {
    console.log('Request permission button clicked in ScannerView');
    if (onRequestPermission) {
      onRequestPermission();
    }
  };

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
            <Button 
              onClick={handleRequestPermission}
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
        
        <div className="absolute bottom-24 inset-x-0 flex justify-center">
          <Button 
            variant="secondary"
            size="lg" 
            className="rounded-full px-6"
            onClick={onManualEntry}
          >
            <Keyboard className="h-5 w-5 ml-2" />
            إدخال الكود يدويًا
          </Button>
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
