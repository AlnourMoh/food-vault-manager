
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/constants/countryCodes';
import { Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddMemberFormSchema';

interface PhoneNumberInputProps {
  form: UseFormReturn<FormValues>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ form }) => {
  return (
    <div className="flex space-x-3 rtl:space-x-reverse gap-2">
      <FormField
        control={form.control}
        name="phoneCountryCode"
        render={({ field }) => (
          <FormItem className="flex-shrink-0 w-1/3">
            <FormLabel>مفتاح الدولة</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="مفتاح الدولة" />
                </SelectTrigger>
              </FormControl>
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>رقم الهاتف</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="5xxxxxxx" 
                  type="tel" 
                  {...field} 
                  className="pl-8"
                />
                <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhoneNumberInput;
