
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, X, Settings, RefreshCw } from 'lucide-react';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';

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
      
      // عرض رسالة للمستخدم
      toast({
        title: "جاري طلب الإذن",
        description: "يرجى السماح باستخدام الكاميرا عند ظهور النافذة"
      });
      
      // طلب الإذن
      const granted = await onRequestPermission();
      
      if (!granted) {
        // زيادة عداد المحاولات الفاشلة
        setFailedAttempts(prev => prev + 1);
        
        // عرض رسالة مناسبة بناءً على عدد المحاولات
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
      } else {
        toast({
          title: "تم منح الإذن",
          description: "يمكنك الآن استخدام الماسح الضوئي"
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
  
  // تحديد نوع الجهاز والمنصة
  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <Card className="p-4 m-4 bg-background max-w-md w-full">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Camera className="h-8 w-8" />
          </div>
          
          <h3 className="text-xl font-bold text-center">فشل تفعيل الكاميرا</h3>
          <h4 className="text-lg font-medium text-red-600 text-center">لم يتم منح إذن الوصول للكاميرا</h4>
          
          <p className="text-center text-muted-foreground">
            يرجى السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي للباركود
          </p>
          
          <div className="flex flex-col w-full space-y-2">
            <Button 
              onClick={handleRequestPermission}
              className="w-full"
              variant="default"
              disabled={isRequesting}
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${isRequesting ? 'animate-spin' : ''}`} />
              {isRequesting ? 'جاري طلب الإذن...' : 'محاولة مجددًا'}
            </Button>
            
            <Button 
              onClick={handleOpenSettings}
              className="w-full"
              variant="secondary"
            >
              <Settings className="h-4 w-4 ml-2" />
              فتح إعدادات الجهاز
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
          
          {/* تقديم إرشادات محددة بناءً على المنصة */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700 mt-4 w-full">
            <p className="font-medium">نصائح لتمكين الكاميرا:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {platform === 'ios' ? (
                <>
                  <li>افتح الإعدادات على جهازك</li>
                  <li>انتقل إلى الخصوصية والأمان &gt; الكاميرا</li>
                  <li>ابحث عن التطبيق وقم بتمكين الوصول للكاميرا</li>
                </>
              ) : platform === 'android' ? (
                <>
                  <li>افتح الإعدادات على جهازك</li>
                  <li>انتقل إلى التطبيقات &gt; مخزن الطعام &gt; الأذونات</li>
                  <li>قم بتمكين إذن الكاميرا</li>
                </>
              ) : (
                <>
                  <li>انقر على أيقونة القفل/معلومات بجوار عنوان URL</li>
                  <li>اختر 'أذونات الموقع' أو 'الإعدادات'</li>
                  <li>قم بتمكين إذن الكاميرا</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
