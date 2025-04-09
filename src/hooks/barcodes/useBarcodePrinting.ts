
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Barcode, LabelSize, LABEL_SIZES, Product } from './types';
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
  const [selectedLabelSize, setSelectedLabelSize] = useState<LabelSize>(LABEL_SIZES[1]); // Default to medium size

  /**
   * Updates the selected label size
   * 
   * @param labelSizeId - The ID of the selected label size
   */
  const changeLabelSize = (labelSizeId: string) => {
    const newSize = LABEL_SIZES.find(size => size.id === labelSizeId);
    if (newSize) {
      setSelectedLabelSize(newSize);
    }
  };

  /**
   * Handles printing all barcodes at once using the browser's print dialog
   * with optimized settings for the selected label size
   */
  const handlePrint = () => {
    // Create a custom print stylesheet with the selected size
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: ${selectedLabelSize.width}mm ${selectedLabelSize.height}mm;
        margin: 0mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .barcode-card {
        width: ${selectedLabelSize.width - 2}mm;
        height: ${selectedLabelSize.height - 2}mm;
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
   * specifically designed for the selected label size
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

    // Adjust font sizes and layout based on label size
    const fontSizes = {
      productName: selectedLabelSize.id === 'small' ? '6pt' : selectedLabelSize.id === 'medium' ? '8pt' : '10pt',
      barcodeNumber: selectedLabelSize.id === 'small' ? '5pt' : selectedLabelSize.id === 'medium' ? '7pt' : '9pt',
      productId: selectedLabelSize.id === 'small' ? '4pt' : selectedLabelSize.id === 'medium' ? '6pt' : '8pt',
    };
    
    // Adjust barcode image height based on label size
    const barcodeHeight = selectedLabelSize.id === 'small' ? '10mm' : selectedLabelSize.id === 'medium' ? '14mm' : '25mm';

    // Create HTML content for printing with appropriate styling for the selected label size
    const barcodeHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>طباعة الباركود - ${product?.name}</title>
        <style>
          @page {
            size: ${selectedLabelSize.width}mm ${selectedLabelSize.height}mm;
            margin: 0mm;
          }
          body {
            margin: 0;
            padding: 2mm;
            background-color: white;
            font-family: Arial, sans-serif;
            width: ${selectedLabelSize.width - 4}mm;
            height: ${selectedLabelSize.height - 4}mm;
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
            font-size: ${fontSizes.productName};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 1mm;
          }
          .barcode-number {
            text-align: center;
            font-family: monospace;
            font-size: ${fontSizes.barcodeNumber};
            margin: 0.5mm 0;
          }
          .barcode-image {
            height: ${barcodeHeight};
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
            font-size: ${fontSizes.productId};
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

  return { 
    handlePrint, 
    handlePrintSingle, 
    selectedLabelSize, 
    changeLabelSize, 
    labelSizes: LABEL_SIZES 
  };
};
