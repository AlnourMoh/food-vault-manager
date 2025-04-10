import { TeamMember } from '../types';
import { mockTeamMembers, mockPhoneUsers } from '../mockData';
import { normalizeIdentifier, isEmailIdentifier } from '../identifierUtils';

/**
 * Get team member ID from identifier (email or phone)
 * This function helps associate an email and phone number to the same user
 */
export function getTeamMemberIdFromIdentifier(identifier: string): string | undefined {
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
 * Create mock team member based on identifier
 */
export function createMockTeamMember(normalizedIdentifier: string): TeamMember | undefined {
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
  
  return mockTeamMember;
}
