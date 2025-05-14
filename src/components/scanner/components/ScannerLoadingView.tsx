
import React from 'react';
import { Loader2 } from 'lucide-react';

const ScannerLoadingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="w-10 h-10 text-white animate-spin" />
      <p className="text-white mt-4">جاري تهيئة الماسح الضوئي...</p>
    </div>
  );
};

export default ScannerLoadingView;
