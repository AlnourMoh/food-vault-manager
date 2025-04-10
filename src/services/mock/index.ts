
import { restaurants } from './restaurants';
import { storageTeamMembers } from './storageTeamMembers';
import { products } from './products';
import { inventoryTransactions } from './inventoryTransactions';
import { dashboardStats } from './dashboardStats';

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

export {
  restaurants,
  storageTeamMembers,
  products,
  inventoryTransactions,
  dashboardStats
};
