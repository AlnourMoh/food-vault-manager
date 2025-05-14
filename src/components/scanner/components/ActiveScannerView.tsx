
import React from 'react';

const ActiveScannerView: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-white/50 rounded-lg flex items-center justify-center">
          <div className="w-full h-px bg-red-500 animate-pulse" />
        </div>
      </div>
      <p className="absolute bottom-20 left-0 right-0 text-center text-white">
        قم بتوجيه الكاميرا نحو الباركود
      </p>
    </div>
  );
};

export default ActiveScannerView;
