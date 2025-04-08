import { 
  Restaurant, 
  StorageTeamMember, 
  Product, 
  InventoryTransaction, 
  DashboardStats 
} from '@/types';

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

// Mock storage team members data
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

// Mock products data
export const products: Product[] = [
  {
    id: '1',
    name: 'أرز بسمتي',
    category: 'حبوب',
    unit: 'كيلوغرام',
    quantity: 50,
    expiryDate: new Date('2024-06-30'),
    entryDate: new Date('2023-06-15'),
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    addedBy: 'محمد الحسن',
    status: 'active',
  },
  {
    id: '2',
    name: 'دجاج مجمد',
    category: 'لحوم',
    unit: 'كيلوغرام',
    quantity: 30,
    expiryDate: new Date('2024-01-30'),
    entryDate: new Date('2023-07-01'),
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    addedBy: 'عمر محمود',
    status: 'active',
  },
  {
    id: '3',
    name: 'زيت زيتون',
    category: 'زيوت',
    unit: 'لتر',
    quantity: 20,
    expiryDate: new Date('2024-12-25'),
    entryDate: new Date('2023-06-20'),
    restaurantId: '2',
    restaurantName: 'مطعم أرابيسك',
    addedBy: 'سارة أحمد',
    status: 'active',
  },
  {
    id: '4',
    name: 'طماطم',
    category: 'خضروات',
    unit: 'كيلوغرام',
    quantity: 15,
    expiryDate: new Date('2023-07-25'),
    entryDate: new Date('2023-07-10'),
    restaurantId: '1',
    restaurantName: 'مطعم البيت الدمشقي',
    addedBy: 'محمد الحسن',
    status: 'expired',
  },
];

// Mock inventory transactions data
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

// Mock dashboard stats
export const dashboardStats: DashboardStats = {
  totalRestaurants: restaurants.length,
  totalStorageTeamMembers: storageTeamMembers.length,
  totalProducts: products.filter(p => p.status === 'active').length,
  totalExpiredProducts: products.filter(p => p.status === 'expired').length,
  recentTransactions: inventoryTransactions.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5),
  inventoryValue: 45000,
  expiringProducts: products.filter(p => {
    const today = new Date();
    const expiryDate = new Date(p.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && p.status === 'active';
  }),
};

// Function to get mock data
export const getMockData = () => {
  return {
    restaurants,
    storageTeamMembers,
    products,
    inventoryTransactions,
    dashboardStats,
  };
};
