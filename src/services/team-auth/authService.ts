
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
  
  // Get the team member ID associated with this identifier
  const teamMemberId = getTeamMemberIdFromIdentifier(normalizedIdentifier);
  
  // Check if user has previously set up a password (using team member ID for consistency)
  const hasSetupPassword = teamMemberId ? 
    localStorage.getItem(`passwordSetup:${teamMemberId}`) === 'true' : false;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Check email patterns
    if (isValidTestEmail(normalizedIdentifier)) {
      const isFirstLogin = normalizedIdentifier.includes('demo') || 
                          normalizedIdentifier.includes('test');
      
      return {
        exists: true,
        isFirstLogin,
        hasSetupPassword: hasSetupPassword,
        teamMemberId
      };
    }
  } else {
    // Check phone patterns
    if (isValidTestPhone(normalizedIdentifier)) {
      return {
        exists: true,
        isFirstLogin: true,
        hasSetupPassword: hasSetupPassword,
        teamMemberId
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
 * Get team member ID from identifier (email or phone)
 * This function helps associate an email and phone number to the same user
 */
function getTeamMemberIdFromIdentifier(identifier: string): string | undefined {
  // Normalize the identifier
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // First check if we already have a stored team member ID for this identifier
  const storedId = localStorage.getItem(`teamMemberId:${normalizedIdentifier}`);
  if (storedId) {
    return storedId;
  }
  
  // Otherwise, try to find a matching user
  let teamMemberId: string | undefined;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Find a matching email user
    const userKey = Object.keys(mockTeamMembers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      teamMemberId = mockTeamMembers[userKey].id;
    }
  } else {
    // Find a matching phone user
    const userKey = Object.keys(mockPhoneUsers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      teamMemberId = mockPhoneUsers[userKey].id;
    }
  }
  
  return teamMemberId;
}

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
  
  // Get the team member ID associated with this identifier
  const teamMemberId = getTeamMemberIdFromIdentifier(normalizedIdentifier);
  
  // If we don't have a team member ID, authentication fails
  if (!teamMemberId) {
    console.log("No associated team member found for this identifier");
    return {
      isFirstLogin: false
    };
  }
  
  // Get the stored password for this team member ID
  const storedPassword = localStorage.getItem(`userPassword:${teamMemberId}`);
  
  // If we have a stored password, verify it matches exactly
  if (!storedPassword || storedPassword !== password) {
    console.log("Password verification failed: Stored password doesn't match provided password");
    return {
      isFirstLogin: false
    };
  }
  
  // Create mock team member based on identifier
  let mockTeamMember: TeamMember | undefined;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Find a matching email user for demo
    const userKey = Object.keys(mockTeamMembers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      mockTeamMember = { ...mockTeamMembers[userKey] };
      
      // Store the unique identifier used for this session
      localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    }
  } else {
    // Find a matching phone user for demo
    const userKey = Object.keys(mockPhoneUsers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      mockTeamMember = { ...mockPhoneUsers[userKey] };
      
      // Store the unique identifier used for this session
      localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    }
  }
  
  // Only authenticate if we found a team member AND the password matches exactly
  if (mockTeamMember && storedPassword === password) {
    // Save team member info in localStorage
    localStorage.setItem('teamMemberId', mockTeamMember.id);
    localStorage.setItem('teamMemberName', mockTeamMember.name);
    
    // Save the association between this identifier and the team member ID for future reference
    localStorage.setItem(`teamMemberId:${normalizedIdentifier}`, mockTeamMember.id);
    
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
  
  // Get or create appropriate mock team member
  let mockTeamMember: TeamMember;
  let teamMemberId: string;
  
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Find a matching email user for demo
    const userKey = Object.keys(mockTeamMembers).find(key => 
      normalizedIdentifier.includes(key)
    ) || "test";
    
    mockTeamMember = { ...mockTeamMembers[userKey] };
    teamMemberId = mockTeamMember.id;
  } else {
    // Find a matching phone user for demo
    const userKey = Object.keys(mockPhoneUsers).find(key => 
      normalizedIdentifier.includes(key)
    ) || Object.keys(mockPhoneUsers)[0];
    
    mockTeamMember = { ...mockPhoneUsers[userKey] };
    teamMemberId = mockTeamMember.id;
  }
  
  // Save the current identifier for subsequent login
  localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
  
  // Save the association between this identifier and the team member ID
  localStorage.setItem(`teamMemberId:${normalizedIdentifier}`, teamMemberId);
  
  // Store the password by team member ID (not by identifier)
  // This way the same password works for both email and phone
  localStorage.setItem(`userPassword:${teamMemberId}`, password);
  
  // Mark that this user has set up their password (by team member ID)
  localStorage.setItem(`passwordSetup:${teamMemberId}`, 'true');
  
  return mockTeamMember;
};

/**
 * Log out the current team member
 */
export const logoutTeamMember = (): void => {
  localStorage.removeItem('teamMemberId');
  localStorage.removeItem('teamMemberName');
  localStorage.removeItem('teamMemberIdentifier');
  // Do NOT remove the passwordSetup flag or user password, as we need to remember this between sessions
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
