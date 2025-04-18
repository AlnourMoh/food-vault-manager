
import { DashboardStats } from '@/types';
import { products } from './products';
import { restaurants } from './restaurants';
import { storageTeamMembers } from './storageTeam';
import { inventoryTransactions } from './transactions';

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
