
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/constants/countryCodes';
import { Phone, Mail } from 'lucide-react';
import { formSchema, FormValues } from './AddMemberFormSchema';
import { DialogFooter } from '@/components/ui/dialog';

interface AddMemberFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({
  onSubmit,
  onCancel,
  isLoading
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: 'إدارة المخزن',
      phoneCountryCode: '974', // قطر كقيمة افتراضية
      phoneNumber: '',
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="5xxxxxxx" 
                      type="tel" 
                      {...field} 
                      className="pl-8"
                    />
                    <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="example@domain.com"
                    type="email"
                    {...field}
                    className="pl-8"
                  />
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="mt-6 flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'جاري الإضافة...' : 'إضافة العضو'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddMemberForm;
