
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
  // Create a linear barcode (EAN/UPC style) to match the provided image
  const barcodeDigits = code.replace(/\D/g, ''); // Only use numeric values
  const svgWidth = 240; // Fixed width for the barcode
  const svgHeight = 80; // Height including the digits below
  const barcodeHeight = 60; // Height of just the bars
  const digitHeight = 20; // Height of the digit area
  
  // Calculate bar widths
  const spaceBetweenBars = 1;
  const thinBarWidth = 2;
  const thickBarWidth = 4;
  const marginSide = 10;
  
  let bars = '';
  let digits = '';
  let xPosition = marginSide;
  
  // Create the barcode pattern
  for (let i = 0; i < barcodeDigits.length; i++) {
    const digit = parseInt(barcodeDigits[i]);
    const digitX = xPosition + (i === 0 ? -2 : 0); // Adjust first digit position
    
    // Add digit below the barcode
    digits += `<text x="${digitX}" y="${barcodeHeight + 15}" font-family="Arial" font-size="12">${digit}</text>`;
    
    // Determine if we need thin or thick bar based on digit value
    // Even digits get thin bars, odd digits get thick bars
    const barWidth = digit % 2 === 0 ? thinBarWidth : thickBarWidth;
    
    // Add a black bar
    bars += `<rect x="${xPosition}" y="0" width="${barWidth}" height="${barcodeHeight}" fill="black" />`;
    xPosition += barWidth + spaceBetweenBars;
    
    // Add a separator after every 6th digit (similar to the example image)
    if (i === 6) {
      xPosition += 6; // Extra space for the separator
    }
  }
  
  // Add guard bars (the longer bars at start, middle and end)
  // Start guard bars
  bars = `<rect x="${marginSide - 8}" y="0" width="${thinBarWidth}" height="${barcodeHeight + 5}" fill="black" />
          <rect x="${marginSide - 4}" y="0" width="${thinBarWidth}" height="${barcodeHeight + 5}" fill="black" />` + bars;
  
  // Middle guard bars (after the 6th digit)
  const middleX = marginSide + (thinBarWidth + spaceBetweenBars) * 12 + 2;
  bars += `<rect x="${middleX}" y="0" width="${thinBarWidth}" height="${barcodeHeight + 5}" fill="black" />
           <rect x="${middleX + 4}" y="0" width="${thinBarWidth}" height="${barcodeHeight + 5}" fill="black" />`;
  
  // End guard bars
  bars += `<rect x="${svgWidth - marginSide - 8}" y="0" width="${thinBarWidth}" height="${barcodeHeight + 5}" fill="black" />
           <rect x="${svgWidth - marginSide - 4}" y="0" width="${thinBarWidth}" height="${barcodeHeight + 5}" fill="black" />`;
  
  // Return the complete SVG
  return `<svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white" />
    ${bars}
    ${digits}
  </svg>`;
};
