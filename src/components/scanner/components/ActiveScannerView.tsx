
import React from 'react';

const ActiveScannerView: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* منطقة المسح */}
      <div className="relative w-4/5 aspect-square max-w-sm">
        {/* إطار المسح */}
        <div className="absolute inset-0 border-2 border-white rounded-lg"></div>
        
        {/* زوايا الإطار */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
        
        {/* خط المسح المتحرك */}
        <div className="absolute left-0 w-full h-0.5 bg-primary animate-scanner-line"></div>
      </div>
      
      {/* رسالة إرشادية */}
      <div className="absolute bottom-16 left-0 right-0 text-white text-center px-4">
        <p className="text-lg font-medium">وجّه الكاميرا نحو الباركود</p>
        <p className="text-sm opacity-70">سيتم المسح تلقائيًا عند اكتشاف الرمز</p>
      </div>
    </div>
  );
};

export default ActiveScannerView;
