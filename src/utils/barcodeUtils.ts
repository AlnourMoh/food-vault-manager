
/**
 * Utility functions for barcode generation and display
 */

// Generate a list of barcodes from a product
export const generateBarcodesFromProduct = (product: any) => {
  if (!product || !product.id || !product.quantity) return [];
  
  const generatedBarcodes = [];
  const productDigits = product.id.replace(/-/g, '').substring(0, 8);
  
  for (let i = 0; i < product.quantity; i++) {
    const unitNumber = String(i+1).padStart(4, '0');
    const barcode = `${productDigits}${unitNumber}`;
    
    generatedBarcodes.push({
      id: `${product.id}-${i+1}`,
      product_id: product.id,
      qr_code: barcode,
      is_used: false
    });
  }
  
  return generatedBarcodes;
};

// Generate a barcode SVG visual representation
export const generateBarcodeImage = (code: string) => {
  // Create a more complex visualization using the barcode string
  const barcodeDigits = code.replace(/\D/g, ''); // Only use numeric values
  const barsCount = barcodeDigits.length * 2; // Each digit gets 2 bars
  const svgWidth = barsCount * 3; // 3 pixels per bar
  
  let bars = '';
  let xPosition = 0;
  
  // Create alternating bars with varying widths based on the digits
  for (let i = 0; i < barcodeDigits.length; i++) {
    const digit = parseInt(barcodeDigits[i]);
    
    // Bar width based on digit (1-3 pixels)
    const width1 = (digit % 3) + 1;
    const width2 = ((digit + 1) % 3) + 1;
    
    // Add a black bar
    bars += `<rect x="${xPosition}" y="0" width="${width1}" height="50" fill="black" />`;
    xPosition += width1 + 1; // Add 1 pixel space
    
    // Add a white space (represented by not adding a bar)
    xPosition += 2;
    
    // Add another black bar
    bars += `<rect x="${xPosition}" y="0" width="${width2}" height="50" fill="black" />`;
    xPosition += width2 + 1;
  }
  
  // Add border and return complete SVG
  return `<svg width="100%" height="100%" viewBox="0 0 ${svgWidth} 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${svgWidth}" height="50" fill="white" stroke="black" stroke-width="1" />
    ${bars}
  </svg>`;
};
