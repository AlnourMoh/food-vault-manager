
import { CheckIdentifierResult, AuthenticateResult, TeamMember } from './types';
import { mockTeamMembers, mockPhoneUsers } from './mockData';
import { normalizeIdentifier, isValidTestEmail, isValidTestPhone, isEmailIdentifier } from './identifierUtils';

/**
 * Check if a team member exists by email or phone
 */
export const checkTeamMemberExists = async (
  identifier: string
): Promise<CheckIdentifierResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log("Checking identifier:", identifier);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // Check if user has previously set up a password
  const hasSetupPassword = localStorage.getItem(`passwordSetup:${normalizedIdentifier}`) === 'true';
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Check email patterns
    if (isValidTestEmail(normalizedIdentifier)) {
      const isFirstLogin = normalizedIdentifier.includes('demo') || 
                          normalizedIdentifier.includes('test');
      
      return {
        exists: true,
        isFirstLogin,
        hasSetupPassword: hasSetupPassword
      };
    }
  } else {
    // Check phone patterns
    if (isValidTestPhone(normalizedIdentifier)) {
      return {
        exists: true,
        isFirstLogin: true,
        hasSetupPassword: hasSetupPassword
      };
    }
  }
  
  // Default response for non-matching identifiers
  return {
    exists: false,
    isFirstLogin: false,
    hasSetupPassword: false
  };
};

/**
 * Authenticate a team member by email/phone and password
 */
export const authenticateTeamMember = async (
  identifier: string, 
  password: string
): Promise<AuthenticateResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // Create mock team member based on identifier
  let mockTeamMember: TeamMember | undefined;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Find a matching email user for demo
    const userKey = Object.keys(mockTeamMembers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      mockTeamMember = { ...mockTeamMembers[userKey] };
    }
  } else {
    // Find a matching phone user for demo
    const userKey = Object.keys(mockPhoneUsers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      mockTeamMember = { ...mockPhoneUsers[userKey] };
    }
  }
  
  if (mockTeamMember && password.length >= 6) {
    // Save team member info in localStorage
    localStorage.setItem('teamMemberId', mockTeamMember.id);
    localStorage.setItem('teamMemberName', mockTeamMember.name);
    localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    
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
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // Create appropriate mock team member
  let mockTeamMember: TeamMember;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Find a matching email user for demo
    const userKey = Object.keys(mockTeamMembers).find(key => 
      normalizedIdentifier.includes(key)
    ) || "test";
    
    mockTeamMember = { ...mockTeamMembers[userKey] };
  } else {
    // Find a matching phone user for demo
    const userKey = Object.keys(mockPhoneUsers).find(key => 
      normalizedIdentifier.includes(key)
    ) || Object.keys(mockPhoneUsers)[0];
    
    mockTeamMember = { ...mockPhoneUsers[userKey] };
  }
  
  // Save team member identifier and password for subsequent login
  // BUT don't save the user ID or name - only save the auth information
  localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
  localStorage.setItem('teamMemberPassword', password); // Store password for demo purposes only
  
  // Mark that this user has set up their password
  localStorage.setItem(`passwordSetup:${normalizedIdentifier}`, 'true');
  
  return mockTeamMember;
};

/**
 * Log out the current team member
 */
export const logoutTeamMember = (): void => {
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
  localStorage.removeItem('teamMemberIdentifier');
  localStorage.removeItem('teamMemberPassword');
  // Do NOT remove the passwordSetup flag, as we need to remember this between sessions
};

/**
 * Login a team member using PIN
 * @deprecated Use authenticateTeamMember instead
 */
export const loginTeamMember = async (pin: string): Promise<boolean> => {
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
