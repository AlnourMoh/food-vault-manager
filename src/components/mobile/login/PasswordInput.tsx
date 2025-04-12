
import React from 'react';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  password: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  showPassword,
  onChange,
  onToggleVisibility,
  placeholder = "كلمة المرور"
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Lock className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={password}
        onChange={onChange}
        className="pl-10 pr-10"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          type="button"
          onClick={onToggleVisibility}
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
