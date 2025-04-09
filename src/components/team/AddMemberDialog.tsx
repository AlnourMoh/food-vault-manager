
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
  const [formDirty, setFormDirty] = React.useState(false);
  const { toast } = useToast();

  const handleAddMember = async (data: FormValues) => {
    const success = await onAddMember(data);
    if (success) {
      setFormDirty(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    onResetErrors();
  };

  const handleClose = () => {
    setFormDirty(false);
    onOpenChange(false);
    onResetErrors();
  };

  const handleAddAnother = () => {
    setFormDirty(true);
    onResetErrors();
  };

  // إعادة تعيين حالة النموذج وأخطاء التحقق عند إغلاق نافذة الحوار
  React.useEffect(() => {
    if (!open) {
      setFormDirty(false);
      onResetErrors();
    }
  }, [open, onResetErrors]);

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
              phoneError={phoneError}
              emailError={emailError}
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
