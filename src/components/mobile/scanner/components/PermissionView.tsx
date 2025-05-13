
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PermissionViewProps {
  permissionError: boolean;
  handleRequestPermission: () => Promise<void>;
  handleOpenSettings: () => Promise<void>;
  handleManualEntry?: () => void;
  onClose: () => void;
}

export const PermissionView: React.FC<PermissionViewProps> = ({
  permissionError,
  handleRequestPermission,
  handleOpenSettings,
  handleManualEntry,
  onClose
}) => {
  return (
    <Card className="w-[90%] max-w-md mx-auto text-center">
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
        </CardTitle>
        <CardTitle className="text-xl">تصريح الكاميرا مطلوب</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-6">
          يحتاج التطبيق إلى إذن الوصول إلى الكاميرا لتمكين مسح الباركود. 
          يرجى منح الإذن للاستمرار.
        </p>
        
        {permissionError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">
            <p className="text-sm">
              تم رفض إذن الكاميرا. يرجى تمكينه من إعدادات جهازك لاستخدام الماسح الضوئي.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        {!permissionError ? (
          <Button className="w-full" onClick={handleRequestPermission}>
            منح إذن الكاميرا
          </Button>
        ) : (
          <Button className="w-full" onClick={handleOpenSettings}>
            <Settings className="ml-2 h-4 w-4" />
            فتح إعدادات التطبيق
          </Button>
        )}
        
        {handleManualEntry && (
          <Button variant="outline" className="w-full" onClick={handleManualEntry}>
            إدخال الرمز يدوياً
          </Button>
        )}
        
        <Button variant="ghost" className="w-full" onClick={onClose}>
          إلغاء
        </Button>
      </CardFooter>
    </Card>
  );
};
