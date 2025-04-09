
import { useRef } from 'react';

/**
 * Hook for handling batch printing functionality
 * 
 * @returns Function to handle printing all barcodes at once
 */
export const useBatchPrint = () => {
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

  /**
   * Handles printing all barcodes at once using the browser's print dialog
   * with optimized settings for the selected label size
   * 
   * @param labelSizeId - The ID of the selected label size
   * @param labelWidth - The width of the label in mm
   * @param labelHeight - The height of the label in mm
   */
  const handleBatchPrint = (labelSizeId: string, labelWidth: number, labelHeight: number) => {
    // Add label size class to body for CSS targeting
    document.body.classList.add(`label-size-${labelSizeId}`);
    
    // Create a custom print stylesheet with the selected size
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: ${labelWidth}mm ${labelHeight}mm;
        margin: 0mm;
      }
    `;
    document.head.appendChild(style);
    
    // Show print dialog
    window.print();
    
    // Clean up after printing
    setTimeout(() => {
      document.head.removeChild(style);
      document.body.classList.remove(`label-size-${labelSizeId}`);
    }, 1000);
  };

  return { 
    handleBatchPrint,
    printFrameRef 
  };
};
