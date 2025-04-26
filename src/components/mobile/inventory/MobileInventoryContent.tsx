
import React, { useState } from 'react';
import MobileProductCard from './MobileProductCard';
import MobileProductSkeleton from './MobileProductSkeleton';
import MobileInventoryEmpty from './MobileInventoryEmpty';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';

interface MobileInventoryContentProps {
  products: Product[] | null;
  isLoading: boolean;
  onProductUpdate: () => void;
  filteredProducts: Product[];
}

const MobileInventoryContent = ({ 
  products, 
  isLoading,
  onProductUpdate,
  filteredProducts 
}: MobileInventoryContentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanningProduct, setScanningProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleScanStart = (product: Product) => {
    setScanningProduct(product);
    setIsScannerOpen(true);
  };

  const handleScanComplete = async (code: string) => {
    if (!scanningProduct) {
      toast({
        title: "خطأ",
        description: "لم يتم تحديد المنتج للمسح",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        throw new Error('معرف المطعم غير موجود');
      }

      // Verify the product code exists and belongs to this product
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id, is_used')
        .eq('qr_code', code)
        .single();

      if (codeError) {
        toast({
          title: "باركود غير صحيح",
          description: "لم يتم العثور على هذا الباركود في النظام",
          variant: "destructive"
        });
        return;
      }

      if (productCode.product_id !== scanningProduct.id) {
        toast({
          title: "باركود غير متطابق",
          description: "هذا الباركود لا يتطابق مع المنتج المحدد",
          variant: "destructive"
        });
        return;
      }

      if (productCode.is_used) {
        toast({
          title: "باركود مستخدم",
          description: "تم استخدام هذا الباركود من قبل",
          variant: "destructive"
        });
        return;
      }

      // Update product quantity and mark code as used
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          quantity: scanningProduct.quantity - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', scanningProduct.id);

      if (updateError) throw updateError;

      // Mark the code as used
      const { error: usedError } = await supabase
        .from('product_codes')
        .update({ 
          is_used: true,
          used_by: restaurantId,
          used_at: new Date().toISOString()
        })
        .eq('qr_code', code);

      if (usedError) throw usedError;

      toast({
        title: "تم تسجيل خروج المنتج",
        description: `تم تسجيل خروج وحدة واحدة من ${scanningProduct.name}`,
      });

      // Refresh the products list
      onProductUpdate();

    } catch (error) {
      console.error('Error processing scan:', error);
      toast({
        title: "خطأ في المعالجة",
        description: "حدث خطأ أثناء معالجة المسح",
        variant: "destructive"
      });
    } finally {
      setIsScannerOpen(false);
      setScanningProduct(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <MobileProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0 || filteredProducts.length === 0) {
    return <MobileInventoryEmpty />;
  }

  return (
    <>
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <MobileProductCard
            key={product.id}
            product={product}
            onSelect={handleProductSelect}
            onRemove={handleScanStart}
          />
        ))}
      </div>

      {isScannerOpen && (
        <BarcodeScanner
          onScan={handleScanComplete}
          onClose={() => {
            setIsScannerOpen(false);
            setScanningProduct(null);
          }}
        />
      )}
    </>
  );
};

export default MobileInventoryContent;
