
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CredentialActionButtonsProps {
  onOpenAccount: () => Promise<void>;
  isLoading: boolean;
}

const CredentialActionButtons = ({ onOpenAccount, isLoading }: CredentialActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 text-fvm-primary border-fvm-primary hover:bg-fvm-primary-light hover:text-white"
        onClick={onOpenAccount}
        disabled={isLoading}
      >
        <KeyRound className="h-4 w-4" />
        <span>فتح حساب المطعم</span>
      </Button>
      <Button 
        variant="outline" 
        onClick={() => navigate('/restaurants')}
        className="w-full"
      >
        العودة إلى قائمة المطاعم
      </Button>
    </>
  );
};

export default CredentialActionButtons;
