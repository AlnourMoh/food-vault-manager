
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StorageTeamMember } from '@/types';
import EditMemberForm from './form/EditMemberForm';
import { extractPhoneDetails } from './utils/phoneUtils';
import { FormValues } from './form/EditMemberFormSchema';

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: StorageTeamMember | null;
  onUpdateMember: (id: string, data: FormValues) => Promise<boolean>;
  isLoading: boolean;
  phoneError: string | null;
  emailError: string | null;
  onResetErrors: () => void;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onUpdateMember,
  isLoading,
  phoneError,
  emailError,
  onResetErrors
}) => {
  if (!member) return null;

  const { phoneCountryCode, phoneNumber } = extractPhoneDetails(member.phone || '');
  
  const defaultValues = {
    name: member.name,
    role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
    phoneCountryCode,
    phoneNumber,
    email: member.email,
  };

  const handleUpdateMember = async (data: FormValues) => {
    const success = await onUpdateMember(member.id, data);
    if (success) {
      onOpenChange(false);
    }
    return success;
  };

  const handleCancel = () => {
    onOpenChange(false);
    onResetErrors();
  };

  // إعادة تعيين أخطاء التحقق عند فتح أو إغلاق نافذة الحوار
  React.useEffect(() => {
    if (open) {
      onResetErrors();
    }
  }, [open, onResetErrors]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        onResetErrors();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="rtl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات عضو الفريق</DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات عضو الفريق {member.name}
          </DialogDescription>
        </DialogHeader>
        <EditMemberForm 
          onSubmit={handleUpdateMember}
          onCancel={handleCancel}
          isLoading={isLoading}
          defaultValues={defaultValues}
          phoneError={phoneError}
          emailError={emailError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
