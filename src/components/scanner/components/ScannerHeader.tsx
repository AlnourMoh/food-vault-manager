
import React from 'react';
import { X } from 'lucide-react';

interface ScannerHeaderProps {
  onClose: () => void;
}

const ScannerHeader: React.FC<ScannerHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 flex items-center justify-between bg-black bg-opacity-50">
      <button 
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white"
      >
        <X size={24} />
      </button>
      <div className="text-white text-lg font-medium">قارئ الباركود</div>
      <div className="w-10"></div> {/* عنصر فارغ للحفاظ على التوازن */}
    </div>
  );
};

export default ScannerHeader;
