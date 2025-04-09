
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StorageTeamMember } from '@/types';
import EditMemberForm from './form/EditMemberForm';
import { EditMemberFormValues } from './form/EditMemberFormSchema';
import { extractPhoneInfo } from './utils/phoneUtils';

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: StorageTeamMember | null;
  onUpdateMember: (id: string, data: any) => void;
  isLoading: boolean;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onUpdateMember,
  isLoading
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: EditMemberFormValues) => {
    if (!member) return;
    
    setIsSubmitting(true);
    try {
      await onUpdateMember(member.id, data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل بيانات عضو الفريق</DialogTitle>
          <DialogDescription>
            قم بتعديل بيانات عضو فريق المخزن
          </DialogDescription>
        </DialogHeader>
        
        <EditMemberForm 
          member={member}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
