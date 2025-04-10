
import { TeamMember } from './types';

// Mock data for testing and development
export const mockTeamMembers: Record<string, TeamMember> = {
  "admin": {
    id: "12345",
    name: "أحمد محمد",
    email: "admin@example.com",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "test": {
    id: "67890",
    name: "محمد علي",
    email: "test@example.com",
    role: "inventory_manager", 
    restaurantId: "1"
  },
  "demo": {
    id: "54321",
    name: "فاطمة أحمد",
    email: "demo@example.com",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "jhjh": {
    id: "13579",
    name: "خالد عبدالله",
    email: "jhjh@gmail.com",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "zxc": {
    id: "24680",
    name: "نورة سعيد",
    email: "zxc@gmail.com",
    role: "inventory_manager",
    restaurantId: "1"
  }
};

export const mockPhoneUsers: Record<string, TeamMember> = {
  "+974123456789": {
    id: "11223",
    name: "حمد العطية",
    phone: "+974123456789",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "+974987654321": {
    id: "33445",
    name: "مريم الكعبي",
    phone: "+974987654321",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "+9741111111": {
    id: "55667",
    name: "عبدالرحمن المري",
    phone: "+9741111111",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "456789": {
    id: "77889",
    name: "جاسم المهندي",
    phone: "456789",
    role: "inventory_manager",
    restaurantId: "1"
  },
  "123456": {
    id: "99001",
    name: "سارة الكواري",
    phone: "123456",
    role: "inventory_manager",
    restaurantId: "1"
  }
};

// Identifiers that should match existing users for testing
export const validEmailPatterns = [
  "test",
  "demo",
  "admin",
  "jhjh@gmail.com",
  "zxc@gmail.com"
];

export const validPhonePatterns = [
  "+974",
  "974",
  "1111111",
  "123",
  "456"
];
