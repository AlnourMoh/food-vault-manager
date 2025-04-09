
import { useBarcodesData } from './useBarcodesData';
import { useBarcodePrinting } from './useBarcodePrinting';
import { Barcode, Product, LabelSize, LABEL_SIZES } from './types';

/**
 * Main hook for barcode functionality that combines data fetching and printing
 * This hook serves as the entry point for all barcode-related operations
 * 
 * @param productId - The ID of the product to retrieve and print barcodes for
 * @returns Combined object with barcode data and printing functionality
 */
export const useBarcodes = (productId: string | undefined) => {
  // Get barcode data (fetch from database or generate)
  const { barcodes, product, isLoading } = useBarcodesData(productId);
  
  // Get barcode printing functionality
  const { 
    handlePrint, 
    handlePrintSingle, 
    selectedLabelSize, 
    changeLabelSize, 
    labelSizes,
    printFrameRef
  } = useBarcodePrinting(barcodes, product);

  // Combine and return all barcode functionality
  return {
    barcodes,             // Array of barcodes for the product
    product,              // Product information
    isLoading,            // Loading state indicator
    handlePrint,          // Function to print all barcodes
    handlePrintSingle,    // Function to print a single barcode
    selectedLabelSize,    // Currently selected label size
    changeLabelSize,      // Function to change the label size
    labelSizes,           // Available label size options
    printFrameRef         // Reference to the print frame (if needed)
  };
};

// Re-export types for easier imports elsewhere
export type { Barcode, Product, LabelSize };
export { LABEL_SIZES };
