
// This file is maintained for backward compatibility
// It re-exports everything from the new structure
import { getMockData } from './mock';

export { getMockData };

// Re-export individual mock data sets for direct imports
export {
  restaurants,
  storageTeamMembers,
  products,
  inventoryTransactions,
  dashboardStats
} from './mock';
