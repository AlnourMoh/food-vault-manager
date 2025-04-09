
/**
 * Styles specific to medium label size (50mm × 30mm)
 */

/**
 * Generates styles specific to medium labels
 * @returns CSS styles as a string
 */
export const getMediumLabelStyles = (): string => {
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
};
