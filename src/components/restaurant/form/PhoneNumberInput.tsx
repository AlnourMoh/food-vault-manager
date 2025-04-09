
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';
import CountryCodeSelector from './CountryCodeSelector';

interface PhoneNumberInputProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ form }) => {
  return (
    <div className="flex space-x-3 rtl:space-x-reverse gap-2">
      <CountryCodeSelector form={form} />
      
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>رقم الهاتف</FormLabel>
            <FormControl>
              <Input placeholder="رقم هاتف المطعم" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhoneNumberInput;
