
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFetchProductInfo } from './product/useFetchProductInfo';
import { useProductSubmission } from './product/useProductSubmission';
import { useLocalStorageSetup } from './utils/useLocalStorageSetup';
import type { ToastAPI } from '@/hooks/use-toast.d';

export const useProductAddition = () => {
  // استخراج دالة toast التي تطابق واجهة ToastAPI
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('1');
  
  // Setup default localStorage values
  useLocalStorageSetup();
  
  // Use custom hooks for fetching product info and handling submission
  const { productInfo, loading, fetchProductInfo } = useFetchProductInfo(toast);
  const { handleAddProduct, loading: submissionLoading } = useProductSubmission(
    barcode, 
    quantity, 
    productInfo, 
    toast, 
    () => {
      // Reset form after successful submission
      setBarcode('');
      setQuantity('1');
    }
  );
  
  // Fetch product info when barcode changes
  useEffect(() => {
    if (barcode) {
      fetchProductInfo(barcode);
    }
  }, [barcode, fetchProductInfo]);

  const handleScanResult = (result: string) => {
    console.log("Scan result:", result);
    setBarcode(result);
    setScanning(false);
  };

  return {
    scanning,
    setScanning,
    barcode,
    setBarcode,
    quantity,
    setQuantity,
    productInfo,
    loading: loading || submissionLoading,
    handleScanResult,
    handleAddProduct
  };
};
