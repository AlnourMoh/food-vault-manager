
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const ScannerLoadingView: React.FC = () => {
  return (
    <div className="text-center">
      <Spinner className="w-12 h-12 text-white mx-auto mb-4" />
      <p className="text-white">جاري تهيئة الماسح...</p>
    </div>
  );
};

export default ScannerLoadingView;
