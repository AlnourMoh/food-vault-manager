
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/constants/countryCodes';
import { Phone, Copy, Link, Mail } from 'lucide-react';

// تعريف مخطط التحقق من صحة البيانات
const formSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }),
  role: z.string().min(2, { message: 'الدور يجب أن يكون محدداً' }),
  phoneCountryCode: z.string().min(1, { message: 'يجب تحديد مفتاح الدولة' }),
  phoneNumber: z
    .string()
    .min(4, { message: 'رقم الهاتف يجب أن يكون 4 أرقام على الأقل' })
    .max(15, { message: 'رقم الهاتف يجب أن لا يتجاوز 15 رقماً' })
    .regex(/^\d+$/, { message: 'يجب أن يحتوي رقم الهاتف على أرقام فقط' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (data: FormValues) => void;
  isLoading: boolean;
  lastAddedMember: FormValues | null;
  onCopyWelcomeMessage: (member: FormValues | null) => void;
  welcomeMessage: string;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember,
  isLoading,
  lastAddedMember,
  onCopyWelcomeMessage,
  welcomeMessage,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: 'عضو فريق',
      phoneCountryCode: '974', // قطر كقيمة افتراضية
      phoneNumber: '',
      email: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = (data: FormValues) => {
    onAddMember(data);
  };

  // Reset the form when the dialog is closed
  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  // Show either the form or the success message with copy option
  const showSuccessMessage = lastAddedMember && !form.formState.isDirty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rtl sm:max-w-[500px]">
        {!showSuccessMessage ? (
          <>
            <DialogHeader>
              <DialogTitle>إضافة عضو جديد لفريق المخزن</DialogTitle>
              <DialogDescription>
                الرجاء إدخال بيانات عضو الفريق الجديد. سيتم إرسال بريد إلكتروني للعضو لإعداد كلمة المرور.
              </DialogDescription>
            </DialogHeader>

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
                      <FormControl>
                        <Input placeholder="مسؤول المخزن" {...field} />
                      </FormControl>
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
                    onClick={() => onOpenChange(false)}
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>تمت إضافة العضو بنجاح</DialogTitle>
              <DialogDescription>
                تم إضافة {lastAddedMember.name} كـ {lastAddedMember.role} بنجاح
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">رسالة الترحيب:</h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-line text-sm">
                  {welcomeMessage}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => onCopyWelcomeMessage(lastAddedMember)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>نسخ رسالة الترحيب</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    form.reset();
                    onOpenChange(false);
                  }}
                >
                  إغلاق
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  إضافة عضو آخر
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
