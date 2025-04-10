
// This file provides mock authentication services for team members
// In a real app, these would connect to your backend API

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  restaurantId: string;
}

/**
 * Login a team member using PIN
 */
export const loginTeamMember = async (pin: string): Promise<boolean> => {
  // This is a mock implementation
  // In a real app, this would validate the PIN against your backend
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For this demo, any pin with at least 4 characters works
  const success = pin.length >= 4;
  
  if (success) {
    // Store team member info in localStorage
    localStorage.setItem('teamMemberId', '123456');
    localStorage.setItem('teamMemberName', 'فريق المخزن');
  }
  
  return success;
};

/**
 * Authenticate a team member by email/phone and password
 */
export const authenticateTeamMember = async (
  identifier: string, 
  password: string
): Promise<{ isFirstLogin: boolean; teamMember?: TeamMember }> => {
  // This is a mock implementation
  // In a real app, this would call your backend API
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if this is a first login (demo accounts)
  if (identifier === "demo@example.com" || identifier === "0501234567") {
    return {
      isFirstLogin: true,
    };
  }
  
  // For this mock, any other login works
  const mockTeamMember: TeamMember = {
    id: "12345",
    name: "أحمد محمد",
    email: identifier.includes('@') ? identifier : undefined,
    phone: !identifier.includes('@') ? identifier : undefined,
    role: "inventory_manager",
    restaurantId: localStorage.getItem('restaurantId') || "1"
  };
  
  return {
    isFirstLogin: false,
    teamMember: mockTeamMember
  };
};

/**
 * Set up first-time password for a team member
 */
export const setupTeamMemberPassword = async (
  identifier: string,
  password: string
): Promise<TeamMember> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock team member
  const mockTeamMember: TeamMember = {
    id: "12345",
    name: "أحمد محمد",
    email: identifier.includes('@') ? identifier : undefined,
    phone: !identifier.includes('@') ? identifier : undefined,
    role: "inventory_manager",
    restaurantId: localStorage.getItem('restaurantId') || "1"
  };
  
  return mockTeamMember;
};

/**
 * Log out the current team member
 */
export const logoutTeamMember = (): void => {
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
};
