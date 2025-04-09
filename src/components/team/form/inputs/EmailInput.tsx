
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddMemberFormSchema';

interface EmailInputProps {
  form: UseFormReturn<FormValues>;
}

const EmailInput: React.FC<EmailInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>البريد الإلكتروني</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="example@domain.com"
                type="email"
                {...field}
                className="pl-8"
              />
              <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailInput;
