
import React from 'react';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Mail className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={onChange}
        className="pl-10"
        type="email"
        dir="ltr"
      />
    </div>
  );
};

export default EmailInput;
