
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { restaurantFormSchema, RestaurantFormValues } from '@/validations/restaurantSchema';
import { parsePhoneNumber, formatPhoneNumber } from './utils/phoneUtils';

// Import form field components
import RestaurantNameField from './form-fields/RestaurantNameField';
import ManagerField from './form-fields/ManagerField';
import AddressField from './form-fields/AddressField';
import PhoneField from './form-fields/PhoneField';
import EmailField from './form-fields/EmailField';
import FormActions from './form-fields/FormActions';

// Define props interface for the form
export interface RestaurantFormProps {
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

  // Extract phone parts if initialData is provided
  const phoneParts = initialData?.phone ? parsePhoneNumber(initialData.phone) : { countryCode: '974', number: '' };
  
  console.log("Initial phone data:", initialData?.phone, "Parsed:", phoneParts);

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
      // Format phone number
      const fullPhoneNumber = formatPhoneNumber(values.phoneCountryCode, values.phoneNumber);
      
      console.log("Submitting form with values:", values);
      console.log("Formatted phone number:", fullPhoneNumber);
      
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
            <RestaurantNameField form={form} />
            
            {!initialData && (
              <ManagerField form={form} />
            )}
            
            <AddressField form={form} />
            <PhoneField form={form} />
            <EmailField 
              form={form} 
              readOnly={!!initialData}
              emailError={emailError}
            />
            
            <FormActions 
              isSubmitting={isSubmitting} 
              submitText={submitText} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RestaurantForm;
