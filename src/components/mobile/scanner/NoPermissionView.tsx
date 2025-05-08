
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, X, Settings } from 'lucide-react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { useToast } from '@/hooks/use-toast';

interface NoPermissionViewProps {
  onClose: () => void;
  onRequestPermission: () => Promise<boolean>;
  onManualEntry?: () => void;
}

export const NoPermissionView: React.FC<NoPermissionViewProps> = ({ 
  onClose, 
  onRequestPermission, 
  onManualEntry 
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();
  
  const handleRequestPermission = async () => {
    try {
      setIsRequesting(true);
      const granted = await onRequestPermission();
      
      if (!granted) {
        toast({
          title: "تم رفض الإذن",
          description: "يرجى تمكين إذن الكاميرا من إعدادات جهازك للاستمرار",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطأ في طلب الإذن:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };
  
  const handleOpenSettings = async () => {
    try {
      toast({
        title: "فتح الإعدادات",
        description: "جاري توجيهك إلى إعدادات التطبيق"
      });
      
      await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error('خطأ في فتح الإعدادات:', error);
      toast({
        title: "خطأ",
        description: "تعذر فتح إعدادات التطبيق",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <Camera className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-bold">لا يوجد إذن للكاميرا</h3>
        
        <p className="text-center text-muted-foreground">
          يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي
        </p>
        
        <div className="flex flex-col w-full space-y-2">
          <Button 
            onClick={handleRequestPermission}
            className="w-full"
            variant="default"
            disabled={isRequesting}
          >
            <Camera className="h-4 w-4 ml-2" />
            {isRequesting ? 'جاري طلب الإذن...' : 'طلب إذن الكاميرا'}
          </Button>
          
          <Button 
            onClick={handleOpenSettings}
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
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>
    </Card>
  );
};
