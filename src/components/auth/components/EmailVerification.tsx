
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormData } from '../schemas/signupSchema';
import { EmailField } from './EmailField';

interface EmailVerificationProps {
  form: UseFormReturn<SignupFormData>;
  verifyingEmail: boolean;
  onVerifyEmail: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  form, 
  verifyingEmail, 
  onVerifyEmail 
}) => {
  return (
    <div className="space-y-4">
      <EmailField form={form} disabled={false} />
      
      <Button 
        type="button" 
        className="w-full"
        disabled={verifyingEmail}
        onClick={onVerifyEmail}
      >
        {verifyingEmail ? 'جاري التحقق...' : 'تحقق من البريد الإلكتروني'}
      </Button>
    </div>
  );
};
