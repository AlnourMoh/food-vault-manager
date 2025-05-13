
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { PlatformService } from '@/services/scanner/PlatformService';

interface BrowserViewProps {
  onClose: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose }) => {
  // التحقق مما إذا كنا في متصفح أم في تطبيق جوال
  const isBrowserOnly = PlatformService.isBrowserEnvironment();
  
  // إذا كنا في تطبيق جوال، لا نعرض هذه الرسالة
  if (!isBrowserOnly) {
    return null;
  }
  
  return (
    <div className="p-6 rounded-lg border border-red-200 bg-white text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        المسح غير متاح في المتصفح
      </h3>
      
      <p className="text-gray-600 mb-4">
        يرجى استخدام تطبيق الهاتف المحمول للوصول إلى ميزات المسح الضوئي.
      </p>
      
      <div className="flex justify-center">
        <Button onClick={onClose} variant="outline">
          عودة
        </Button>
      </div>
    </div>
  );
};
