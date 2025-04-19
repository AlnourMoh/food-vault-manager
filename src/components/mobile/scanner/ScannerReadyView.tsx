
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Check, Keyboard } from 'lucide-react';

interface ScannerReadyViewProps {
  lastScannedCode: string | null;
  onStartScan: () => void;
  onClose: () => void;
  onManualEntry?: () => void;
}

export const ScannerReadyView = ({ 
  lastScannedCode, 
  onStartScan, 
  onClose,
  onManualEntry 
}: ScannerReadyViewProps) => {
  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center h-60">
        {lastScannedCode ? (
          <>
            <div className="mb-4 p-3 bg-primary/10 rounded-full">
              <Check className="text-primary h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">تم المسح بنجاح</h3>
            <p className="text-center text-muted-foreground mb-4 direction-ltr">
              {lastScannedCode}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>إغلاق</Button>
              <Button variant="default" onClick={onStartScan}>مسح آخر</Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 p-3 bg-primary/10 rounded-full">
              <Camera className="text-primary h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">ماسح الباركود</h3>
            <p className="text-center text-muted-foreground mb-4">
              قم بتوجيه الكاميرا إلى باركود المنتج لمسحه
            </p>
            <div className="flex flex-col w-full space-y-2">
              <Button variant="default" onClick={onStartScan} className="w-full">
                <Camera className="h-4 w-4 ml-2" />
                بدء المسح
              </Button>
              
              {onManualEntry && (
                <Button 
                  variant="secondary" 
                  onClick={onManualEntry}
                  className="w-full"
                >
                  <Keyboard className="h-4 w-4 ml-2" />
                  إدخال الكود يدويًا
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose} className="w-full">
                إلغاء
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
