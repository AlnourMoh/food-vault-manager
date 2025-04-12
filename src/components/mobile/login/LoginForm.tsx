
import React from 'react';
import { Button } from '@/components/ui/button';
import EmailInput from './EmailInput';
import PhoneInput from './PhoneInput';
import PasswordInput from './PasswordInput';
import IdentifierTypeToggle from './IdentifierTypeToggle';
import { IdentifierType, LoginStep } from '@/hooks/team/auth/types';

interface LoginFormProps {
  identifierType: IdentifierType;
  setIdentifierType: (type: IdentifierType) => void;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  isLoading: boolean;
  loginStep: LoginStep;
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

const LoginForm: React.FC<LoginFormProps> = ({
  identifierType,
  setIdentifierType,
  email,
  phoneNumber,
  phoneCountryCode,
  password,
  confirmPassword,
  showPassword,
  isLoading,
  loginStep,
  setEmail,
  setPhoneNumber,
  setPhoneCountryCode,
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
  
  // Check if we have a stored identifier from previous setup
  const hasStoredIdentifier = React.useMemo(() => {
    return !!localStorage.getItem('teamMemberIdentifier');
  }, []);

  // Display the identifier that's being used in the password and setup steps
  const displayIdentifier = identifierType === 'email' 
    ? email 
    : `+${phoneCountryCode}${phoneNumber}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginStep === 'identifier' && (
        <>
          <IdentifierTypeToggle 
            identifierType={identifierType} 
            setIdentifierType={setIdentifierType} 
          />
          
          {identifierType === 'email' ? (
            <EmailInput
              email={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <PhoneInput
              phoneNumber={phoneNumber}
              phoneCountryCode={phoneCountryCode}
              onPhoneNumberChange={(e) => setPhoneNumber(e.target.value)}
              onCountryCodeChange={setPhoneCountryCode}
            />
          )}
        </>
      )}
      
      {loginStep !== 'identifier' && (
        <>
          <div className="text-center mb-4 text-sm text-gray-500">
            {displayIdentifier}
          </div>
          <div className="space-y-2">
            <PasswordInput
              password={password}
              showPassword={showPassword}
              onChange={(e) => setPassword(e.target.value)}
              onToggleVisibility={togglePasswordVisibility}
            />
          </div>
        </>
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
