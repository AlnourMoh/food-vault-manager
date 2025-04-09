
/**
 * Styles specific to small label size (40mm × 25mm)
 */

/**
 * Generates styles specific to small labels
 * @returns CSS styles as a string
 */
export const getSmallLabelStyles = (): string => {
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
};
