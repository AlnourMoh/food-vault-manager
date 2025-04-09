
import { useToast } from '@/hooks/use-toast';
import { Barcode, Product, LabelSize } from './types';
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
  const handlePrintSingle = (barcodeId: string, labelSize: LabelSize) => {
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

    // Create HTML content for printing leveraging our modular print styles
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
          
          /* Base print styles */
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
          
          /* Container styles */
          .barcode-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }
          
          /* Applying styles based on label size classes from our CSS modules */
          ${getLabelSpecificStyles(labelSize.id)}
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

  /**
   * Generate CSS styles specific to the selected label size
   * This extracts the style logic to a separate function to keep the code clean
   * 
   * @param labelSizeId - The ID of the selected label size
   * @returns CSS styles as a string
   */
  const getLabelSpecificStyles = (labelSizeId: string): string => {
    // Common styles for all label sizes
    const baseStyles = `
      .product-name {
        text-align: center;
        font-weight: bold;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .barcode-number {
        text-align: center;
        font-family: monospace;
        width: 100%;
      }
      
      .barcode-image {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      
      .barcode-image svg {
        width: 100%;
        height: 100%;
      }
      
      .product-id {
        text-align: center;
        color: #666;
        width: 100%;
      }
    `;
    
    // Size-specific styles that mirror our CSS modules
    let sizeStyles = '';
    
    switch (labelSizeId) {
      case 'small':
        sizeStyles = `
          .product-name {
            font-size: 6pt;
            margin-bottom: 0.3mm;
          }
          
          .barcode-number {
            font-size: 5pt;
            margin: 0.5mm 0;
          }
          
          .barcode-image {
            height: 10mm;
            width: 30mm;
            margin: 0.5mm 0;
          }
          
          .product-id {
            font-size: 4pt;
            margin-top: 0.5mm;
          }
        `;
        break;
      
      case 'medium':
        sizeStyles = `
          .product-name {
            font-size: 8pt;
            margin-bottom: 0.5mm;
          }
          
          .barcode-number {
            font-size: 7pt;
            margin: 0.5mm 0;
          }
          
          .barcode-image {
            height: 14mm;
            width: 40mm;
            margin: 1mm 0;
          }
          
          .product-id {
            font-size: 6pt;
            margin-top: 0.5mm;
          }
        `;
        break;
      
      case 'large':
      default:
        sizeStyles = `
          .product-name {
            font-size: 10pt;
            margin-bottom: 1mm;
          }
          
          .barcode-number {
            font-size: 9pt;
            margin: 0.5mm 0;
          }
          
          .barcode-image {
            height: 25mm;
            width: 60mm;
            margin: 2mm 0;
          }
          
          .product-id {
            font-size: 8pt;
            margin-top: 0.5mm;
          }
        `;
        break;
    }
    
    return baseStyles + sizeStyles;
  };

  return { handlePrintSingle };
};
