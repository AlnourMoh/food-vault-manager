
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface EmailInputProps {
  form: UseFormReturn<RestaurantFormValues>;
  emailError: string | null;
  isEditMode?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ form, emailError, isEditMode = false }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>البريد الإلكتروني</FormLabel>
          <FormControl>
            <Input 
              type="email" 
              placeholder="البريد الإلكتروني للمطعم" 
              {...field} 
              disabled={isEditMode} // تعطيل حقل البريد الإلكتروني في وضع التعديل
            />
          </FormControl>
          <FormMessage />
          {emailError && (
            <p className="text-sm font-medium text-destructive mt-1">{emailError}</p>
          )}
        </FormItem>
      )}
    />
  );
};

export default EmailInput;
