
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
 * @deprecated Use authenticateTeamMember instead
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
 * Check if a team member exists by email or phone
 */
export const checkTeamMemberExists = async (
  identifier: string
): Promise<{ exists: boolean; isFirstLogin: boolean }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes:
  // "demo@example.com" or "0501234567" exists but hasn't set a password
  if (identifier === "demo@example.com" || identifier === "0501234567") {
    return {
      exists: true,
      isFirstLogin: true
    };
  }
  
  // "admin@example.com" or "0509876543" exists and has set a password
  if (identifier === "admin@example.com" || identifier === "0509876543") {
    return {
      exists: true,
      isFirstLogin: false
    };
  }
  
  // For demo, any other identifier doesn't exist
  return {
    exists: false,
    isFirstLogin: false
  };
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
  
  // For this demo, successful authentication for existing users
  if (identifier === "admin@example.com" || identifier === "0509876543") {
    if (password.length < 6) {
      return {
        isFirstLogin: false,
      };
    }
    
    const mockTeamMember: TeamMember = {
      id: "12345",
      name: "أحمد محمد",
      email: identifier.includes('@') ? identifier : undefined,
      phone: !identifier.includes('@') ? identifier : undefined,
      role: "inventory_manager",
      restaurantId: localStorage.getItem('restaurantId') || "1"
    };
    
    // Save team member info in localStorage
    localStorage.setItem('teamMemberId', mockTeamMember.id);
    localStorage.setItem('teamMemberName', mockTeamMember.name);
    
    return {
      isFirstLogin: false,
      teamMember: mockTeamMember
    };
  }
  
  return {
    isFirstLogin: false,
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
  
  // Save team member info in localStorage
  localStorage.setItem('teamMemberId', mockTeamMember.id);
  localStorage.setItem('teamMemberName', mockTeamMember.name);
  
  return mockTeamMember;
};

/**
 * Log out the current team member
 */
export const logoutTeamMember = (): void => {
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
};
