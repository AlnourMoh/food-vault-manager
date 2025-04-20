
// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  registrationDate: Date;
  isActive: boolean;
}

// Storage Team Member types
export interface StorageTeamMember {
  id: string;
  name: string;
  role: 'manager' | 'team_member';
  phone: string;
  email: string;
  restaurantId: string;
  restaurantName: string;
  joinDate: Date;
  isActive: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  expiryDate: Date;
  entryDate: Date;
  restaurantId: string;
  restaurantName: string;
  addedBy: string;
  status: 'active' | 'expired' | 'removed';
  imageUrl?: string;
}

// Inventory Transaction types
export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
  reason?: string;
  restaurantId: string;
  restaurantName: string;
  performedBy: string;
}

// Dashboard Stats types
export interface DashboardStats {
  totalRestaurants: number;
  totalStorageTeamMembers: number;
  totalProducts: number;
  totalExpiredProducts: number;
  recentTransactions: InventoryTransaction[];
  inventoryValue: number;
  expiringProducts: Product[];
}

// Category data type
export interface CategoryData {
  name: string;
  value: number;
}

// Monthly data type
export interface MonthlyData {
  name: string;
  مبيعات: number;
  منتجات: number;
}

// Dashboard Data type
export interface DashboardData {
  restaurants: Restaurant[];
  storageTeamMembers: StorageTeamMember[];
  products: Product[];
  inventoryTransactions: InventoryTransaction[];
  dashboardStats: DashboardStats;
}
