
import { useToast } from '@/hooks/use-toast';
import { Barcode, Product, LabelSize } from './types';
import { generateBarcodeImage } from '@/utils/barcodeUtils';
import { generateBarcodeHtml } from './print-utils/barcodeHtmlTemplate';

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

    // Create a new print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Show error if popup blocker is enabled
      toast({
        title: "خطأ في الطباعة",
        description: "فشلت عملية فتح نافذة الطباعة. الرجاء التأكد من السماح بالنوافذ المنبثقة.",
        variant: "destructive",
      });
      return;
    }

    // Generate barcode image HTML
    const barcodeImageHtml = generateBarcodeImage(barcodeToPrint.qr_code);

    // Generate complete HTML document with our template
    const barcodeHtml = generateBarcodeHtml({
      barcode: barcodeToPrint,
      productName: product?.name || '',
      labelSize: labelSize,
      barcodeImageHtml: barcodeImageHtml
    });

    // Write content to the window and close document
    printWindow.document.write(barcodeHtml);
    printWindow.document.close();
  };

  return { handlePrintSingle };
};
