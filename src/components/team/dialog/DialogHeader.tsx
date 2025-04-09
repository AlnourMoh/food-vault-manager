
import React from 'react';
import {
  DialogHeader as UIDialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { FormValues } from '../form/AddMemberFormSchema';

interface DialogHeaderProps {
  showSuccessMessage: boolean;
  lastAddedMember: FormValues | null;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ 
  showSuccessMessage,
  lastAddedMember
}) => {
  if (showSuccessMessage && lastAddedMember) {
    return (
      <UIDialogHeader>
        <DialogTitle>تمت إضافة العضو بنجاح</DialogTitle>
        <DialogDescription>
          تم إضافة {lastAddedMember.name} كـ {lastAddedMember.role} بنجاح
        </DialogDescription>
      </UIDialogHeader>
    );
  }

  return (
    <UIDialogHeader>
      <DialogTitle>إضافة عضو جديد لفريق المخزن</DialogTitle>
      <DialogDescription>
        الرجاء إدخال بيانات عضو الفريق الجديد. سيتم إرسال بريد إلكتروني للعضو لإعداد كلمة المرور.
      </DialogDescription>
    </UIDialogHeader>
  );
};

export default DialogHeader;
