
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';
import { countryCodes } from '@/constants/countryCodes';

interface PhoneFieldProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ form }) => {
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
              <Input placeholder="رقم هاتف المطعم" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhoneField;
