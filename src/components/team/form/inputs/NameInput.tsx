
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddMemberFormSchema';

interface NameInputProps {
  form: UseFormReturn<FormValues>;
}

const NameInput: React.FC<NameInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>الاسم الكامل</FormLabel>
          <FormControl>
            <Input placeholder="محمد أحمد" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NameInput;
