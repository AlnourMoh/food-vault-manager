
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/types';
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

interface RestaurantDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant | null;
  onConfirm: () => void;
}

const RestaurantDeleteDialog: React.FC<RestaurantDeleteDialogProps> = ({
  open,
  onOpenChange,
  restaurant,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    if (!restaurant) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', restaurant.id);

      if (error) throw error;

      toast({
        title: "تم حذف المطعم",
        description: `تم حذف المطعم ${restaurant.name} بنجاح.`,
      });
      
      // Call the onConfirm callback to refresh the restaurants list
      onConfirm();
    } catch (error: any) {
      console.error("Error deleting restaurant:", error);
      toast({
        variant: "destructive",
        title: "خطأ في حذف المطعم",
        description: error.message || "حدث خطأ أثناء محاولة حذف المطعم. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من حذف هذا المطعم؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف المطعم "{restaurant?.name}" نهائياً من النظام. هذا الإجراء لا يمكن التراجع عنه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse space-x-reverse">
          <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'جاري الحذف...' : 'حذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestaurantDeleteDialog;
