
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormData } from '../schemas/signupSchema';

interface PasswordFieldsProps {
  form: UseFormReturn<SignupFormData>;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>كلمة المرور</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="أدخل كلمة المرور" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>تأكيد كلمة المرور</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="أدخل كلمة المرور مرة أخرى" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
