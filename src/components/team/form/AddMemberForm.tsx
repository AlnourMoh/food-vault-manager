
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { formSchema, FormValues } from './AddMemberFormSchema';
import NameInput from './inputs/NameInput';
import RoleSelector from './inputs/RoleSelector';
import PhoneNumberInput from './inputs/PhoneNumberInput';
import EmailInput from './inputs/EmailInput';
import ValidationErrors from './ValidationErrors';
import FormFooter from './FormFooter';

interface AddMemberFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
  phoneError: string | null;
  emailError: string | null;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  phoneError,
  emailError
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

  // إعادة تعيين أخطاء API عند تغيير القيم في النموذج
  useEffect(() => {
    const subscription = form.watch(() => {
      // يمكن إضافة منطق إعادة تعيين أخطاء API هنا إذا لزم الأمر
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameInput form={form} />
        <RoleSelector form={form} />
        <PhoneNumberInput form={form} />
        
        {phoneError && <ValidationErrors phoneError={phoneError} emailError={null} />}
        
        <EmailInput form={form} />
        
        {emailError && <ValidationErrors phoneError={null} emailError={emailError} />}
        
        <FormFooter onCancel={onCancel} isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default AddMemberForm;
