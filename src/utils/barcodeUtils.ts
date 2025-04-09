
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
  // Create a more accurate EAN/UPC style barcode similar to the image
  const svgWidth = 240;
  const svgHeight = 80;
  const barHeight = 50;
  const textHeight = 15;
  const marginX = 15;
  const marginTop = 5;
  
  // Prepare the barcode data
  const cleanCode = code.replace(/\D/g, '').substring(0, 13); // Clean code and limit to 13 digits
  const paddedCode = cleanCode.padEnd(13, '0'); // Ensure we have 13 digits
  
  // Calculate bar widths and positions
  const barWidth = 2;
  const barGap = 1;
  const digitWidth = 7;
  
  let bars = '';
  let digits = '';
  let xPosition = marginX;
  
  // Start guard bars (taller than regular bars)
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap + 4; // Add a little extra space
  
  // Add the first set of bars and digits
  for (let i = 0; i < 6; i++) {
    const digitVal = parseInt(paddedCode[i]);
    const digitX = marginX + 3 + (i * (digitWidth + 1));
    
    // Add digit below bars
    digits += `<text x="${digitX}" y="${barHeight + textHeight + marginTop}" font-family="Arial" font-size="12" text-anchor="middle">${digitVal}</text>`;
    
    // Add bars (pattern based on digit)
    const patterns = [
      [3, 2, 1, 1], // 0
      [2, 2, 2, 1], // 1
      [2, 1, 2, 2], // 2
      [1, 4, 1, 1], // 3
      [1, 1, 3, 2], // 4
      [1, 2, 3, 1], // 5
      [1, 1, 1, 4], // 6
      [1, 3, 1, 2], // 7
      [1, 2, 1, 3], // 8
      [3, 1, 1, 2]  // 9
    ];
    
    // Generate bars based on the digit pattern
    const pattern = patterns[digitVal % 10];
    for (let j = 0; j < pattern.length; j++) {
      if (j % 2 === 0) { // Only draw black bars
        bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth * pattern[j]}" height="${barHeight}" fill="black" />`;
      }
      xPosition += (barWidth * pattern[j]) + barGap;
    }
  }
  
  // Middle guard bars (taller)
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap + 4; // Add a little extra space
  
  // Add the second set of bars and digits
  for (let i = 6; i < 12; i++) {
    const digitVal = parseInt(paddedCode[i]);
    const digitX = marginX + 85 + ((i-6) * (digitWidth + 1));
    
    // Add digit below bars
    digits += `<text x="${digitX}" y="${barHeight + textHeight + marginTop}" font-family="Arial" font-size="12" text-anchor="middle">${digitVal}</text>`;
    
    // Add bars (pattern based on digit)
    const patterns = [
      [3, 2, 1, 1], // 0
      [2, 2, 2, 1], // 1
      [2, 1, 2, 2], // 2
      [1, 4, 1, 1], // 3
      [1, 1, 3, 2], // 4
      [1, 2, 3, 1], // 5
      [1, 1, 1, 4], // 6
      [1, 3, 1, 2], // 7
      [1, 2, 1, 3], // 8
      [3, 1, 1, 2]  // 9
    ];
    
    // Generate bars based on the digit pattern
    const pattern = patterns[digitVal % 10];
    for (let j = 0; j < pattern.length; j++) {
      if (j % 2 === 0) { // Only draw black bars
        bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth * pattern[j]}" height="${barHeight}" fill="black" />`;
      }
      xPosition += (barWidth * pattern[j]) + barGap;
    }
  }
  
  // End guard bars (taller)
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  xPosition += barWidth + barGap;
  bars += `<rect x="${xPosition}" y="${marginTop}" width="${barWidth}" height="${barHeight + 5}" fill="black" />`;
  
  // Add the checksum digit at the end
  const checksumX = xPosition + 10;
  const checksumDigit = paddedCode[12];
  digits += `<text x="${checksumX}" y="${barHeight + textHeight + marginTop}" font-family="Arial" font-size="12" text-anchor="middle">${checksumDigit}</text>`;
  
  // Return the complete SVG
  return `<svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white" />
    ${bars}
    ${digits}
  </svg>`;
};
