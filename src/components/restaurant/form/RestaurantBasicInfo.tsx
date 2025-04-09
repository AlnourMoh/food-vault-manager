
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface RestaurantBasicInfoProps {
  form: UseFormReturn<RestaurantFormValues>;
}

const RestaurantBasicInfo: React.FC<RestaurantBasicInfoProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};

export default RestaurantBasicInfo;
