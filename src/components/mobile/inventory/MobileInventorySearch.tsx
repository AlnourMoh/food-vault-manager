
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MobileInventorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

const MobileInventorySearch: React.FC<MobileInventorySearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="ابحث عن منتج..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 w-full bg-gray-50"
      />
    </div>
  );
};

export default MobileInventorySearch;
