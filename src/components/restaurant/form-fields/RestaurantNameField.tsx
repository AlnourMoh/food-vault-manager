
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface RestaurantNameFieldProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const RestaurantNameField: React.FC<RestaurantNameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>اسم المطعم</FormLabel>
          <FormControl>
            <Input placeholder="اسم المطعم" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RestaurantNameField;
