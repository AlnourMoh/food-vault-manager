
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
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { toast } = useToast();
  
  const handleRequestPermission = async () => {
    try {
      setIsRequesting(true);
      const granted = await onRequestPermission();
      
      if (!granted) {
        setFailedAttempts(prev => prev + 1);
        if (failedAttempts >= 1) {
          toast({
            title: "تم رفض الإذن عدة مرات",
            description: "يبدو أنك بحاجة لتمكين إذن الكاميرا من إعدادات جهازك",
            variant: "destructive"
          });
        } else {
          toast({
            title: "تم رفض الإذن",
            description: "يرجى تمكين إذن الكاميرا للاستمرار",
            variant: "destructive"
          });
        }
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
        
        {failedAttempts > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700 mt-4 w-full">
            <p className="font-medium">نصيحة للمساعدة:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>تأكد من السماح بإذن الكاميرا في إعدادات التطبيق</li>
              <li>إذا كنت تستخدم iOS، افتح الإعدادات &gt; الخصوصية &gt; الكاميرا</li>
              <li>إذا كنت تستخدم Android، افتح الإعدادات &gt; التطبيقات &gt; التطبيق &gt; الأذونات</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
