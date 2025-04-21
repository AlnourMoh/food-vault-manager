
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormData } from '../schemas/signupSchema';
import { EmailField } from './EmailField';
import { PasswordFields } from './PasswordFields';

interface SignupFormProps {
  form: UseFormReturn<SignupFormData>;
  verifyingEmail: boolean;
  onSubmit: (data: SignupFormData) => Promise<void>;
}

export const SignupForm: React.FC<SignupFormProps> = ({ 
  form, 
  verifyingEmail, 
  onSubmit 
}) => {
  return (
    <div className="space-y-4">
      <EmailField form={form} disabled={true} />
      <PasswordFields form={form} />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={verifyingEmail}
        onClick={form.handleSubmit(onSubmit)}
      >
        تسجيل
      </Button>
    </div>
  );
};
