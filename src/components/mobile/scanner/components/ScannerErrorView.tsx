
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

interface ScannerErrorViewProps {
  onRetry: () => void;
  onClose: () => void;
  errorMessage?: string;
}

export const ScannerErrorView: React.FC<ScannerErrorViewProps> = ({ 
  onRetry, 
  onClose,
  errorMessage = "تعذر تهيئة الماسح الضوئي. يرجى التحقق من إذن الكاميرا والمحاولة مرة أخرى."
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* زر إغلاق في الأعلى */}
      <X 
        className="absolute top-4 left-4 text-white h-6 w-6 cursor-pointer" 
        onClick={onClose}
      />
      
      {/* رمز الخطأ */}
      <div className="w-24 h-24 rounded-full bg-red-900/80 flex items-center justify-center mb-6">
        <X className="h-16 w-16 text-red-500" />
      </div>
      
      {/* رسالة الخطأ */}
      <h3 className="text-white text-2xl mb-4 font-bold">حدث خطأ</h3>
      <p className="text-white/80 text-center mb-8 max-w-md px-4">
        {errorMessage}
      </p>
      
      {/* زر إعادة المحاولة */}
      <Button 
        onClick={onRetry} 
        size="lg"
        className="mb-4 px-8 py-6 text-lg flex items-center"
      >
        <RefreshCw className="h-5 w-5 ml-2" />
        إعادة المحاولة
      </Button>
      
      {/* زر الإلغاء */}
      <Button 
        variant="outline" 
        onClick={onClose} 
        className="text-white border-white/40 px-8"
      >
        إلغاء
      </Button>
    </div>
  );
};

export default ScannerErrorView;
