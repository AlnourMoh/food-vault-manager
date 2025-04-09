
/**
 * HTML template generator for barcode printing
 * Creates the complete HTML document for printing barcodes
 */

import { LabelSize } from '../types';
import { generatePrintStylesheet } from './barcodePrintStyles';

interface BarcodeTemplateParams {
  barcode: {
    id: string;
    product_id: string;
    qr_code: string;
  };
  productName: string;
  labelSize: LabelSize;
  barcodeImageHtml: string;
}

/**
 * Generates a complete HTML document for printing a single barcode
 * 
 * @param params - Parameters for the barcode template
 * @returns Complete HTML document as a string
 */
export const generateBarcodeHtml = ({
  barcode,
  productName,
  labelSize,
  barcodeImageHtml
}: BarcodeTemplateParams): string => {
  // Generate complete stylesheet based on label size
  const styleSheet = generatePrintStylesheet(labelSize);
  
  return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>طباعة الباركود - ${productName}</title>
      <style>${styleSheet}</style>
    </head>
    <body>
      <div class="barcode-container">
        <div class="product-name">${productName || 'منتج غير معروف'}</div>
        <div class="barcode-image">
          ${barcodeImageHtml}
        </div>
        <div class="product-id">رقم المنتج: ${barcode.product_id.substring(0, 8)}</div>
      </div>
    </body>
    </html>
  `;
};
