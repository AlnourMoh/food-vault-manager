
import { useToast } from '@/hooks/use-toast';
import { Barcode, Product } from './types';
import { generateBarcodeImage } from '@/utils/barcodeUtils';

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
  const handlePrintSingle = (barcodeId: string, labelSize: { id: string; width: number; height: number }) => {
    // Find the selected barcode to print
    const barcodeToPrint = barcodes.find(b => b.id === barcodeId);
    if (!barcodeToPrint) return;

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

    // Create HTML content for printing with appropriate styling for the selected label size
    const barcodeHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>طباعة الباركود - ${product?.name}</title>
        <style>
          @page {
            size: ${labelSize.width}mm ${labelSize.height}mm;
            margin: 0mm;
          }
          body {
            margin: 0;
            padding: 2mm;
            background-color: white;
            font-family: Arial, sans-serif;
            width: ${labelSize.width - 4}mm;
            height: ${labelSize.height - 4}mm;
            box-sizing: border-box;
            overflow: hidden;
          }
          .barcode-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .product-name {
            text-align: center;
            font-weight: bold;
            font-size: ${labelSize.id === 'small' ? '6pt' : labelSize.id === 'medium' ? '8pt' : '10pt'};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: ${labelSize.id === 'small' ? '0.3mm' : labelSize.id === 'medium' ? '0.5mm' : '1mm'};
          }
          .barcode-number {
            text-align: center;
            font-family: monospace;
            font-size: ${labelSize.id === 'small' ? '5pt' : labelSize.id === 'medium' ? '7pt' : '9pt'};
            margin: 0.5mm 0;
          }
          .barcode-image {
            height: ${labelSize.id === 'small' ? '10mm' : labelSize.id === 'medium' ? '14mm' : '25mm'};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: ${labelSize.id === 'small' ? '0.5mm' : labelSize.id === 'medium' ? '1mm' : '2mm'} 0;
          }
          .barcode-image svg {
            max-width: 100%;
            max-height: 100%;
          }
          .product-id {
            text-align: center;
            font-size: ${labelSize.id === 'small' ? '4pt' : labelSize.id === 'medium' ? '6pt' : '8pt'};
            color: #666;
            margin-top: 0.5mm;
          }
        </style>
      </head>
      <body>
        <div class="barcode-container">
          <div class="product-name">${product?.name || 'منتج غير معروف'}</div>
          <div class="barcode-number">${barcodeToPrint.qr_code}</div>
          <div class="barcode-image">
            ${generateBarcodeImage(barcodeToPrint.qr_code)}
          </div>
          <div class="product-id">رقم المنتج: ${barcodeToPrint.product_id.substring(0, 8)}</div>
        </div>
        <script>
          // Print automatically after loading
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    // Write content to the window and close document
    printWindow.document.write(barcodeHtml);
    printWindow.document.close();
  };

  return { handlePrintSingle };
};
