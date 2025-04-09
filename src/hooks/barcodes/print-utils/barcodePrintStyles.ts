
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
      border: 1px solid black;
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
    
    case 'medium':
      return `
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
    
    case 'large':
    default:
      return `
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
