
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface EmailFieldProps {
  form: UseFormReturn<RestaurantFormValues>;
  readOnly?: boolean;
  emailError: string | null;
}

const EmailField: React.FC<EmailFieldProps> = ({ form, readOnly = false, emailError }) => {
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
              readOnly={readOnly} 
              className={readOnly ? "bg-gray-100" : ""}
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

export default EmailField;
