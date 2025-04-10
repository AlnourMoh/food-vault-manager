
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import LoginForm from './LoginForm';
import { IdentifierType, LoginStep } from '@/hooks/useTeamAuth';

interface LoginCardProps {
  identifierType: IdentifierType;
  setIdentifierType: (type: IdentifierType) => void;
  loginStep: LoginStep;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  isLoading: boolean;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setPhoneCountryCode: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleCheckIdentifier: () => void;
  handleLogin: () => void;
  handleSetupPassword: () => void;
  togglePasswordVisibility: () => void;
  goBackToIdentifier: () => void;
}

const LoginCard: React.FC<LoginCardProps> = (props) => {
  const { loginStep, identifierType } = props;
  
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          {loginStep === 'identifier' 
            ? "تسجيل الدخول" 
            : loginStep === 'setup' 
              ? "إنشاء كلمة المرور" 
              : "إدخال كلمة المرور"}
        </CardTitle>
        <CardDescription className="text-center">
          {loginStep === 'identifier' 
            ? identifierType === 'email' 
              ? "أدخل البريد الإلكتروني" 
              : "أدخل رقم الهاتف"
            : loginStep === 'setup' 
              ? "أنشئ كلمة مرور للدخول إلى النظام" 
              : "أدخل كلمة المرور الخاصة بك"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm {...props} />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
