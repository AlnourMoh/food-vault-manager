
export { restaurants } from './restaurants';
export { storageTeamMembers } from './storageTeam';
export { products } from './products';
export { inventoryTransactions } from './transactions';
export { dashboardStats } from './dashboardStats';

export const getMockData = () => ({
  restaurants,
  storageTeamMembers,
  products,
  inventoryTransactions,
  dashboardStats,
});
