
/**
 * Shared styles for barcode printing
 * This module integrates all style modules for barcode print functionality
 */

import { LabelSize } from '../types';
import { getBasePrintStyles } from './styles/baseStyles';
import { getSmallLabelStyles } from './styles/smallLabelStyles';
import { getMediumLabelStyles } from './styles/mediumLabelStyles';
import { getLargeLabelStyles } from './styles/largeLabelStyles';
import { getPageSetupStyles } from './styles/pageSetupStyles';

/**
 * Generates size-specific styles based on label size
 * @param labelSize - The selected label size
 * @returns Size-specific CSS styles as a string
 */
export const getSizeSpecificStyles = (labelSize: LabelSize): string => {
  // Choose styles based on the label size
  switch (labelSize.id) {
    case 'small':
      return getSmallLabelStyles();
    case 'medium':
      return getMediumLabelStyles();
    case 'large':
    default:
      return getLargeLabelStyles();
  }
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
