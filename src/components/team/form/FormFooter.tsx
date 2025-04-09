
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FormFooterProps {
  onCancel: () => void;
  isLoading: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ onCancel, isLoading }) => {
  return (
    <DialogFooter className="mt-6 flex justify-between gap-2">
      <Button
        variant="outline"
        onClick={onCancel}
        type="button"
      >
        إلغاء
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'جاري الإضافة...' : 'إضافة العضو'}
      </Button>
    </DialogFooter>
  );
};

export default FormFooter;
