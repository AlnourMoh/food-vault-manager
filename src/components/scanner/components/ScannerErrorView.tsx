
import React from 'react';
import { Button } from '@/components/ui/button';

interface ScannerErrorViewProps {
  onRetry: () => void;
  onClose: () => void;
}

const ScannerErrorView: React.FC<ScannerErrorViewProps> = ({ onRetry, onClose }) => {
  return (
    <div className="p-6 bg-white rounded-lg max-w-sm mx-auto text-center">
      <h3 className="text-xl font-bold mb-2">حدث خطأ</h3>
      <p className="mb-4">تعذر تشغيل الماسح الضوئي. تأكد من منح الأذونات اللازمة.</p>
      <div className="flex gap-2 justify-center">
        <Button onClick={onRetry}>إعادة المحاولة</Button>
        <Button variant="outline" onClick={onClose}>إغلاق</Button>
      </div>
    </div>
  );
};

export default ScannerErrorView;
