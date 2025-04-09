
import React from 'react';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { FormValues } from './form/AddMemberFormSchema';
import DialogHeader from './dialog/DialogHeader';
import DialogContentComponent from './dialog/DialogContent';
import { useDialogState } from './dialog/useDialogState';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (data: FormValues) => Promise<boolean>;
  isLoading: boolean;
  lastAddedMember: FormValues | null;
  onCopyWelcomeMessage: (member: FormValues | null) => void;
  welcomeMessage: string;
  phoneError: string | null;
  emailError: string | null;
  onResetErrors: () => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember,
  isLoading,
  lastAddedMember,
  onCopyWelcomeMessage,
  welcomeMessage,
  phoneError,
  emailError,
  onResetErrors,
}) => {
  const { formDirty, handleSuccess, handleAddAnother } = useDialogState(open, onResetErrors);

  const handleAddMember = async (data: FormValues) => {
    const success = await onAddMember(data);
    if (success) {
      handleSuccess();
    }
    return success;
  };

  const handleCancel = () => {
    onOpenChange(false);
    onResetErrors();
  };

  const handleClose = () => {
    handleSuccess();
    onOpenChange(false);
    onResetErrors();
  };

  // عرض إما النموذج أو رسالة النجاح مع خيار النسخ
  const showSuccessMessage = lastAddedMember && !formDirty;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        onResetErrors();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="rtl sm:max-w-[500px]">
        <DialogHeader 
          showSuccessMessage={showSuccessMessage} 
          lastAddedMember={lastAddedMember} 
        />
        <DialogContentComponent 
          showSuccessMessage={showSuccessMessage}
          lastAddedMember={lastAddedMember}
          welcomeMessage={welcomeMessage}
          onCopyMessage={onCopyWelcomeMessage}
          onAddMember={handleAddMember}
          onCancel={handleCancel}
          onClose={handleClose}
          onAddAnother={handleAddAnother}
          isLoading={isLoading}
          phoneError={phoneError}
          emailError={emailError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
