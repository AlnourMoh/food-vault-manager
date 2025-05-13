
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Settings, X, AlertTriangle, Info } from 'lucide-react';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';

interface PermissionPromptProps {
  permissionError: string | null;
  handleRequestPermission: () => Promise<void>;
  handleOpenSettings: () => Promise<void>;
  handleManualEntry?: () => void;
  onClose: () => void;
}

export const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  permissionError,
  handleRequestPermission,
  handleOpenSettings,
  handleManualEntry,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const environment = useScannerEnvironment();
  
  const handleRequest = async () => {
    setIsLoading(true);
    await handleRequestPermission();
    setIsLoading(false);
  };

  const handleSettings = async () => {
    setIsLoading(true);
    await handleOpenSettings();
    setIsLoading(false);
  };

  // تخصيص الرسالة بناءً على بيئة التشغيل
  const getEnvSpecificInstructions = () => {
    if (environment.isNativePlatform) {
      if (environment.platformName === 'ios') {
        return 'اذهب إلى إعدادات جهازك > الخصوصية > الكاميرا وقم بتمكين الإذن لتطبيق مخزن الطعام';
      } else if (environment.platformName === 'android') {
        return 'اذهب إلى إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا وقم بتمكينها';
      }
    }
    return 'تأكد من منح إذن الكاميرا للتطبيق من إعدادات جهازك';
  };

  return (
    <div className="permission-prompt p-6 flex flex-col items-center">
      <div className="absolute top-4 right-4">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-amber-100 text-amber-700 p-3 rounded-full">
        <Camera className="h-8 w-8" />
      </div>
      
      <h3 className="text-xl font-bold mt-4">الكاميرا غير متاحة</h3>
      
      {permissionError ? (
        <div className="mt-2 bg-red-50 p-3 rounded-md border border-red-200">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{permissionError}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-2">
          يحتاج التطبيق إلى إذن استخدام الكاميرا للمسح الضوئي
        </p>
      )}
      
      <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-4 w-full">
        <div className="flex gap-2">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-sm">{getEnvSpecificInstructions()}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3 w-full">
        <Button 
          className="w-full" 
          onClick={handleRequest} 
          disabled={isLoading}
        >
          السماح بالوصول إلى الكاميرا
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleSettings}
          disabled={isLoading}
        >
          <Settings className="h-4 w-4 ml-2" />
          فتح إعدادات التطبيق
        </Button>
        
        {handleManualEntry && (
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={handleManualEntry}
          >
            إدخال الباركود يدويًا
          </Button>
        )}
      </div>
      
      {!environment.isNativePlatform && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md w-full">
          <p className="text-sm text-gray-600">
            <strong>ملاحظة:</strong> يبدو أنك تستخدم المتصفح وليس تطبيق الجوال. بعض ميزات المسح قد لا تعمل بشكل صحيح في المتصفح.
          </p>
        </div>
      )}
      
      <div className="mt-4">
        <button 
          className="text-xs text-blue-500 underline"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? "إخفاء معلومات التشخيص" : "عرض معلومات التشخيص"}
        </button>
      </div>
      
      {showDebug && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs w-full overflow-auto max-h-40 dir-ltr">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(environment, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
