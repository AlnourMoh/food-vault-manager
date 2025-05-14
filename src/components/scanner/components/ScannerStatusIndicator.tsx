
import React from 'react';

interface ScannerStatusIndicatorProps {
  status: 'loading' | 'scanning' | 'error' | 'ready';
  message?: string;
}

const ScannerStatusIndicator: React.FC<ScannerStatusIndicatorProps> = ({ 
  status, 
  message 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-500/60';
      case 'scanning':
        return 'bg-green-500/60';
      case 'error':
        return 'bg-red-500/60';
      case 'ready':
        return 'bg-yellow-500/60';
      default:
        return 'bg-gray-500/60';
    }
  };

  const getDefaultMessage = () => {
    switch (status) {
      case 'loading':
        return 'جاري تهيئة الماسح الضوئي...';
      case 'scanning':
        return 'جاري المسح...';
      case 'error':
        return 'حدث خطأ في المسح';
      case 'ready':
        return 'الماسح جاهز';
      default:
        return '';
    }
  };

  return (
    <div className={`px-4 py-2 rounded-full backdrop-blur-sm ${getStatusStyles()}`}>
      <p className="text-white text-sm font-medium">
        {message || getDefaultMessage()}
      </p>
    </div>
  );
};

export default ScannerStatusIndicator;
