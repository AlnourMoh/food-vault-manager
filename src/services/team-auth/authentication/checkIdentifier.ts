
import { CheckIdentifierResult } from '../types';
import { mockTeamMembers, mockPhoneUsers } from '../mockData';
import { 
  normalizeIdentifier, 
  isValidTestEmail, 
  isValidTestPhone, 
  isEmailIdentifier 
} from '../identifierUtils';
import { getTeamMemberIdFromIdentifier } from './teamMemberUtils';

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
  
  // If we already have a team member ID and they've set up a password, they're a returning user
  if (teamMemberId && hasSetupPassword) {
    console.log("Returning user identified:", teamMemberId);
    return {
      exists: true,
      isFirstLogin: false,
      hasSetupPassword: true,
      teamMemberId
    };
  }
  
  // If we have a team member ID but they haven't set up a password yet
  if (teamMemberId) {
    console.log("User exists but needs to setup password:", teamMemberId);
    return {
      exists: true,
      isFirstLogin: true,
      hasSetupPassword: false,
      teamMemberId
    };
  }
  
  // If no team member ID yet, check if this is a valid test identifier
  if (isEmailIdentifier(normalizedIdentifier)) {
    // Check email patterns
    if (isValidTestEmail(normalizedIdentifier)) {
      console.log("Valid email user identified. First login:", true);
      return {
        exists: true,
        isFirstLogin: true,
        hasSetupPassword: false
      };
    }
  } else {
    // Check phone patterns
    if (isValidTestPhone(normalizedIdentifier)) {
      console.log("Valid phone user identified. First login:", true);
      return {
        exists: true,
        isFirstLogin: true,
        hasSetupPassword: false
      };
    }
  }
  
  // Default response for non-matching identifiers
  console.log("User not found for identifier:", normalizedIdentifier);
  return {
    exists: false,
    isFirstLogin: false,
    hasSetupPassword: false
  };
};
