
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/constants/countryCodes';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface CountryCodeSelectorProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="phoneCountryCode"
      render={({ field }) => (
        <FormItem className="flex-shrink-0 w-1/3">
          <FormLabel>مفتاح الدولة</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
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
  );
};

export default CountryCodeSelector;
