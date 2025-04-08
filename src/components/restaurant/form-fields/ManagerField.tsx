
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface ManagerFieldProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const ManagerField: React.FC<ManagerFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="manager"
      render={({ field }) => (
        <FormItem>
          <FormLabel>اسم المدير</FormLabel>
          <FormControl>
            <Input placeholder="اسم المدير" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ManagerField;
