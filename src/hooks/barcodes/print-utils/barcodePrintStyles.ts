
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
    
    .product-name {
      text-align: center;
      font-weight: bold;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .product-category {
      text-align: center;
      width: 100%;
      font-size: 0.85em;
      margin-top: 0.5mm;
    }
    
    .barcode-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-grow: 1;
      padding: 1mm 0;
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
      letter-spacing: 1px;
      width: 100%;
      margin-top: -2mm;
    }
    
    .product-id {
      text-align: center;
      color: #666;
      width: 100%;
      margin-top: 1mm;
    }
    
    .product-dates {
      text-align: center;
      width: 100%;
      margin-top: 1mm;
      font-size: 0.85em;
      display: flex;
      flex-direction: column;
      gap: 0.5mm;
    }
    
    .production-date, .expiry-date {
      display: block;
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
        .product-name {
          font-size: 6pt;
          margin-bottom: 0.5mm;
        }
        
        .product-category {
          font-size: 4pt;
          margin-bottom: 0.3mm;
        }
        
        .barcode-image {
          height: 10mm;
          width: 35mm;
          margin: 0.3mm 0;
        }
        
        .barcode-number {
          font-size: 5pt;
        }
        
        .product-id {
          font-size: 4pt;
          margin-top: 0.3mm;
        }
        
        .product-dates {
          font-size: 3.5pt;
          margin-top: 0.3mm;
        }
      `;
    
    case 'medium':
      return `
        .product-name {
          font-size: 8pt;
          margin-bottom: 0.8mm;
        }
        
        .product-category {
          font-size: 6pt;
          margin-bottom: 0.5mm;
        }
        
        .barcode-image {
          height: 15mm;
          width: 45mm;
          margin: 0.5mm 0;
        }
        
        .barcode-number {
          font-size: 7pt;
        }
        
        .product-id {
          font-size: 6pt;
          margin-top: 0.5mm;
        }
        
        .product-dates {
          font-size: 5pt;
          margin-top: 0.5mm;
        }
      `;
    
    case 'large':
    default:
      return `
        .product-name {
          font-size: 10pt;
          margin-bottom: 1mm;
        }
        
        .product-category {
          font-size: 8pt;
          margin-bottom: 0.8mm;
        }
        
        .barcode-image {
          height: 25mm;
          width: 60mm;
          margin: 1mm 0;
        }
        
        .barcode-number {
          font-size: 9pt;
        }
        
        .product-id {
          font-size: 8pt;
          margin-top: 0.8mm;
        }
        
        .product-dates {
          font-size: 7pt;
          margin-top: 0.8mm;
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
