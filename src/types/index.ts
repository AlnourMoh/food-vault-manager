import { ProductStatus, ProductCategory, ProductUnit, TransactionType } from '@/constants/inventory';

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  created_at: string | Date;
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

// Update Product interface to use the new types
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: ProductUnit;
  quantity: number;
  expiryDate: Date;
  entryDate: Date;
  restaurantId: string;
  restaurantName: string;
  addedBy: string;
  status: ProductStatus;
  imageUrl?: string;
}

// Update InventoryTransaction interface to use the new type
export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: TransactionType;
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
