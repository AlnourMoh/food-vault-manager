
import { TeamMember } from '../types';
import { normalizeIdentifier, isEmailIdentifier } from '../identifierUtils';
import { mockTeamMembers, mockPhoneUsers } from '../mockData';
import { 
  getTeamMemberIdFromIdentifier, 
  createMockTeamMember,
  syncPasswordsForTeamMember
} from './teamMemberUtils';

/**
 * Set up first-time password for a team member
 */
export const setupTeamMemberPassword = async (
  identifier: string,
  password: string
): Promise<TeamMember> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Setting up password for identifier:", identifier);
  
  const normalizedIdentifier = normalizeIdentifier(identifier);
  
  // First check if we already have a team member ID for this identifier
  let teamMemberId = getTeamMemberIdFromIdentifier(normalizedIdentifier);
  let mockTeamMember: TeamMember;
  
  if (teamMemberId) {
    // We already have a team member, fetch their info
    const existingMember = createMockTeamMember(normalizedIdentifier);
    if (existingMember) {
      mockTeamMember = existingMember;
    } else {
      // Fallback if member not found by ID
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
    }
  } else {
    // Create a new mock team member
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
    
    // Save the association between this identifier and the team member ID
    localStorage.setItem(`teamMemberId:${normalizedIdentifier}`, teamMemberId);
  }
  
  // Save the current identifier for subsequent login
  localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
  
  // Synchronize password between email and phone for the same team member
  syncPasswordsForTeamMember(teamMemberId, password);
  
  console.log("Password setup complete for team member:", mockTeamMember.name);
  
  return mockTeamMember;
};
