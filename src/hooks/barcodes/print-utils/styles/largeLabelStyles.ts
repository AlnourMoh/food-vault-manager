
/**
 * Styles specific to large label size (70mm × 50mm)
 */

/**
 * Generates styles specific to large labels
 * @returns CSS styles as a string
 */
export const getLargeLabelStyles = (): string => {
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
};
