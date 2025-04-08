
import { Restaurant } from '@/types';

// Mock restaurants data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'مطعم البيت الدمشقي',
    address: 'شارع الملك عبد الله، الرياض',
    phone: '+966 54 123 4567',
    email: 'info@damascus-house.com',
    manager: 'أحمد محمد',
    registrationDate: new Date('2023-01-15').toISOString(),
    isActive: true,
    created_at: new Date('2023-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'مطعم أرابيسك',
    address: 'طريق الأمير محمد بن سلمان، الرياض',
    phone: '+966 55 987 6543',
    email: 'contact@arabesque.com',
    manager: 'سمير علي',
    registrationDate: new Date('2023-03-22').toISOString(),
    isActive: true,
    created_at: new Date('2023-03-22').toISOString(),
  },
  {
    id: '3',
    name: 'مطعم اللؤلؤة',
    address: 'شارع التحلية، جدة',
    phone: '+966 50 345 6789',
    email: 'pearl@restaurant.com',
    manager: 'خالد العمري',
    registrationDate: new Date('2023-05-10').toISOString(),
    isActive: true,
    created_at: new Date('2023-05-10').toISOString(),
  },
];
