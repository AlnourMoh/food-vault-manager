
import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Fixed import from button instead of card
import { Camera, Settings, Keyboard, RefreshCw, X } from 'lucide-react';
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
      console.log("NoPermissionView: محاولة طلب الإذن");
      const granted = await onRequestPermission();
      console.log("NoPermissionView: نتيجة طلب الإذن:", granted);
      return granted;
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
  
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center">
      {/* Red Error Banner */}
      <div className="bg-red-500 text-white w-full p-4 text-center shadow-md">
        <h2 className="font-bold text-xl">تم رفض الإذِن</h2>
        <p>يرجى تمكين إذن الكاميرا للاستمرار</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <h1 className="text-3xl font-bold mb-2">فشل تفعيل الكاميرا</h1>
        <h2 className="text-xl text-red-600 mb-6">لم يتم منح إذن الوصول للكاميرا</h2>
        
        <p className="text-center text-gray-700 mb-10">
          يرجى السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي للباركود
        </p>
        
        <div className="w-full space-y-3">
          <Button 
            onClick={handleRequestPermission}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 p-4 rounded-md flex items-center justify-center"
            disabled={isRequesting}
          >
            <RefreshCw className={`h-5 w-5 ml-2 ${isRequesting ? 'animate-spin' : ''}`} />
            {isRequesting ? 'جاري الطلب...' : 'محاولة مجددًا'}
          </Button>
          
          <Button 
            onClick={onClose}
            className="w-full bg-blue-100 text-blue-800 hover:bg-blue-200 p-4 rounded-md flex items-center justify-center"
          >
            <Settings className="h-5 w-5 ml-2" />
            فتح إعدادات الجهاز
          </Button>
          
          {onManualEntry && (
            <Button 
              onClick={onManualEntry}
              className="w-full bg-blue-100 text-blue-800 hover:bg-blue-200 p-4 rounded-md flex items-center justify-center"
            >
              <Keyboard className="h-5 w-5 ml-2" />
              إدخال الكود يدويًا
            </Button>
          )}
          
          <Button 
            onClick={onClose}
            className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 p-4 rounded-md flex items-center justify-center"
          >
            <X className="h-5 w-5 ml-2" />
            إغلاق
          </Button>
        </div>
        
        {/* Tips Box */}
        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-md p-4 w-full">
          <h3 className="font-bold text-amber-800 mb-2">نصائح لتمكين الكاميرا:</h3>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>انقر على أيقونة القفل/معلومات بجوار عنوان URL</li>
            <li>اختر "أذونات الموقع" أو "الإعدادات"</li>
            <li>قم بتمكين إذن الكاميرا</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
