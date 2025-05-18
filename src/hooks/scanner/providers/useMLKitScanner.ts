
import { useMLKitScanner as useRefactoredMLKitScanner } from '../mlkit/useMLKitScanner';

/**
 * هوك للتعامل مع الماسح الضوئي MLKit
 * This is a wrapper around the refactored version for backward compatibility
 */
export const useMLKitScanner = () => {
  return useRefactoredMLKitScanner();
};
