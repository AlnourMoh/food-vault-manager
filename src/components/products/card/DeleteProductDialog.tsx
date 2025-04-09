
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  isDeleting: boolean;
  onConfirmDelete: () => void;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  onOpenChange,
  productName,
  isDeleting,
  onConfirmDelete
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف المنتج "{productName}" من قائمة المخزون الخاص بك.
            هذا الإجراء لا يمكن التراجع عنه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse space-x-reverse space-x-2">
          <AlertDialogCancel className="order-2">إلغاء</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 order-1"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'جاري الحذف...' : 'حذف المنتج'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
