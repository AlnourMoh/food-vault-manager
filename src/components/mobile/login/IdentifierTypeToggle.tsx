
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { IdentifierType } from '@/hooks/useTeamAuth';

interface IdentifierTypeToggleProps {
  identifierType: IdentifierType;
  setIdentifierType: (type: IdentifierType) => void;
}

const IdentifierTypeToggle: React.FC<IdentifierTypeToggleProps> = ({ 
  identifierType, 
  setIdentifierType 
}) => {
  return (
    <div className="flex w-full mb-4 rounded-md overflow-hidden border">
      <Button
        type="button"
        variant={identifierType === 'email' ? 'default' : 'outline'}
        className={`flex-1 rounded-none gap-2 ${identifierType === 'email' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={() => setIdentifierType('email')}
      >
        <Mail className="h-4 w-4" />
        <span>البريد الإلكتروني</span>
      </Button>
      <Button
        type="button"
        variant={identifierType === 'phone' ? 'default' : 'outline'}
        className={`flex-1 rounded-none gap-2 ${identifierType === 'phone' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={() => setIdentifierType('phone')}
      >
        <Phone className="h-4 w-4" />
        <span>رقم الهاتف</span>
      </Button>
    </div>
  );
};

export default IdentifierTypeToggle;
