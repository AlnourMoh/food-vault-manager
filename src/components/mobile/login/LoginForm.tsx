
import React from 'react';
import { Button } from '@/components/ui/button';
import IdentifierInput from './IdentifierInput';
import PasswordInput from './PasswordInput';
import { LoginStep } from '@/hooks/useTeamAuth';

interface LoginFormProps {
  identifier: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  isLoading: boolean;
  loginStep: LoginStep;
  setIdentifier: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleCheckIdentifier: () => void;
  handleLogin: () => void;
  handleSetupPassword: () => void;
  togglePasswordVisibility: () => void;
  goBackToIdentifier: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  identifier,
  password,
  confirmPassword,
  showPassword,
  isLoading,
  loginStep,
  setIdentifier,
  setPassword,
  setConfirmPassword,
  handleCheckIdentifier,
  handleLogin,
  handleSetupPassword,
  togglePasswordVisibility,
  goBackToIdentifier
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginStep === 'identifier') {
      handleCheckIdentifier();
    } else if (loginStep === 'password') {
      handleLogin();
    } else if (loginStep === 'setup') {
      handleSetupPassword();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginStep === 'identifier' && (
        <div className="space-y-2">
          <IdentifierInput
            identifier={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
      )}
      
      {loginStep !== 'identifier' && (
        <div className="space-y-2">
          <PasswordInput
            password={password}
            showPassword={showPassword}
            onChange={(e) => setPassword(e.target.value)}
            onToggleVisibility={togglePasswordVisibility}
          />
        </div>
      )}
      
      {loginStep === 'setup' && (
        <div className="space-y-2">
          <PasswordInput
            password={confirmPassword}
            showPassword={showPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onToggleVisibility={togglePasswordVisibility}
            placeholder="تأكيد كلمة المرور"
          />
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading 
          ? "جاري العملية..." 
          : loginStep === 'identifier'
            ? "التالي"
            : loginStep === 'setup'
              ? "إنشاء كلمة المرور"
              : "تسجيل الدخول"
        }
      </Button>
      
      {loginStep !== 'identifier' && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={goBackToIdentifier}
        >
          العودة
        </Button>
      )}
    </form>
  );
};

export default LoginForm;
