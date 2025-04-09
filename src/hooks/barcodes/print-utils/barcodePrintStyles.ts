
/**
 * Shared styles for barcode printing
 * This module contains reusable style generators for barcode print functionality
 */

import { LabelSize } from '../types';

/**
 * Generates base styles common to all barcode prints
 * @returns Common CSS styles as a string
 */
export const getBasePrintStyles = (): string => {
  return `
    /* Base print styles */
    body {
      margin: 0;
      padding: 2mm;
      background-color: white;
      font-family: Arial, sans-serif;
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
    
    /* Header section with product info */
    .header {
      width: 100%;
      text-align: center;
      padding-bottom: 0.5mm;
      border-bottom: 0.2mm solid #ddd;
    }
    
    .product-name {
      font-weight: bold;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      line-height: 1.1;
    }
    
    .product-category {
      width: 100%;
      margin: 0;
      line-height: 1.1;
    }
    
    /* Barcode section */
    .barcode-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-grow: 1;
      padding: 0.5mm 0;
    }
    
    .barcode-image svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .barcode-number {
      text-align: center;
      font-family: 'Courier New', monospace;
      font-weight: normal;
      letter-spacing: 0.5px;
      width: 100%;
      margin-top: -1mm;
      line-height: 1;
    }
    
    /* Footer section */
    .footer {
      width: 100%;
      border-top: 0.2mm solid #ddd;
      padding-top: 0.3mm;
      display: flex;
      flex-direction: column;
    }
    
    .product-id {
      color: #555;
      width: 100%;
      line-height: 1.1;
      margin: 0;
    }
    
    .dates-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin: 0;
      line-height: 1;
    }
    
    .production-date, .expiry-date {
      display: inline-block;
      white-space: nowrap;
    }
  `;
};

/**
 * Generates size-specific styles based on label size
 * @param labelSize - The selected label size
 * @returns Size-specific CSS styles as a string
 */
export const getSizeSpecificStyles = (labelSize: LabelSize): string => {
  // Choose styles based on the label size
  switch (labelSize.id) {
    case 'small':
      return `
        .header {
          padding-bottom: 0.3mm;
        }
        
        .product-name {
          font-size: 6pt;
        }
        
        .product-category {
          font-size: 4pt;
        }
        
        .barcode-image {
          height: 10mm;
          width: 35mm;
          margin: 0.2mm 0;
        }
        
        .barcode-number {
          font-size: 5pt;
        }
        
        .footer {
          padding-top: 0.2mm;
        }
        
        .product-id {
          font-size: 4pt;
        }
        
        .dates-container {
          font-size: 3.5pt;
          margin-top: 0.1mm;
        }
      `;
    
    case 'medium':
      return `
        .header {
          padding-bottom: 0.4mm;
        }
        
        .product-name {
          font-size: 8pt;
        }
        
        .product-category {
          font-size: 6pt;
        }
        
        .barcode-image {
          height: 15mm;
          width: 45mm;
          margin: 0.3mm 0;
        }
        
        .barcode-number {
          font-size: 7pt;
        }
        
        .footer {
          padding-top: 0.3mm;
        }
        
        .product-id {
          font-size: 6pt;
        }
        
        .dates-container {
          font-size: 5pt;
          margin-top: 0.2mm;
        }
      `;
    
    case 'large':
    default:
      return `
        .header {
          padding-bottom: 0.6mm;
        }
        
        .product-name {
          font-size: 10pt;
        }
        
        .product-category {
          font-size: 8pt;
        }
        
        .barcode-image {
          height: 25mm;
          width: 60mm;
          margin: 0.5mm 0;
        }
        
        .barcode-number {
          font-size: 9pt;
        }
        
        .footer {
          padding-top: 0.4mm;
        }
        
        .product-id {
          font-size: 8pt;
        }
        
        .dates-container {
          font-size: 7pt;
          margin-top: 0.3mm;
        }
      `;
  }
};

/**
 * Generates page setup styles for a specific label size
 * @param labelSize - The selected label size
 * @returns Page setup CSS styles as a string
 */
export const getPageSetupStyles = (labelSize: LabelSize): string => {
  return `
    @page {
      size: ${labelSize.width}mm ${labelSize.height}mm;
      margin: 0mm;
    }
    
    body {
      width: ${labelSize.width - 4}mm;
      height: ${labelSize.height - 4}mm;
    }
  `;
};

/**
 * Generates the complete stylesheet for barcode printing
 * @param labelSize - The selected label size
 * @returns Complete CSS stylesheet as a string
 */
export const generatePrintStylesheet = (labelSize: LabelSize): string => {
  return `
    ${getPageSetupStyles(labelSize)}
    ${getBasePrintStyles()}
    ${getSizeSpecificStyles(labelSize)}
  `;
};
