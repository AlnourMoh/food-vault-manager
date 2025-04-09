
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { restaurantFormSchema, RestaurantFormValues } from '@/validations/restaurantSchema';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RestaurantBasicInfo from './form/RestaurantBasicInfo';
import PhoneNumberInput from './form/PhoneNumberInput';
import EmailInput from './form/EmailInput';
import FormActions from './form/FormActions';
import { extractPhoneInfo } from './form/utils';

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
  const [emailError, setEmailError] = useState<string | null>(null);

  // استخراج مفتاح الدولة ورقم الهاتف من الرقم الكامل إذا كان موجوداً
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
    setEmailError(null); // Reset email error on new submission
    
    try {
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
      }
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
            <RestaurantBasicInfo form={form} />
            <PhoneNumberInput form={form} />
            <EmailInput form={form} emailError={emailError} isEditMode={isEditMode} />
            <FormActions isSubmitting={isSubmitting} submitText={submitText} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RestaurantForm;
