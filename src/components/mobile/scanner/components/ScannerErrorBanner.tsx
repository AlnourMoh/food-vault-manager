
import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';

interface ScannerErrorBannerProps {
  message: string;
  subMessage?: string;
}

export const ScannerErrorBanner: React.FC<ScannerErrorBannerProps> = ({ 
  message, 
  subMessage 
}) => {
  // التحقق من البيئة الحالية
  const { isBrowserOnly } = useScannerEnvironment();
  
  // إذا لم نكن في متصفح، لا نعرض الخطأ
  if (!isBrowserOnly) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="font-medium">{message}</p>
      </div>
      {subMessage && (
        <p className="mt-1 mr-7 text-sm text-red-700">{subMessage}</p>
      )}
    </div>
  );
};

interface ScannerErrorCardProps {
  message: string;
  onRetry: () => void;
}

export const ScannerErrorCard: React.FC<ScannerErrorCardProps> = ({ 
  message, 
  onRetry 
}) => {
  // التحقق من البيئة الحالية
  const { isBrowserOnly, isNativePlatform, isInAppWebView } = useScannerEnvironment();
  
  // طباعة حالة البيئة للتشخيص
  console.log('[ScannerErrorCard] حالة البيئة:', {
    isBrowserOnly,
    isNativePlatform,
    isInAppWebView
  });

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow">
      <div className="p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {message}
        </h3>
        <p className="text-gray-600 mb-4">
          {isBrowserOnly ? 
            "الرجاء استخدام تطبيق الجوال للوصول إلى مزايا المسح الضوئي." : 
            "حدث خطأ في الماسح الضوئي. الرجاء المحاولة مرة أخرى."
          }
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onRetry}>
            {isBrowserOnly ? "تخطي" : "إعادة المحاولة"}
          </Button>
        </div>
      </div>
    </div>
  );
};
