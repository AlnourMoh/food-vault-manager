
import { StorageTeamMember } from '@/types';

export const storageTeamMembers: StorageTeamMember[] = [
  {
    id: '1',
    name: 'محمد الحسن',
    role: 'manager',
    phone: '+966 54 111 2222',
    email: 'mohammed@damascus-house.com',
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    joinDate: new Date('2023-02-01'),
    isActive: true,
  },
  {
    id: '2',
    name: 'عمر محمود',
    role: 'team_member',
    phone: '+966 55 333 4444',
    email: 'omar@damascus-house.com',
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    joinDate: new Date('2023-02-15'),
    isActive: true,
  },
  {
    id: '3',
    name: 'سارة أحمد',
    role: 'manager',
    phone: '+966 50 555 6666',
    email: 'sarah@arabesque.com',
    restaurantId: '2',
    restaurantName: 'مطعم أرابيسك',
    joinDate: new Date('2023-04-05'),
    isActive: true,
  },
];
