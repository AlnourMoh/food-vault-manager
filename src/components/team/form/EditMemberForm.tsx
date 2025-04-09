
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StorageTeamMember } from '@/types';
import { editMemberFormSchema, EditMemberFormValues } from './EditMemberFormSchema';

interface EditMemberFormProps {
  member: StorageTeamMember | null;
  onSubmit: (data: EditMemberFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

const EditMemberForm: React.FC<EditMemberFormProps> = ({
  member,
  onSubmit,
  onCancel,
  isSubmitting,
  isLoading
}) => {
  // Initialize the form with default values
  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberFormSchema),
    defaultValues: {
      name: member?.name || "",
      role: member?.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode: member?.phone?.substring(1, 4) || "974",
      phoneNumber: member?.phone?.substring(4) || "",
      email: member?.email || "",
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
              <FormLabel>اسم العضو</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم العضو" {...field} />
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
              <FormLabel>الدور</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر دور العضو" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="إدارة النظام">إدارة النظام</SelectItem>
                  <SelectItem value="إدارة المخزن">إدارة المخزن</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col space-y-2">
          <FormLabel>رقم الهاتف</FormLabel>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <FormField
              control={form.control}
              name="phoneCountryCode"
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormControl>
                    <Input placeholder="974" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="أدخل رقم الهاتف" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input 
                  placeholder="البريد الإلكتروني" 
                  type="email" 
                  dir="ltr"
                  className="text-left"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            إلغاء
          </Button>
          <Button 
            type="submit" 
            className="bg-fvm-primary hover:bg-fvm-primary-light"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditMemberForm;
