
import { Barcode, Product } from './types';
import { useLabelSizes } from './useLabelSizes';
import { useSinglePrint } from './useSinglePrint';
import { useBatchPrint } from './useBatchPrint';

/**
 * Hook for handling barcode printing functionality
 * 
 * @param barcodes - Array of barcodes to be printed
 * @param product - The product associated with the barcodes
 * @returns Object containing functions to handle different printing scenarios
 */
export const useBarcodePrinting = (barcodes: Barcode[], product: Product | null) => {
  // Get label size management functionality
  const { selectedLabelSize, changeLabelSize, labelSizes } = useLabelSizes();
  
  // Get single barcode printing functionality
  const { handlePrintSingle } = useSinglePrint(barcodes, product);
  
  // Get batch printing functionality
  const { handleBatchPrint, printFrameRef } = useBatchPrint();

  /**
   * Wrapper function to print all barcodes with the selected label size
   */
  const handlePrint = () => {
    handleBatchPrint(
      selectedLabelSize.id,
      selectedLabelSize.width,
      selectedLabelSize.height
    );
  };

  /**
   * Wrapper function to print a single barcode with the selected label size
   * 
   * @param barcodeId - The ID of the specific barcode to print
   */
  const printSingleBarcode = (barcodeId: string) => {
    handlePrintSingle(barcodeId, selectedLabelSize);
  };

  return { 
    handlePrint, 
    handlePrintSingle: printSingleBarcode, 
    selectedLabelSize, 
    changeLabelSize, 
    labelSizes,
    printFrameRef
  };
};
