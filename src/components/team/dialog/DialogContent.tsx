
import React from 'react';
import AddMemberForm from '../form/AddMemberForm';
import SuccessMessage from '../form/SuccessMessage';
import { FormValues } from '../form/AddMemberFormSchema';

interface DialogContentProps {
  showSuccessMessage: boolean;
  lastAddedMember: FormValues | null;
  welcomeMessage: string;
  onCopyMessage: (member: FormValues | null) => void;
  onAddMember: (data: FormValues) => Promise<boolean>;
  onCancel: () => void;
  onClose: () => void;
  onAddAnother: () => void;
  isLoading: boolean;
  phoneError: string | null;
  emailError: string | null;
}

const DialogContent: React.FC<DialogContentProps> = ({
  showSuccessMessage,
  lastAddedMember,
  welcomeMessage,
  onCopyMessage,
  onAddMember,
  onCancel,
  onClose,
  onAddAnother,
  isLoading,
  phoneError,
  emailError
}) => {
  if (showSuccessMessage && lastAddedMember) {
    return (
      <SuccessMessage 
        lastAddedMember={lastAddedMember}
        welcomeMessage={welcomeMessage}
        onCopyMessage={onCopyMessage}
        onClose={onClose}
        onAddAnother={onAddAnother}
      />
    );
  }

  return (
    <AddMemberForm 
      onSubmit={onAddMember} 
      onCancel={onCancel} 
      isLoading={isLoading}
      phoneError={phoneError}
      emailError={emailError}
    />
  );
};

export default DialogContent;
