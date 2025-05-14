
import React from 'react';

interface ScannerFrameProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const ScannerFrame: React.FC<ScannerFrameProps> = ({ children, isLoading }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* إطار المسح */}
      <div className="w-4/5 aspect-video border-2 border-white rounded-lg relative overflow-hidden">
        {/* زوايا الإطار */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
        
        {/* خط المسح المتحرك */}
        {!isLoading && (
          <div className="absolute left-0 w-full h-0.5 bg-red-500 animate-scanner-line" />
        )}
        
        {children}
      </div>
    </div>
  );
};

export default ScannerFrame;
