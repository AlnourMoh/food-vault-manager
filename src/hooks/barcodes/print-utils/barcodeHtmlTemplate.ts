
/**
 * HTML template generator for barcode printing
 * Creates the complete HTML document for printing barcodes
 */

import { LabelSize } from '../types';
import { generatePrintStylesheet } from './barcodePrintStyles';
import { format } from 'date-fns';

interface BarcodeTemplateParams {
  barcode: {
    id: string;
    product_id: string;
    qr_code: string;
  };
  productName: string;
  productCategory?: string;
  productionDate?: Date | string | null;
  expiryDate?: Date | string | null;
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
  productCategory,
  productionDate,
  expiryDate,
  labelSize,
  barcodeImageHtml
}: BarcodeTemplateParams): string => {
  // Generate complete stylesheet based on label size
  const styleSheet = generatePrintStylesheet(labelSize);
  
  // Format dates for display if they exist
  const formattedProductionDate = productionDate 
    ? format(new Date(productionDate), 'yyyy-MM-dd') 
    : '';
  
  const formattedExpiryDate = expiryDate 
    ? format(new Date(expiryDate), 'yyyy-MM-dd') 
    : '';
  
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
        ${productCategory ? `<div class="product-category">التصنيف: ${productCategory}</div>` : ''}
        <div class="barcode-image">
          ${barcodeImageHtml}
        </div>
        <div class="barcode-number">${barcode.qr_code}</div>
        <div class="product-id">رقم المنتج: ${barcode.product_id.substring(0, 8)}</div>
        <div class="product-dates">
          ${formattedProductionDate ? `<span class="production-date">تاريخ الإنتاج: ${formattedProductionDate}</span>` : ''}
          ${formattedExpiryDate ? `<span class="expiry-date">تاريخ الانتهاء: ${formattedExpiryDate}</span>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
};
