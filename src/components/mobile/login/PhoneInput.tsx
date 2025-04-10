
import React from 'react';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/constants/countryCodes';

interface PhoneInputProps {
  phoneNumber: string;
  phoneCountryCode: string;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryCodeChange: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  phoneNumber, 
  phoneCountryCode, 
  onPhoneNumberChange, 
  onCountryCodeChange 
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Select
          value={phoneCountryCode}
          onValueChange={onCountryCodeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="مفتاح الدولة" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((code) => (
              <SelectItem key={code.value} value={code.value}>
                <span className="flex items-center gap-2">
                  <span>{code.flag}</span>
                  <span>{code.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Phone className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          placeholder="رقم الهاتف"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          className="pl-10"
          type="tel"
          dir="ltr"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
