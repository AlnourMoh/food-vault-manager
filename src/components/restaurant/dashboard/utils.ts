
import { format } from 'date-fns';

// Use a simple cache for formatDate to avoid redundant calculations
const dateFormatCache = new Map<string, string>();

// Format date to Gregorian format with caching
export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  // Check if the formatted date is already in the cache
  if (dateFormatCache.has(dateString)) {
    return dateFormatCache.get(dateString)!;
  }
  
  // If not in cache, format the date and store it
  const formattedDate = format(new Date(dateString), 'dd/MM/yyyy');
  dateFormatCache.set(dateString, formattedDate);
  
  return formattedDate;
};

// Simple cache for product initials
const initialsCache = new Map<string, string>();

// Get product initials for avatar fallback with caching
export const getProductInitials = (productName: string): string => {
  if (!productName) return '';
  
  // Check if the initials are already in the cache
  if (initialsCache.has(productName)) {
    return initialsCache.get(productName)!;
  }
  
  // If not in cache, calculate the initials and store them
  const initials = productName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
    
  initialsCache.set(productName, initials);
  
  return initials;
};
