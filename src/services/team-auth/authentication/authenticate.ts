
import { AuthenticateResult, TeamMember } from '../types';
import { normalizeIdentifier, isEmailIdentifier } from '../identifierUtils';
import { getTeamMemberIdFromIdentifier, createMockTeamMember } from './teamMemberUtils';

/**
 * Authenticate a team member by email/phone and password
 */
export const authenticateTeamMember = async (
  identifier: string, 
  password: string
): Promise<AuthenticateResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log("Authenticating with identifier:", identifier, "and password:", password);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // Get the team member ID associated with this identifier
  const teamMemberId = getTeamMemberIdFromIdentifier(normalizedIdentifier);
  
  // If we don't have a team member ID, authentication fails
  if (!teamMemberId) {
    console.log("Authentication failed: No associated team member found for this identifier");
    return {
      isFirstLogin: false
    };
  }
  
  // Get the stored password for this team member ID
  const storedPassword = localStorage.getItem(`userPassword:${teamMemberId}`);
  const hasSetupPassword = localStorage.getItem(`passwordSetup:${teamMemberId}`) === 'true';
  
  // Create mock team member based on identifier
  const mockTeamMember = createMockTeamMember(normalizedIdentifier);
  
  // For first login case, there may not be a password yet
  if (!storedPassword || !hasSetupPassword) {
    console.log("Authentication failed: No stored password found for this team member");
    return {
      isFirstLogin: true,
      teamMember: mockTeamMember // Return the team member info for convenience
    };
  }
  
  // If we have a stored password, verify it matches exactly
  if (storedPassword !== password) {
    console.log("Authentication failed: Password doesn't match");
    return {
      isFirstLogin: false
    };
  }
  
  // Only authenticate if we found a team member AND the password matches exactly
  if (mockTeamMember) {
    console.log("Authentication successful:", mockTeamMember.name);
    
    // Save team member info in localStorage with correct information
    localStorage.setItem('teamMemberId', mockTeamMember.id);
    localStorage.setItem('teamMemberName', mockTeamMember.name);
    localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
    
    return {
      isFirstLogin: false,
      teamMember: mockTeamMember
    };
  }
  
  console.log("Authentication failed: Unknown reason");
  return {
    isFirstLogin: false,
  };
};
