
import { useToast } from '@/hooks/use-toast';
import { Barcode, Product, LabelSize } from './types';
import { generateBarcodeImage } from '@/utils/barcodeUtils';
import { openPrintWindow } from './print-utils/printWindowManager';

/**
 * Hook for handling single barcode printing functionality
 * 
 * @param barcodes - Array of barcodes to select from for printing
 * @param product - The product associated with the barcodes
 * @returns Function to handle printing a single barcode
 */
export const useSinglePrint = (barcodes: Barcode[], product: Product | null) => {
  const { toast } = useToast();

  /**
   * Handles printing a single barcode in a new window with optimized print settings
   * 
   * @param barcodeId - The ID of the specific barcode to print
   * @param labelSize - The selected label size for printing
   */
  const handlePrintSingle = (barcodeId: string, labelSize: LabelSize) => {
    // Find the selected barcode to print
    const barcodeToPrint = barcodes.find(b => b.id === barcodeId);
    if (!barcodeToPrint) {
      console.error('Barcode not found:', barcodeId);
      return;
    }

    // Generate barcode image HTML
    const barcodeImageHtml = generateBarcodeImage(barcodeToPrint.qr_code);

    // Open a print window with the generated HTML content
    openPrintWindow({
      barcode: barcodeToPrint,
      productName: product?.name || '',
      labelSize: labelSize,
      barcodeImageHtml: barcodeImageHtml,
      toast
    });
  };

  return { handlePrintSingle };
};
