
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface AddressFieldProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const AddressField: React.FC<AddressFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>العنوان</FormLabel>
          <FormControl>
            <Input placeholder="عنوان المطعم" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressField;
