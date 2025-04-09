
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AddMemberForm from './form/AddMemberForm';
import SuccessMessage from './form/SuccessMessage';
import { FormValues } from './form/AddMemberFormSchema';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (data: FormValues) => void;
  isLoading: boolean;
  lastAddedMember: FormValues | null;
  onCopyWelcomeMessage: (member: FormValues | null) => void;
  welcomeMessage: string;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember,
  isLoading,
  lastAddedMember,
  onCopyWelcomeMessage,
  welcomeMessage,
}) => {
  const [formDirty, setFormDirty] = React.useState(false);
  const { toast } = useToast();

  const handleAddMember = (data: FormValues) => {
    onAddMember(data);
    setFormDirty(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormDirty(false);
    onOpenChange(false);
  };

  const handleAddAnother = () => {
    setFormDirty(true);
  };

  // Reset form dirty state when the dialog is closed
  React.useEffect(() => {
    if (!open) {
      setFormDirty(false);
    }
  }, [open]);

  // Show either the form or the success message with copy option
  const showSuccessMessage = lastAddedMember && !formDirty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rtl sm:max-w-[500px]">
        {!showSuccessMessage ? (
          <>
            <DialogHeader>
              <DialogTitle>إضافة عضو جديد لفريق المخزن</DialogTitle>
              <DialogDescription>
                الرجاء إدخال بيانات عضو الفريق الجديد. سيتم إرسال بريد إلكتروني للعضو لإعداد كلمة المرور.
              </DialogDescription>
            </DialogHeader>
            <AddMemberForm 
              onSubmit={handleAddMember} 
              onCancel={handleCancel} 
              isLoading={isLoading} 
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>تمت إضافة العضو بنجاح</DialogTitle>
              <DialogDescription>
                تم إضافة {lastAddedMember.name} كـ {lastAddedMember.role} بنجاح
              </DialogDescription>
            </DialogHeader>
            <SuccessMessage 
              lastAddedMember={lastAddedMember}
              welcomeMessage={welcomeMessage}
              onCopyMessage={onCopyWelcomeMessage}
              onClose={handleClose}
              onAddAnother={handleAddAnother}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
