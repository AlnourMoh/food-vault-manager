
import { InventoryTransaction } from '@/types';

export const inventoryTransactions: InventoryTransaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'أرز بسمتي',
    type: 'in',
    quantity: 50,
    date: new Date('2023-06-15'),
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    performedBy: 'محمد الحسن',
  },
  {
    id: '2',
    productId: '2',
    productName: 'دجاج مجمد',
    type: 'in',
    quantity: 30,
    date: new Date('2023-07-01'),
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    performedBy: 'عمر محمود',
  },
  {
    id: '3',
    productId: '2',
    productName: 'دجاج مجمد',
    type: 'out',
    quantity: 5,
    date: new Date('2023-07-10'),
    reason: 'استخدام في المطبخ',
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    performedBy: 'عمر محمود',
  },
];
