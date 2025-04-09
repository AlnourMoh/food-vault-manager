
import { useState } from 'react';
import { LabelSize, LABEL_SIZES } from './types';

/**
 * Hook to manage label size selection
 * 
 * @returns Object containing the selected label size and function to change it
 */
export const useLabelSizes = () => {
  // Default to medium size (index 1 in LABEL_SIZES array)
  const [selectedLabelSize, setSelectedLabelSize] = useState<LabelSize>(LABEL_SIZES[1]);

  /**
   * Updates the selected label size
   * 
   * @param labelSizeId - The ID of the selected label size
   */
  const changeLabelSize = (labelSizeId: string) => {
    const newSize = LABEL_SIZES.find(size => size.id === labelSizeId);
    if (newSize) {
      setSelectedLabelSize(newSize);
    }
  };

  return { 
    selectedLabelSize, 
    changeLabelSize, 
    labelSizes: LABEL_SIZES 
  };
};
