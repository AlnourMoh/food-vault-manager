
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddMemberFormSchema';

interface RoleSelectorProps {
  form: UseFormReturn<FormValues>;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>المنصب / الدور</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="اختر المنصب" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="إدارة المخزن">إدارة المخزن</SelectItem>
              <SelectItem value="إدارة النظام">إدارة النظام</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoleSelector;
