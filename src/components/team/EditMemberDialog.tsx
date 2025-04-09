
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StorageTeamMember } from '@/types';
import { extractPhoneInfo } from '@/components/restaurant/form/utils';

// Define the schema for editing a team member
const editMemberFormSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
  role: z.string().min(1, { message: "يرجى اختيار الدور" }),
  phoneCountryCode: z.string().min(1, { message: "يرجى اختيار رمز الدولة" }),
  phoneNumber: z.string().min(8, { message: "رقم الهاتف يجب أن يكون على الأقل 8 أرقام" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
});

type EditMemberFormValues = z.infer<typeof editMemberFormSchema>;

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: StorageTeamMember | null;
  onUpdateMember: (id: string, data: any) => void;
  isLoading: boolean;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onUpdateMember,
  isLoading
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values
  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      phoneCountryCode: "974",
      phoneNumber: "",
      email: "",
    },
  });
  
  // Update form values when member changes
  useEffect(() => {
    if (member) {
      const { countryCode, phoneNumber } = extractPhoneInfo(member.phone);
      
      form.reset({
        name: member.name,
        role: member.role,
        phoneCountryCode: countryCode,
        phoneNumber: phoneNumber,
        email: member.email,
      });
    }
  }, [member, form]);

  const handleSubmit = async (data: EditMemberFormValues) => {
    if (!member) return;
    
    setIsSubmitting(true);
    try {
      await onUpdateMember(member.id, data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل بيانات عضو الفريق</DialogTitle>
          <DialogDescription>
            قم بتعديل بيانات عضو فريق المخزن
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      <SelectItem value="manager">مدير المخزن</SelectItem>
                      <SelectItem value="team_member">عضو فريق</SelectItem>
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
                onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
