
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
  const mockTeamMember = createMockTeamMember(normalizedIdentifier);
  
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
