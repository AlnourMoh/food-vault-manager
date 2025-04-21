
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormData } from '../schemas/signupSchema';

interface EmailFieldProps {
  form: UseFormReturn<SignupFormData>;
  disabled?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({ form, disabled }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>البريد الإلكتروني</FormLabel>
          <FormControl>
            <Input 
              placeholder="أدخل البريد الإلكتروني" 
              {...field} 
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
