
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
   * with optimized settings for small label stickers
   */
  const handlePrint = () => {
    // Create a custom print stylesheet
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: 50mm 30mm; /* حجم ملصق صغير قياسي */
        margin: 0mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .barcode-card {
        width: 48mm;
        height: 28mm;
        padding: 1mm;
        page-break-after: always;
        box-sizing: border-box;
      }
      .barcode-grid {
        display: block !important;
      }
    `;
    document.head.appendChild(style);
    
    // إظهار نافذة الطباعة
    window.print();
    
    // إزالة نمط الطباعة المخصص بعد الطباعة
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  /**
   * Handles printing a single barcode in a new window with optimized print settings
   * specifically designed for small label stickers
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

    // Create HTML content for printing with appropriate styling for small labels
    const barcodeHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>طباعة الباركود - ${product?.name}</title>
        <style>
          @page {
            size: 50mm 30mm; /* حجم ملصق صغير قياسي */
            margin: 0mm;
          }
          body {
            margin: 0;
            padding: 2mm;
            background-color: white;
            font-family: Arial, sans-serif;
            width: 46mm;
            height: 26mm;
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
            font-size: 8pt;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 1mm;
          }
          .barcode-number {
            text-align: center;
            font-family: monospace;
            font-size: 7pt;
            margin: 0.5mm 0;
          }
          .barcode-image {
            height: 14mm;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }
          .barcode-image svg {
            max-width: 100%;
            max-height: 100%;
          }
          .product-id {
            text-align: center;
            font-size: 6pt;
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

  return { handlePrint, handlePrintSingle };
};
