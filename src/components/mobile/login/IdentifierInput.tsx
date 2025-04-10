
import React from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Phone } from 'lucide-react';

interface IdentifierInputProps {
  identifier: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentifierInput: React.FC<IdentifierInputProps> = ({ identifier, onChange }) => {
  const IconComponent = identifier.includes('@') ? Mail : Phone;
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <IconComponent className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        placeholder="البريد الإلكتروني أو رقم الهاتف"
        value={identifier}
        onChange={onChange}
        className="pl-10"
      />
    </div>
  );
};

export default IdentifierInput;
