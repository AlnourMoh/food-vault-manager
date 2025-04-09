
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorsProps {
  phoneError: string | null;
  emailError: string | null;
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ phoneError, emailError }) => {
  if (!phoneError && !emailError) return null;
  
  return (
    <>
      {phoneError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{phoneError}</AlertDescription>
        </Alert>
      )}
      
      {emailError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{emailError}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ValidationErrors;
