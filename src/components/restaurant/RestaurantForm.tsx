
import React, { useState } from 'react';
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

// Define props interface for the form
interface RestaurantFormProps {
  initialData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitText?: string;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitText = "إضافة المطعم"
}) => {
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Parse phone number to extract country code and number if initialData is provided
  const parsePhoneNumber = (phone: string) => {
    if (!phone) return { countryCode: '974', number: '' };

    // Check if the phone starts with + and has a country code
    if (phone.startsWith('+')) {
      // Extract country code (assuming it's between 1-4 digits after the +)
      const match = phone.match(/^\+(\d{1,4})(\d+)$/);
      if (match) {
        return {
          countryCode: match[1],
          number: match[2]
        };
      }
    }

    // Default to Qatar country code if no valid format is found
    return { countryCode: '974', number: phone };
  };

  // Extract phone parts if initialData is provided
  const phoneParts = initialData?.phone ? parsePhoneNumber(initialData.phone) : { countryCode: '974', number: '' };

  // Initialize form
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      manager: '', // Not used in editing for now
      address: initialData?.address || '',
      phoneCountryCode: phoneParts.countryCode,
      phoneNumber: phoneParts.number,
      email: initialData?.email || '',
    },
  });

  const handleFormSubmit = async (values: RestaurantFormValues) => {
    setEmailError(null); // Reset email error on new submission
    
    try {
      // دمج مفتاح الدولة مع رقم الهاتف
      const fullPhoneNumber = `+${values.phoneCountryCode}${values.phoneNumber}`;
      
      // Call the provided onSubmit function
      await onSubmit({
        name: values.name,
        email: values.email,
        phone: fullPhoneNumber,
        address: values.address
      });
    } catch (error) {
      console.error("Error in form submission:", error);
      
      // Handle duplicate email error
      if (error instanceof Error && error.message === 'duplicate_email') {
        setEmailError('هذا البريد الإلكتروني مستخدم بالفعل. الرجاء استخدام بريد إلكتروني آخر.');
        form.setError('email', { 
          type: 'manual', 
          message: 'هذا البريد الإلكتروني مستخدم بالفعل' 
        });
      } else {
        // Only show general error toast if not a duplicate email error
        if (!emailError) {
          toast({
            variant: "destructive",
            title: "خطأ في العملية",
            description: "حدث خطأ أثناء محاولة حفظ البيانات. يرجى المحاولة مرة أخرى.",
          });
        }
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{initialData ? 'تعديل بيانات المطعم' : 'بيانات المطعم الجديد'}</CardTitle>
        <CardDescription>
          {initialData 
            ? 'قم بتعديل معلومات المطعم بشكل صحيح' 
            : 'أدخل معلومات المطعم بشكل صحيح لإضافته إلى النظام'}
        </CardDescription>
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
            
            {!initialData && (
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
            )}
            
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
                      readOnly={!!initialData} // Make email readonly in edit mode
                      className={initialData ? "bg-gray-100" : ""}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الحفظ..." : submitText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RestaurantForm;
