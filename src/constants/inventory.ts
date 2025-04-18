
// Product Status Types
export enum ProductStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REMOVED = 'removed'
}

// Product Categories
export const PRODUCT_CATEGORIES = [
  'بقالة',
  'لحوم',
  'ألبان',
  'خضروات',
  'فواكه',
  'بهارات',
  'زيوت',
  'مجمدات',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Product Units
export const PRODUCT_UNITS = [
  { value: 'kg', label: 'كيلوغرام' },
  { value: 'g', label: 'غرام' },
  { value: 'l', label: 'لتر' },
  { value: 'ml', label: 'مليلتر' },
  { value: 'piece', label: 'قطعة' },
  { value: 'box', label: 'صندوق' },
  { value: 'pack', label: 'عبوة' },
] as const;

export type ProductUnit = typeof PRODUCT_UNITS[number]['value'];

// Transaction Types
export enum TransactionType {
  IN = 'in',
  OUT = 'out'
}
