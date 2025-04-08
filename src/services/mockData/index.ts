
import { restaurants } from './restaurants';
import { storageTeamMembers } from './storageTeam';
import { products } from './products';
import { inventoryTransactions } from './transactions';
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

// Also export the individual data collections for direct access
export {
  restaurants,
  storageTeamMembers,
  products,
  inventoryTransactions,
  dashboardStats
};
