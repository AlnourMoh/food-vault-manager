
import { useBarcodesData } from './useBarcodesData';
import { useBarcodePrinting } from './useBarcodePrinting';
import { Barcode, Product } from './types';

export const useBarcodes = (productId: string | undefined) => {
  const { barcodes, product, isLoading } = useBarcodesData(productId);
  const { handlePrint, handlePrintSingle } = useBarcodePrinting(barcodes, product);

  return {
    barcodes,
    product,
    isLoading,
    handlePrint,
    handlePrintSingle
  };
};

export type { Barcode, Product };
