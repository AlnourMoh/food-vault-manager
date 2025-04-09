
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { FormValues } from './AddMemberFormSchema';

interface SuccessMessageProps {
  lastAddedMember: FormValues;
  welcomeMessage: string;
  onCopyMessage: (member: FormValues) => void;
  onClose: () => void;
  onAddAnother: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  lastAddedMember,
  welcomeMessage,
  onCopyMessage,
  onClose,
  onAddAnother
}) => {
  return (
    <div className="mt-4">
      <div className="mb-4">
        <h3 className="text-base font-medium mb-2">رسالة الترحيب:</h3>
        <div className="bg-muted p-4 rounded-md whitespace-pre-line text-sm">
          {welcomeMessage}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={() => onCopyMessage(lastAddedMember)}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>نسخ رسالة الترحيب</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          إغلاق
        </Button>
        
        <Button 
          variant="secondary"
          onClick={onAddAnother}
        >
          إضافة عضو آخر
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
