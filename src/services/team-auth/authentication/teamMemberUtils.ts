
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
      
      // For better experience, associate all identifiers of this user with the same ID
      // Check if this team member ID is already associated with a phone number
      Object.keys(mockPhoneUsers).forEach(phoneKey => {
        const phoneUser = mockPhoneUsers[phoneKey];
        if (phoneUser.id === teamMemberId) {
          // Associate this phone identifier with the same team member ID
          localStorage.setItem(`teamMemberId:${normalizeIdentifier(phoneUser.phone || phoneKey)}`, teamMemberId);
        }
      });
    }
  } else {
    // Find a matching phone user
    const userKey = Object.keys(mockPhoneUsers).find(key => 
      normalizedIdentifier.includes(key)
    );
    
    if (userKey) {
      teamMemberId = mockPhoneUsers[userKey].id;
      
      // For better experience, associate all identifiers of this user with the same ID
      // Check if this team member ID is already associated with an email
      Object.keys(mockTeamMembers).forEach(emailKey => {
        const emailUser = mockTeamMembers[emailKey];
        if (emailUser.id === teamMemberId) {
          // Associate this email identifier with the same team member ID
          localStorage.setItem(`teamMemberId:${normalizeIdentifier(emailUser.email || emailKey)}`, teamMemberId);
        }
      });
    }
  }
  
  // Save this association for future use
  if (teamMemberId) {
    localStorage.setItem(`teamMemberId:${normalizedIdentifier}`, teamMemberId);
  }
  
  return teamMemberId;
}

/**
 * Create mock team member based on identifier
 */
export function createMockTeamMember(normalizedIdentifier: string): TeamMember | undefined {
  let mockTeamMember: TeamMember | undefined;
  let teamMemberId = getTeamMemberIdFromIdentifier(normalizedIdentifier);
  
  // If we already have a team member ID, find the matching team member
  if (teamMemberId) {
    // Try to find in email users first
    for (const key of Object.keys(mockTeamMembers)) {
      if (mockTeamMembers[key].id === teamMemberId) {
        mockTeamMember = { ...mockTeamMembers[key] };
        break;
      }
    }
    
    // If not found in email users, try phone users
    if (!mockTeamMember) {
      for (const key of Object.keys(mockPhoneUsers)) {
        if (mockPhoneUsers[key].id === teamMemberId) {
          mockTeamMember = { ...mockPhoneUsers[key] };
          break;
        }
      }
    }
    
    // Store the unique identifier used for this session
    if (mockTeamMember) {
      localStorage.setItem('teamMemberIdentifier', normalizedIdentifier);
      return mockTeamMember;
    }
  }
  
  // If no team member ID or not found by ID, fallback to identifier-based search
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

/**
 * Synchronize password between email and phone for the same team member
 */
export function syncPasswordsForTeamMember(teamMemberId: string, password: string): void {
  // Set the password for this team member ID
  localStorage.setItem(`userPassword:${teamMemberId}`, password);
  
  // Mark that this user has set up their password
  localStorage.setItem(`passwordSetup:${teamMemberId}`, 'true');
  
  // Find all identifiers associated with this team member
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('teamMemberId:') && localStorage.getItem(key) === teamMemberId) {
      // We found an identifier associated with this teamMemberId
      // No need to do anything as we're already storing passwords by teamMemberId, not by identifier
    }
  });
  
  console.log(`Password synced for all identifiers of team member ${teamMemberId}`);
}
