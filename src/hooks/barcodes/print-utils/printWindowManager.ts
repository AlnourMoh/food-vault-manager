
import { LabelSize, Barcode, Product } from '../types';
import { generateBarcodeHtml } from './barcodeHtmlTemplate';

interface PrintWindowParams {
  barcode: Barcode;
  product: Product | null;
  labelSize: LabelSize;
  barcodeImageHtml: string;
  toast: any;
}

/**
 * Opens a new window for printing with the provided content
 * 
 * @param params - Parameters for the print window
 */
export const openPrintWindow = ({
  barcode,
  product,
  labelSize,
  barcodeImageHtml,
  toast
}: PrintWindowParams): void => {
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

  // Generate complete HTML document with our template
  const barcodeHtml = generateBarcodeHtml({
    barcode,
    productName: product?.name || '',
    productCategory: product?.category,
    productionDate: product?.productionDate,
    expiryDate: product?.expiryDate,
    labelSize,
    barcodeImageHtml
  });

  // Write content to the window and close document
  printWindow.document.write(barcodeHtml);
  printWindow.document.close();

  // Add automatic printing functionality
  setupAutoPrint(printWindow);
};

/**
 * Sets up automatic printing for the print window
 * 
 * @param printWindow - The window to set up auto-printing for
 */
const setupAutoPrint = (printWindow: Window): void => {
  // Add a script to automatically print and close the window
  const script = printWindow.document.createElement('script');
  script.textContent = `
    // Print automatically after loading
    window.onload = function() {
      setTimeout(function() {
        window.print();
        setTimeout(function() {
          window.close();
        }, 500);
      }, 300);
    };
  `;
  printWindow.document.body.appendChild(script);
};
