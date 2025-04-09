
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Barcode, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Product } from '@/types';
import { format } from 'date-fns';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  isRestaurantRoute: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isRestaurantRoute }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get product initials for the avatar fallback
  const getProductInitials = (productName: string): string => {
    return productName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format date in Gregorian format (DD/MM/YYYY)
  const formatDate = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };
  
  const viewBarcodes = (productId: string) => {
    const barcodesPath = isRestaurantRoute 
      ? `/restaurant/products/${productId}/barcodes` 
      : `/products/${productId}/barcodes`;
    navigate(barcodesPath);
  };

  const editProduct = (productId: string) => {
    const editPath = isRestaurantRoute 
      ? `/restaurant/products/${productId}/edit` 
      : `/products/${productId}/edit`;
    navigate(editPath);
  };
  
  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('products')
        .update({ status: 'removed' })
        .eq('id', product.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم حذف المنتج",
        description: `تم حذف المنتج ${product.name} بنجاح`,
      });
      
      // Refresh the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ في حذف المنتج",
        description: error.message || "حدث خطأ أثناء محاولة حذف المنتج",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Get appropriate placeholder based on product category
  const getPlaceholderImage = (category: string): string => {
    switch (category) {
      case 'خضروات':
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
      case 'لحوم':
        return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=200";
      case 'بهارات':
        return "https://images.unsplash.com/photo-1532336414046-2a0e3a1dd7e5?q=80&w=200";
      case 'بقالة':
        return "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=200";
      default:
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
    }
  };
  
  // Use actual image URL if available, otherwise use placeholder
  const imageUrl = product.imageUrl || getPlaceholderImage(product.category);
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={getPlaceholderImage(product.category)}
                alt="صورة توضيحية للمنتج" 
                className="w-full h-full object-cover opacity-40"
              />
              <Avatar className="h-24 w-24 absolute">
                <AvatarFallback className="text-3xl bg-primary text-white">
                  {getProductInitials(product.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-fvm-primary mb-2">{product.name}</h3>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">التصنيف:</span> 
              <span className="text-gray-800">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">الكمية:</span> 
              <span className="text-gray-800">{product.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">تاريخ الانتهاء:</span>
              <span className={`${new Date(product.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
                {formatDate(new Date(product.expiryDate))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">رقم المنتج:</span>
              <span className="text-gray-800 font-mono text-xs">{product.id.substring(0, 8)}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5 ml-1.5" /> حذف
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => editProduct(product.id)}
                className="text-xs hover:bg-primary/10"
              >
                <Edit className="h-3.5 w-3.5 ml-1.5" /> تعديل
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => viewBarcodes(product.id)}
              className="text-xs hover:bg-fvm-primary hover:text-white"
            >
              <Barcode className="h-3.5 w-3.5 ml-1.5" /> عرض الباركود
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المنتج "{product.name}" من قائمة المخزون الخاص بك.
              هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse space-x-reverse space-x-2">
            <AlertDialogCancel className="order-2">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 order-1"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف المنتج'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductCard;
