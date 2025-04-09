
/**
 * Base print styles common to all barcode prints regardless of size
 */

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
