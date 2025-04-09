
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FormActionsProps {
  isSubmitting: boolean;
  submitText: string;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, submitText }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/restaurants')}
        className="ml-2"
      >
        إلغاء
      </Button>
      <Button 
        type="submit"
        className="bg-fvm-primary hover:bg-fvm-primary-light"
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري الحفظ..." : submitText}
      </Button>
    </div>
  );
};

export default FormActions;
