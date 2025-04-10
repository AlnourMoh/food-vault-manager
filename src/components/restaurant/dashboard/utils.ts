
import { format } from 'date-fns';

// Format date to Gregorian format
export const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy');
};

// Get product initials for avatar fallback
export const getProductInitials = (productName: string): string => {
  return productName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
