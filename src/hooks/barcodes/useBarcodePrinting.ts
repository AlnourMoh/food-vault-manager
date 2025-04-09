
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Barcode, Product } from './types';
import { generateBarcodeImage } from '@/utils/barcodeUtils';

/**
 * Hook for handling barcode printing functionality
 * 
 * @param barcodes - Array of barcodes to be printed
 * @param product - The product associated with the barcodes
 * @returns Object containing functions to handle different printing scenarios
 */
export const useBarcodePrinting = (barcodes: Barcode[], product: Product | null) => {
  const { toast } = useToast();
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

  /**
   * Handles printing all barcodes at once using the browser's print dialog
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Handles printing a single barcode in a new window with optimized print settings
   * 
   * @param barcodeId - The ID of the specific barcode to print
   */
  const handlePrintSingle = (barcodeId: string) => {
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

    // Create HTML content for printing with appropriate styling
    const barcodeHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>طباعة الباركود - ${product?.name}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: white;
            font-family: Arial, sans-serif;
          }
          .barcode-container {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            padding: 15px;
            border: 1px solid black;
            background-color: white;
            box-sizing: border-box;
          }
          .product-name {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
          }
          .barcode-number {
            text-align: center;
            font-family: monospace;
            font-size: 16px;
            margin: 10px 0;
          }
          .barcode-image {
            border: 2px solid black;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
          }
          .product-id {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 10px;
          }
          @media print {
            @page {
              size: 80mm 50mm;
              margin: 0;
            }
            .barcode-container {
              border: none;
              width: 100%;
              height: 100%;
              padding: 5mm;
            }
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
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // Write content to the window and close document
    printWindow.document.write(barcodeHtml);
    printWindow.document.close();
  };

  return { handlePrint, handlePrintSingle };
};
