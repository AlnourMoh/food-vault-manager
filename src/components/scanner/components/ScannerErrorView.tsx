
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

interface ScannerErrorViewProps {
  onRetry: () => Promise<void>;
  onClose: () => void;
}

const ScannerErrorView: React.FC<ScannerErrorViewProps> = ({ onRetry, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* زر إغلاق في الأعلى */}
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 text-white p-2" 
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      
      {/* رمز الخطأ */}
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <X className="h-10 w-10 text-red-500" />
      </div>
      
      {/* رسالة الخطأ */}
      <h3 className="text-white text-xl mb-2">حدث خطأ</h3>
      <p className="text-white/70 text-center mb-8">
        تعذر تهيئة الماسح الضوئي. يرجى التحقق من إذن الكاميرا والمحاولة مرة أخرى.
      </p>
      
      {/* زر إعادة المحاولة */}
      <Button onClick={() => onRetry()} className="mb-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        إعادة المحاولة
      </Button>
      
      {/* زر الإلغاء */}
      <Button variant="outline" onClick={onClose} className="text-white border-white/30">
        إلغاء
      </Button>
    </div>
  );
};

export default ScannerErrorView;
