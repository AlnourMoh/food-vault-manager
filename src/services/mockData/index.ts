
import { restaurants } from './restaurants';
import { storageTeamMembers } from './storageTeam';
import { products } from './products';
import { inventoryTransactions } from './transactions';
import { dashboardStats } from './dashboardStats';

// Export the function to get mock data
export const getMockData = () => {
  return {
    restaurants,
    storageTeamMembers,
    products,
    inventoryTransactions,
    dashboardStats
  };
};

// Also export individual mock data arrays for direct access
export {
  restaurants,
  storageTeamMembers,
  products,
  inventoryTransactions,
  dashboardStats
};
