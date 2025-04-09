
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { countryCodes } from '@/constants/countryCodes';
import { restaurantFormSchema, RestaurantFormValues } from '@/validations/restaurantSchema';
import { createRestaurant } from '@/services/restaurantService';

interface RestaurantFormProps {
  initialData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    manager?: string;
  };
  onSubmit: (values: RestaurantFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitText?: string;
  isEditMode?: boolean;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting = false, 
  submitText = "إضافة المطعم",
  isEditMode = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // استخراج مفتاح الدولة ورقم الهاتف من الرقم الكامل إذا كان موجوداً
  const extractPhoneInfo = (phone: string | undefined) => {
    if (!phone) return { countryCode: '974', phoneNumber: '' };
    
    // تحقق ما إذا كان الرقم يبدأ ب +
    if (phone.startsWith('+')) {
      // البحث عن مفتاح الدولة المطابق
      for (const code of countryCodes) {
        if (phone.startsWith(`+${code.value}`)) {
          return {
            countryCode: code.value,
            phoneNumber: phone.substring(code.value.length + 1) // +1 للإشارة +
          };
        }
      }
    }
    
    // إذا لم يتم العثور على مفتاح دولة، استخدم القيمة الافتراضية
    return { countryCode: '974', phoneNumber: phone };
  };

  const { countryCode, phoneNumber } = initialData?.phone 
    ? extractPhoneInfo(initialData.phone) 
    : { countryCode: '974', phoneNumber: '' };

  console.log('Initial data:', initialData);
  console.log('Extracted phone info:', { countryCode, phoneNumber });

  // Initialize form
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      manager: initialData?.manager || '',
      address: initialData?.address || '',
      phoneCountryCode: countryCode,
      phoneNumber: phoneNumber,
      email: initialData?.email || '',
    },
  });

  // تحديث قيم النموذج عند تغيير البيانات الأولية
  useEffect(() => {
    if (initialData) {
      const { countryCode, phoneNumber } = extractPhoneInfo(initialData.phone);
      
      form.reset({
        name: initialData.name || '',
        manager: initialData.manager || '',
        address: initialData.address || '',
        phoneCountryCode: countryCode,
        phoneNumber: phoneNumber,
        email: initialData.email || '',
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = async (values: RestaurantFormValues) => {
    setIsLoading(true);
    setEmailError(null); // Reset email error on new submission
    
    try {
      // دمج مفتاح الدولة مع رقم الهاتف
      const fullPhoneNumber = `+${values.phoneCountryCode}${values.phoneNumber}`;
      
      // استبدال قيم الهاتف في النموذج بالرقم الكامل
      const formData = {
        ...values,
        phoneNumber: fullPhoneNumber,
      };
      
      // استدعاء وظيفة التقديم المرسلة من الأب
      await onSubmit(values);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Handle duplicate email error
      if (error instanceof Error && error.message === 'duplicate_email') {
        setEmailError('هذا البريد الإلكتروني مستخدم بالفعل. الرجاء استخدام بريد إلكتروني آخر.');
        form.setError('email', { 
          type: 'manual', 
          message: 'هذا البريد الإلكتروني مستخدم بالفعل' 
        });
      } else {
        // Only show general error toast if not a duplicate email error
        toast({
          variant: "destructive",
          title: isEditMode ? "خطأ في تحديث المطعم" : "خطأ في إضافة المطعم",
          description: "حدث خطأ أثناء المحاولة. يرجى المحاولة مرة أخرى.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{isEditMode ? "تعديل بيانات المطعم" : "بيانات المطعم الجديد"}</CardTitle>
        <CardDescription>أدخل معلومات المطعم بشكل صحيح {isEditMode ? "لتحديثها" : "لإضافته إلى النظام"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                      <Input placeholder="رقم هاتف المطعم" {...field} />
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
                    <Input 
                      type="email" 
                      placeholder="البريد الإلكتروني للمطعم" 
                      {...field} 
                      disabled={isEditMode} // تعطيل حقل البريد الإلكتروني في وضع التعديل
                    />
                  </FormControl>
                  <FormMessage />
                  {emailError && (
                    <p className="text-sm font-medium text-destructive mt-1">{emailError}</p>
                  )}
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/restaurants')}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                type="submit"
                className="bg-fvm-primary hover:bg-fvm-primary-light"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "جاري الحفظ..." : submitText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RestaurantForm;
